import { Router } from "express";
import { prisma } from "../db.js";
import {
  subjectSchema,
  chapterSchema,
  topicSchema,
  topicProgressSchema,
  topicNotesSchema,
} from "../validation/schemas.js";
import { percent } from "../services/progress.js";

export const syllabusRouter = Router();

async function defaultProfileId() {
  const p = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  return p?.id ?? null;
}

type TopicStatusValue = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "NEEDS_REVISION";

function countStatuses(statuses: TopicStatusValue[]) {
  const total = statuses.length;
  const completed = statuses.filter((s) => s === "COMPLETED").length;
  const inProgress = statuses.filter((s) => s === "IN_PROGRESS").length;
  const needsRevision = statuses.filter((s) => s === "NEEDS_REVISION").length;
  const notStarted = total - completed - inProgress - needsRevision;
  return { total, completed, inProgress, needsRevision, notStarted, percent: percent(completed, total) };
}

/**
 * GET /api/syllabus
 * Canonical subject → chapter → topic tree with persisted status, notes,
 * linked resources, Planly tasks, and goal milestones. Progress is computed
 * from TopicProgress rows only.
 */
syllabusRouter.get("/syllabus", async (_req, res) => {
  const profileId = await defaultProfileId();
  const subjects = await prisma.subject.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      chapters: {
        orderBy: { displayOrder: "asc" },
        include: {
          topics: {
            where: { parentTopicId: null },
            orderBy: { displayOrder: "asc" },
            include: {
              resources: { include: { resource: true } },
              tasks: {
                select: {
                  id: true,
                  title: true,
                  status: true,
                  taskType: true,
                  scheduledDate: true,
                  estimatedMinutes: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const allTopicIds = subjects.flatMap((s) => s.chapters.flatMap((c) => c.topics.map((t) => t.id)));

  const progressRows =
    profileId && allTopicIds.length
      ? await prisma.topicProgress.findMany({
          where: { profileId, topicId: { in: allTopicIds } },
          select: { topicId: true, status: true, completedAt: true },
        })
      : [];
  const progressByTopic = new Map(progressRows.map((r) => [r.topicId, r]));

  const milestoneRows = allTopicIds.length
    ? await prisma.goalWeekTopic.findMany({
        where: { goalTopic: { topicId: { in: allTopicIds } } },
        include: { goalWeek: true, goalTopic: { select: { topicId: true } } },
      })
    : [];
  const milestonesByTopic = new Map<
    string,
    { weekNumber: number; title: string; startDate: Date; endDate: Date }[]
  >();
  for (const row of milestoneRows) {
    const topicId = row.goalTopic.topicId;
    if (!topicId) continue;
    const list = milestonesByTopic.get(topicId) ?? [];
    list.push({
      weekNumber: row.goalWeek.weekNumber,
      title: row.goalWeek.title,
      startDate: row.goalWeek.startDate,
      endDate: row.goalWeek.endDate,
    });
    milestonesByTopic.set(topicId, list);
  }

  const goalWeeks = await prisma.goalWeek.findMany({
    orderBy: { weekNumber: "asc" },
    select: { weekNumber: true, startDate: true, endDate: true },
  });
  const weekForDate = (date: Date): number | null => {
    const hit = goalWeeks.find((w) => date >= w.startDate && date <= w.endDate);
    return hit?.weekNumber ?? null;
  };

  const subjectOut = subjects.map((s) => {
    const chapters = s.chapters.map((c) => {
      const topics = c.topics.map((t) => {
        const progress = progressByTopic.get(t.id);
        const status: TopicStatusValue = (progress?.status as TopicStatusValue) ?? "NOT_STARTED";
        const estimatedMinutes = t.tasks.reduce((sum, task) => sum + (task.estimatedMinutes ?? 0), 0);
        return {
          id: t.id,
          name: t.name,
          slug: t.slug,
          description: t.description,
          priority: t.priority,
          displayOrder: t.displayOrder,
          status,
          notes: t.notes,
          completedAt: progress?.completedAt ?? null,
          updatedAt: t.updatedAt,
          estimatedMinutes,
          resources: t.resources
            .map((rt) => ({
              id: rt.resource.id,
              title: rt.resource.title,
              url: rt.resource.url,
              resourceType: rt.resource.resourceType,
            }))
            .sort((a, b) => a.title.localeCompare(b.title)),
          tasks: t.tasks
            .map((task) => ({
              id: task.id,
              title: task.title,
              status: task.status,
              taskType: task.taskType,
              scheduledDate: task.scheduledDate,
              estimatedMinutes: task.estimatedMinutes,
              weekNumber: weekForDate(task.scheduledDate),
            }))
            .sort((a, b) => (a.scheduledDate < b.scheduledDate ? -1 : 1)),
          milestones: (milestonesByTopic.get(t.id) ?? []).sort((a, b) => a.weekNumber - b.weekNumber),
        };
      });
      const progress = countStatuses(topics.map((t) => t.status));
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        displayOrder: c.displayOrder,
        topicCount: topics.length,
        progress,
        topics,
      };
    });
    const subjectStatuses = chapters.flatMap((c) => c.topics.map((t) => t.status));
    const progress = countStatuses(subjectStatuses);
    return {
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      displayOrder: s.displayOrder,
      isSample: s.isSample,
      chapterCount: chapters.length,
      topicCount: subjectStatuses.length,
      progress,
      chapters,
    };
  });

  const allStatuses = subjectOut.flatMap((s) => s.chapters.flatMap((c) => c.topics.map((t) => t.status)));
  const overall = countStatuses(allStatuses);

  res.json({
    profileId,
    stats: {
      subjects: subjectOut.length,
      chapters: subjectOut.reduce((sum, s) => sum + s.chapterCount, 0),
      topics: allStatuses.length,
    },
    overall,
    subjects: subjectOut,
  });
});

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

syllabusRouter.patch("/topics/:id/notes", async (req, res) => {
  const parsed = topicNotesSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const topic = await prisma.topic.update({
    where: { id: req.params.id },
    data: { notes: parsed.data.notes },
  });
  res.json({ topic: { id: topic.id, notes: topic.notes, updatedAt: topic.updatedAt } });
});
