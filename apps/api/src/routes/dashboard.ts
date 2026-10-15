import { Router } from "express";
import { prisma } from "../db.js";
import { overallProgress, subjectProgress } from "../services/progress.js";
import { mergeActivity, calcStreak, utcDayStart, dayKey } from "../services/activity.js";

export const dashboardRouter = Router();

async function getOrCreateProfile() {
  let profile = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        name: "Aspirant",
        examTarget: "GATE 2027 CS",
        startDate: new Date(),
        targetDate: new Date("2027-02-06T00:00:00Z"),
        dailyStudyMinutes: 240,
      },
    });
  }
  return profile;
}

/**
 * GET /api/dashboard?date=YYYY-MM-DD
 * Single aggregate for the Axiom dashboard. All progress values are computed
 * from stored completion data — nothing is hardcoded.
 */
dashboardRouter.get("/dashboard", async (req, res) => {
  const profile = await getOrCreateProfile();
  const dateParam = typeof req.query.date === "string" ? req.query.date : null;
  const ref = dateParam ? new Date(dateParam + "T00:00:00.000Z") : new Date();
  const dayStart = utcDayStart(ref);
  const dayEnd = new Date(dayStart);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  const overall = await overallProgress(profile.id);

  const subjectRows = await prisma.subject.findMany({ orderBy: { displayOrder: "asc" } });
  const subjects = await Promise.all(
    subjectRows.map(async (s) => {
      const p = await subjectProgress(profile.id, s.id);
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        isSample: s.isSample,
        topicCompleted: p.completed,
        topicTotal: p.total,
        progress: p.percent,
      };
    })
  );

  // Active plan for the requested day, else latest active, else latest overall.
  const plans = await prisma.studyPlan.findMany({ orderBy: { createdAt: "desc" } });
  const activeOnDay = plans.find(
    (p) => p.status === "ACTIVE" && p.startDate <= dayEnd && p.targetDate >= dayStart
  );
  const plan =
    activeOnDay ??
    plans.find((p) => p.status === "ACTIVE") ??
    plans[0] ??
    null;

  const tasks = plan
    ? await prisma.studyTask.findMany({
        where: { studyPlanId: plan.id, scheduledDate: { gte: dayStart, lt: dayEnd } },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        include: {
          topic: { select: { id: true, name: true, chapterId: true } },
          resource: { select: { id: true, title: true, url: true } },
        },
      })
    : [];

  const checkins = await prisma.checkin.findMany({
    where: { profileId: profile.id },
    orderBy: { date: "asc" },
    take: 500,
  });
  const completedTasks = await prisma.studyTask.findMany({
    where: { status: "COMPLETED" },
    select: { scheduledDate: true, estimatedMinutes: true },
  });
  const activityMap = mergeActivity(checkins, completedTasks);
  const activity = [...activityMap.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
  const streak = calcStreak(activityMap, ref);

  const revisions = await prisma.revisionSchedule.findMany({
    where: { status: { in: ["PENDING", "OVERDUE"] } },
    orderBy: { scheduledDate: "asc" },
    take: 10,
    include: { topic: { select: { id: true, name: true, chapterId: true } } },
  });

  res.json({
    profile,
    date: dayKey(ref),
    overall,
    subjects,
    planId: plan?.id ?? null,
    tasks,
    activity,
    streak,
    revisions: revisions.map((r) => ({
      id: r.id,
      status: r.status,
      scheduledDate: r.scheduledDate,
      topicId: r.topic.id,
      topicName: r.topic.name,
      chapterId: r.topic.chapterId,
    })),
  });
});
