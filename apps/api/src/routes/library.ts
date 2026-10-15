import { Router } from "express";
import { prisma } from "../db.js";
import { resourceSchema, questionSchema } from "../validation/schemas.js";

export const libraryRouter = Router();

// ---- Resources ----
libraryRouter.get("/resources", async (req, res) => {
  const { topicId } = req.query as { topicId?: string };
  const resources = await prisma.resource.findMany({
    where: topicId ? { topics: { some: { topicId } } } : undefined,
    orderBy: { createdAt: "asc" },
    include: { topics: { include: { topic: { select: { id: true, name: true, slug: true } } } } },
  });
  res.json({ resources });
});

libraryRouter.post("/resources", async (req, res) => {
  const parsed = resourceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { topicIds, ...data } = parsed.data;
  const resource = await prisma.resource.create({
    data: {
      title: data.title,
      resourceType: data.resourceType ?? "VIDEO",
      url: data.url ?? null,
      description: data.description ?? null,
      topics: topicIds ? { create: topicIds.map((topicId) => ({ topicId })) } : undefined,
    },
  });
  res.status(201).json({ resource });
});

// ---- Questions (PYQ + BOOK + CUSTOM in one table; linked via TopicQuestion) ----
libraryRouter.get("/questions", async (req, res) => {
  const { sourceType, topicId, year, questionType } = req.query as {
    sourceType?: string;
    topicId?: string;
    year?: string;
    questionType?: string;
  };
  const questions = await prisma.question.findMany({
    where: {
      sourceType: (sourceType as "PYQ" | "BOOK" | "CUSTOM") ?? undefined,
      questionType: (questionType as "MCQ" | "MSQ" | "NAT" | "OTHER") ?? undefined,
      year: year ? Number(year) : undefined,
      topics: topicId ? { some: { topicId } } : undefined,
    },
    orderBy: [{ year: "desc" }, { createdAt: "asc" }],
    include: { topics: { include: { topic: { select: { id: true, name: true, slug: true } } } } },
    take: 200,
  });
  res.json({ questions });
});

libraryRouter.post("/questions", async (req, res) => {
  const parsed = questionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { topicIds, ...data } = parsed.data;
  const question = await prisma.question.create({
    data: {
      sourceType: data.sourceType,
      questionType: data.questionType ?? "MCQ",
      content: data.content ?? null,
      answer: data.answer ?? null,
      explanation: data.explanation ?? null,
      difficulty: data.difficulty ?? null,
      year: data.year ?? null,
      session: data.session ?? null,
      marks: data.marks ?? null,
      sourceRef: data.sourceRef ?? null,
      verified: data.verified ?? false,
      topics: topicIds ? { create: topicIds.map((topicId) => ({ topicId })) } : undefined,
    },
  });
  res.status(201).json({ question });
});

libraryRouter.post("/questions/:id/topics", async (req, res) => {
  const { topicId } = req.body as { topicId?: string };
  if (!topicId) return res.status(400).json({ error: "topicId required" });
  const link = await prisma.topicQuestion.upsert({
    where: { topicId_questionId: { topicId, questionId: req.params.id } },
    update: {},
    create: { topicId, questionId: req.params.id },
  });
  res.status(201).json({ link });
});
