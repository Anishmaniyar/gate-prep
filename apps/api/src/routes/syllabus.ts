import { Router } from "express";
import { prisma } from "../db.js";
import { subjectSchema, chapterSchema, topicSchema, topicProgressSchema } from "../validation/schemas.js";
import { percent } from "../services/progress.js";

export const syllabusRouter = Router();

async function defaultProfileId() {
  const p = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  return p?.id ?? null;
}

// ---- Subjects ----
syllabusRouter.get("/subjects", async (_req, res) => {
  const subjects = await prisma.subject.findMany({
    orderBy: { displayOrder: "asc" },
    include: { chapters: { select: { id: true } } },
  });
  const profileId = await defaultProfileId();
  const out = [];
  for (const s of subjects) {
    const topics = await prisma.topic.findMany({
      where: { chapter: { subjectId: s.id } },
      select: { id: true },
    });
    let completed = 0;
    if (profileId && topics.length > 0) {
      completed = await prisma.topicProgress.count({
        where: { profileId, topicId: { in: topics.map((t) => t.id) }, status: "COMPLETED" },
      });
    }
    out.push({
      ...s,
      topicTotal: topics.length,
      topicCompleted: completed,
      progress: percent(completed, topics.length),
    });
  }
  res.json({ subjects: out });
});

syllabusRouter.post("/subjects", async (req, res) => {
  const parsed = subjectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const subject = await prisma.subject.create({ data: { ...parsed.data, description: parsed.data.description ?? null } });
  res.status(201).json({ subject });
});

syllabusRouter.get("/subjects/:slug", async (req, res) => {
  const subject = await prisma.subject.findUnique({
    where: { slug: req.params.slug },
    include: { chapters: { orderBy: { displayOrder: "asc" }, include: { topics: { where: { parentTopicId: null }, orderBy: { displayOrder: "asc" } } } } },
  });
  if (!subject) return res.status(404).json({ error: "Subject not found" });
  const profileId = await defaultProfileId();
  const topicIds = (await prisma.topic.findMany({ where: { chapter: { subjectId: subject.id } }, select: { id: true } })).map((t) => t.id);
  const doneSet = new Set(
    profileId
      ? (await prisma.topicProgress.findMany({ where: { profileId, topicId: { in: topicIds }, status: "COMPLETED" } })).map((r) => r.topicId)
      : []
  );
  const chapters = await Promise.all(
    subject.chapters.map(async (c) => {
      const ids = (await prisma.topic.findMany({ where: { chapterId: c.id }, select: { id: true } })).map((t) => t.id);
      const done = ids.filter((id) => doneSet.has(id)).length;
      return { ...c, topicTotal: ids.length, topicCompleted: done, progress: percent(done, ids.length) };
    })
  );
  res.json({ subject: { ...subject, chapters } });
});

// ---- Chapters ----
syllabusRouter.post("/chapters", async (req, res) => {
  const parsed = chapterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const chapter = await prisma.chapter.create({ data: { ...parsed.data, description: parsed.data.description ?? null } });
  res.status(201).json({ chapter });
});

syllabusRouter.get("/chapters/:id", async (req, res) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: req.params.id },
    include: {
      subject: true,
      topics: {
        where: { parentTopicId: null },
        orderBy: { displayOrder: "asc" },
        include: {
          children: { orderBy: { displayOrder: "asc" } },
          resources: { include: { resource: true } },
          questions: { include: { question: true } },
          revisions: { orderBy: { scheduledDate: "asc" } },
        },
      },
    },
  });
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  const profileId = await defaultProfileId();
  const allIds = chapter.topics.flatMap((t) => [t.id, ...t.children.map((c) => c.id)]);
  const doneSet = new Set(
    profileId
      ? (await prisma.topicProgress.findMany({ where: { profileId, topicId: { in: allIds }, status: "COMPLETED" } })).map((r) => r.topicId)
      : []
  );
  res.json({ chapter, completedTopicIds: [...doneSet] });
});

// ---- Topics ----
syllabusRouter.post("/topics", async (req, res) => {
  const parsed = topicSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const topic = await prisma.topic.create({
    data: { ...parsed.data, parentTopicId: parsed.data.parentTopicId ?? null, description: parsed.data.description ?? null },
  });
  res.status(201).json({ topic });
});

syllabusRouter.get("/topics/:id", async (req, res) => {
  const topic = await prisma.topic.findUnique({
    where: { id: req.params.id },
    include: {
      chapter: { include: { subject: true } },
      children: { orderBy: { displayOrder: "asc" } },
      resources: { include: { resource: true } },
      questions: { include: { question: true } },
      revisions: { orderBy: { scheduledDate: "asc" } },
    },
  });
  if (!topic) return res.status(404).json({ error: "Topic not found" });
  res.json({ topic });
});

syllabusRouter.patch("/topics/:id/progress", async (req, res) => {
  const parsed = topicProgressSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  let profile = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!profile) return res.status(404).json({ error: "No profile yet" });
  const progress = await prisma.topicProgress.upsert({
    where: { profileId_topicId: { profileId: profile.id, topicId: req.params.id } },
    update: {
      status: parsed.data.status,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
    },
    create: {
      profileId: profile.id,
      topicId: req.params.id,
      status: parsed.data.status,
      completedAt: parsed.data.status === "COMPLETED" ? new Date() : null,
    },
  });
  res.json({ progress });
});
