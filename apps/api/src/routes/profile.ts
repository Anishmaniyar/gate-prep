import { Router } from "express";
import { prisma } from "../db.js";
import { profileSchema, checkinSchema, attemptSchema } from "../validation/schemas.js";
import { overallProgress } from "../services/progress.js";

export const profileRouter = Router();

// Single-user: return first profile or create default.
profileRouter.get("/", async (_req, res) => {
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
  const progress = await overallProgress(profile.id);
  const checkins = await prisma.checkin.findMany({
    where: { profileId: profile.id },
    orderBy: { date: "desc" },
    take: 120,
  });
  res.json({ profile, progress, checkins });
});

profileRouter.put("/", async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const existing = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!existing) return res.status(404).json({ error: "No profile yet" });
  const data: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.examTarget !== undefined) data.examTarget = parsed.data.examTarget;
  if (parsed.data.startDate !== undefined) data.startDate = new Date(parsed.data.startDate);
  if (parsed.data.targetDate !== undefined) data.targetDate = new Date(parsed.data.targetDate);
  if (parsed.data.dailyStudyMinutes !== undefined) data.dailyStudyMinutes = parsed.data.dailyStudyMinutes;
  const updated = await prisma.profile.update({ where: { id: existing.id }, data });
  res.json({ profile: updated });
});

// Daily check-ins
profileRouter.get("/checkins", async (_req, res) => {
  const profile = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!profile) return res.json({ checkins: [] });
  const checkins = await prisma.checkin.findMany({
    where: { profileId: profile.id },
    orderBy: { date: "asc" },
  });
  res.json({ checkins });
});

profileRouter.post("/checkins", async (req, res) => {
  const parsed = checkinSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const profile = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!profile) return res.status(404).json({ error: "No profile yet" });
  const date = new Date(parsed.data.date);
  const checkin = await prisma.checkin.upsert({
    where: { profileId_date: { profileId: profile.id, date } },
    update: {
      tasksCompleted: parsed.data.tasksCompleted ?? 0,
      minutesStudied: parsed.data.minutesStudied ?? 0,
      notes: parsed.data.notes ?? null,
    },
    create: {
      profileId: profile.id,
      date,
      tasksCompleted: parsed.data.tasksCompleted ?? 0,
      minutesStudied: parsed.data.minutesStudied ?? 0,
      notes: parsed.data.notes ?? null,
    },
  });
  res.status(201).json({ checkin });
});

// Question attempts (also under /api/attempts alias in index)
profileRouter.post("/attempts", async (req, res) => {
  const parsed = attemptSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const profile = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!profile) return res.status(404).json({ error: "No profile yet" });
  const attempt = await prisma.questionAttempt.create({
    data: {
      profileId: profile.id,
      questionId: parsed.data.questionId,
      isCorrect: parsed.data.isCorrect ?? null,
      timeTakenSeconds: parsed.data.timeTakenSeconds ?? null,
      notes: parsed.data.notes ?? null,
    },
  });
  res.status(201).json({ attempt });
});
