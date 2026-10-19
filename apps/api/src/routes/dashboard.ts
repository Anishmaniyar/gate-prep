import { Router } from "express";
import { prisma } from "../db.js";
import { overallProgress, subjectProgress } from "../services/progress.js";
import { mergeActivity, calcStreak, isActiveDay, utcDayStart, dayKey } from "../services/activity.js";

export const dashboardRouter = Router();

async function getOrCreateProfile() {
  let profile = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        name: "Anish",
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
 * One activity map per profile: manual check-ins merged with completed tasks.
 * Shared by the dashboard aggregate and the lightweight streak endpoint.
 */
async function loadActivity(profileId: string) {
  const [checkins, completedTasks] = await Promise.all([
    prisma.checkin.findMany({
      where: { profileId },
      orderBy: { date: "asc" },
      take: 500,
    }),
    prisma.studyTask.findMany({
      where: { status: "COMPLETED" },
      select: { scheduledDate: true, estimatedMinutes: true },
    }),
  ]);
  return mergeActivity(checkins, completedTasks);
}

/**
 * GET /api/streak
 * Lightweight counter for the app shell: current streak + whether the
 * reference day (today) already counts as active.
 */
dashboardRouter.get("/streak", async (_req, res) => {
  const profile = await getOrCreateProfile();
  const activity = await loadActivity(profile.id);
  const now = new Date();
  const today = activity.get(dayKey(now));
  res.json({
    streak: calcStreak(activity, now),
    activeToday: today ? isActiveDay(today) : false,
  });
});

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

  const activityMap = await loadActivity(profile.id);
  const activity = [...activityMap.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
  const streak = calcStreak(activityMap, ref);
  const refActivity = activityMap.get(dayKey(ref));
  const activeToday = refActivity ? isActiveDay(refActivity) : false;

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
    activeToday,
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
