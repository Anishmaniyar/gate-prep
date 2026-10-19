import { Router } from "express";
import { prisma } from "../db.js";
import { planSchema, taskSchema, taskStatusSchema, revisionSchema, revisionStatusSchema } from "../validation/schemas.js";
import { syncDayCheckin } from "../services/activity.js";

export const planningRouter = Router();

// ---- Study plans ----
planningRouter.get("/plans", async (_req, res) => {
  const plans = await prisma.studyPlan.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { tasks: true } } } });
  res.json({ plans });
});

planningRouter.post("/plans", async (req, res) => {
  const parsed = planSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const plan = await prisma.studyPlan.create({
    data: { startDate: new Date(parsed.data.startDate), targetDate: new Date(parsed.data.targetDate) },
  });
  res.status(201).json({ plan });
});

// Day-wise tasks for a plan (optional ?date=YYYY-MM-DD filter)
planningRouter.get("/plans/:id/tasks", async (req, res) => {
  const { date, from, to } = req.query as { date?: string; from?: string; to?: string };
  let scheduledDate: { gte: Date; lt: Date } | undefined;
  if (date) {
    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    scheduledDate = { gte: start, lt: end };
  } else if (from && to) {
    const start = new Date(from + "T00:00:00.000Z");
    const end = new Date(to + "T00:00:00.000Z");
    end.setUTCDate(end.getUTCDate() + 1);
    scheduledDate = { gte: start, lt: end };
  }
  const tasks = await prisma.studyTask.findMany({
    where: { studyPlanId: req.params.id, scheduledDate },
    orderBy: [{ scheduledDate: "asc" }, { displayOrder: "asc" }],
    include: {
      topic: { include: { chapter: { include: { subject: true } } } },
      resource: true,
      questions: { include: { question: true } },
    },
  });
  res.json({ tasks });
});

planningRouter.post("/tasks", async (req, res) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { questionIds, ...data } = parsed.data;
  const task = await prisma.studyTask.create({
    data: {
      studyPlanId: data.studyPlanId,
      scheduledDate: new Date(data.scheduledDate),
      title: data.title,
      taskType: data.taskType,
      topicId: data.topicId ?? null,
      resourceId: data.resourceId ?? null,
      estimatedMinutes: data.estimatedMinutes ?? 45,
      displayOrder: data.displayOrder ?? 0,
      questions: questionIds ? { create: questionIds.map((questionId) => ({ questionId })) } : undefined,
    },
  });
  res.status(201).json({ task });
});

planningRouter.patch("/tasks/:id", async (req, res) => {
  const parsed = taskStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) {
    data.status = parsed.data.status;
    data.completedAt = parsed.data.status === "COMPLETED" ? new Date() : null;
  }
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;
  const task = await prisma.studyTask.update({
    where: { id: req.params.id },
    data,
  });
  // Keep heatmap, streak, and daily check-ins in sync with task completion.
  if (parsed.data.status !== undefined) {
    const owner = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
    if (owner) await syncDayCheckin(owner.id, new Date(task.scheduledDate));
  }
  res.json({ task });
});

// ---- Revisions ----
planningRouter.get("/revisions", async (req, res) => {
  const { status } = req.query as { status?: "PENDING" | "DONE" | "OVERDUE" };
  const revisions = await prisma.revisionSchedule.findMany({
    where: status ? { status } : undefined,
    orderBy: { scheduledDate: "asc" },
    include: { topic: { include: { chapter: { include: { subject: true } } } } },
    take: 200,
  });
  res.json({ revisions });
});

planningRouter.post("/revisions", async (req, res) => {
  const parsed = revisionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const revision = await prisma.revisionSchedule.create({
    data: { topicId: parsed.data.topicId, scheduledDate: new Date(parsed.data.scheduledDate) },
  });
  res.status(201).json({ revision });
});

planningRouter.patch("/revisions/:id", async (req, res) => {
  const parsed = revisionStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const revision = await prisma.revisionSchedule.update({
    where: { id: req.params.id },
    data: {
      status: parsed.data.status,
      lastReviewedAt: parsed.data.status === "DONE" ? new Date() : null,
    },
  });
  res.json({ revision });
});
