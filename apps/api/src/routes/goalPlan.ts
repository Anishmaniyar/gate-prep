import { Router } from "express";
import { prisma } from "../db.js";
import {
  goalTopicUpdateSchema,
  goalSubjectUpdateSchema,
  goalWeekUpdateSchema,
} from "../validation/schemas.js";
import { percent } from "../services/progress.js";

export const goalPlanRouter = Router();

async function getProfileId() {
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
  return profile.id;
}

function countStatuses(statuses: string[]) {
  const total = statuses.length;
  const completed = statuses.filter((s) => s === "COMPLETED").length;
  const inProgress = statuses.filter((s) => s === "IN_PROGRESS").length;
  return {
    total,
    completed,
    inProgress,
    notStarted: total - completed - inProgress,
    percent: percent(completed, total),
  };
}

/**
 * GET /api/goal-plan
 * Two-month goal plan with planning content and completion computed from
 * saved TopicProgress rows. Nothing is hardcoded here.
 */
goalPlanRouter.get("/goal-plan", async (_req, res) => {
  const profileId = await getProfileId();
  const plan = await prisma.goalPlan.findFirst({
    where: { profileId },
    orderBy: { createdAt: "desc" },
    include: {
      months: {
        orderBy: { displayOrder: "asc" },
        include: {
          subjects: {
            orderBy: { displayOrder: "asc" },
            include: { goalSubject: true },
          },
          weeks: { orderBy: { weekNumber: "asc" } },
        },
      },
      subjects: {
        orderBy: { displayOrder: "asc" },
        include: {
          chapters: {
            orderBy: { displayOrder: "asc" },
            include: { topics: { orderBy: { displayOrder: "asc" } } },
          },
        },
      },
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          topics: {
            include: {
              goalTopic: {
                include: {
                  goalChapter: { include: { goalSubject: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!plan) {
    return res.json({ plan: null });
  }

  const topicIds = plan.subjects
    .flatMap((s) => s.chapters)
    .flatMap((c) => c.topics)
    .map((t) => t.topicId)
    .filter((id): id is string => Boolean(id));

  const progressRows =
    topicIds.length > 0
      ? await prisma.topicProgress.findMany({
          where: { profileId, topicId: { in: topicIds } },
          select: { topicId: true, status: true },
        })
      : [];
  const statusByTopic = new Map(progressRows.map((r) => [r.topicId, r.status]));
  const statusOf = (topicId: string | null) =>
    topicId ? statusByTopic.get(topicId) ?? "NOT_STARTED" : "NOT_STARTED";

  const subjects = plan.subjects.map((s) => {
    const topics = s.chapters.flatMap((c) => c.topics);
    const progress = countStatuses(topics.map((t) => statusOf(t.topicId)));
    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      priority: s.priority,
      weightageEstimate: s.weightageEstimate,
      weightageSource: s.weightageSource,
      weightageYear: s.weightageYear,
      plannedCoverage: s.plannedCoverage,
      progress,
      chapters: s.chapters.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        priority: c.priority,
        topics: c.topics.map((t) => ({
          id: t.id,
          topicId: t.topicId,
          name: t.name,
          slug: t.slug,
          priority: t.priority,
          coverage: t.coverage,
          plannedStart: t.plannedStart,
          plannedEnd: t.plannedEnd,
          status: statusOf(t.topicId),
        })),
      })),
    };
  });

  const allTopics = subjects.flatMap((s) => s.chapters.flatMap((c) => c.topics));
  const overall = countStatuses(allTopics.map((t) => t.status));

  const weeks = plan.weeks.map((w) => {
    const weekTopics = w.topics.map((wt) => {
      const t = wt.goalTopic;
      return {
        id: t.id,
        topicId: t.topicId,
        name: t.name,
        subjectName: t.goalChapter.goalSubject.name,
        chapterName: t.goalChapter.name,
        status: statusOf(t.topicId),
      };
    });
    const progress = countStatuses(weekTopics.map((t) => t.status));
    return {
      id: w.id,
      weekNumber: w.weekNumber,
      title: w.title,
      startDate: w.startDate,
      endDate: w.endDate,
      goal: w.goal,
      targetPercent: w.targetPercent,
      actualPercent: progress.percent,
      completed: progress.completed,
      total: progress.total,
      planlyHref: `/planly?week=${w.weekNumber}`,
      subjects: [...new Set(weekTopics.map((t) => t.subjectName))],
      topics: weekTopics,
    };
  });

  const weeksCompleted = weeks.filter((w) => w.total > 0 && w.completed === w.total).length;

  const months = plan.months.map((m) => {
    const weekIds = new Set(m.weeks.map((w) => w.id));
    const monthWeekProgress = weeks.filter((w) => weekIds.has(w.id));
    const topicIdsInMonth = new Set(
      plan.weeks
        .filter((w) => weekIds.has(w.id))
        .flatMap((w) => w.topics.map((wt) => wt.goalTopicId))
    );
    const monthTopics = subjects
      .flatMap((s) => s.chapters.flatMap((c) => c.topics))
      .filter((t) => topicIdsInMonth.has(t.id));
    const progress = countStatuses(monthTopics.map((t) => t.status));
    return {
      id: m.id,
      title: m.title,
      startDate: m.startDate,
      endDate: m.endDate,
      goal: m.goal,
      progress,
      weeksCompleted: monthWeekProgress.filter((w) => w.total > 0 && w.completed === w.total).length,
      weeksTotal: monthWeekProgress.length,
      subjects: m.subjects.map((ms) => ({
        id: ms.goalSubject.id,
        name: ms.goalSubject.name,
        priority: ms.goalSubject.priority,
        focus: ms.focus,
      })),
    };
  });

  res.json({
    plan: {
      id: plan.id,
      title: plan.title,
      startDate: plan.startDate,
      endDate: plan.endDate,
      dailyStudyMinutes: plan.dailyStudyMinutes,
      strategy: plan.strategy,
      studyPlanId: plan.studyPlanId,
    },
    summary: {
      ...overall,
      remaining: overall.total - overall.completed,
      weeksCompleted,
      weeksTotal: weeks.length,
    },
    subjects,
    months,
    weeks,
  });
});

goalPlanRouter.patch("/goal-topics/:id", async (req, res) => {
  const parsed = goalTopicUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.priority !== undefined) data.priority = parsed.data.priority;
  if (parsed.data.coverage !== undefined) data.coverage = parsed.data.coverage;
  if (parsed.data.plannedStart !== undefined) {
    data.plannedStart = parsed.data.plannedStart ? new Date(parsed.data.plannedStart) : null;
  }
  if (parsed.data.plannedEnd !== undefined) {
    data.plannedEnd = parsed.data.plannedEnd ? new Date(parsed.data.plannedEnd) : null;
  }
  const topic = await prisma.goalTopic.update({ where: { id: req.params.id }, data });
  res.json({ topic });
});

goalPlanRouter.patch("/goal-subjects/:id", async (req, res) => {
  const parsed = goalSubjectUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data: Record<string, unknown> = {};
  if (parsed.data.priority !== undefined) data.priority = parsed.data.priority;
  if (parsed.data.plannedCoverage !== undefined) data.plannedCoverage = parsed.data.plannedCoverage;
  if (parsed.data.weightageEstimate !== undefined) data.weightageEstimate = parsed.data.weightageEstimate;
  if (parsed.data.weightageSource !== undefined) data.weightageSource = parsed.data.weightageSource;
  if (parsed.data.weightageYear !== undefined) data.weightageYear = parsed.data.weightageYear;
  const subject = await prisma.goalSubject.update({ where: { id: req.params.id }, data });
  res.json({ subject });
});

goalPlanRouter.patch("/goal-weeks/:id", async (req, res) => {
  const parsed = goalWeekUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data: Record<string, unknown> = {};
  if (parsed.data.goal !== undefined) data.goal = parsed.data.goal;
  if (parsed.data.startDate !== undefined) data.startDate = new Date(parsed.data.startDate);
  if (parsed.data.endDate !== undefined) data.endDate = new Date(parsed.data.endDate);
  if (parsed.data.targetPercent !== undefined) data.targetPercent = parsed.data.targetPercent;
  const week = await prisma.goalWeek.update({ where: { id: req.params.id }, data });
  res.json({ week });
});
