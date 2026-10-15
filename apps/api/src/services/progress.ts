import { prisma } from "../db.js";

/** Progress is always computed from TopicProgress rows — never stored/hardcoded. */
export async function topicCompletion(profileId: string, topicIds: string[]) {
  if (topicIds.length === 0) return new Map<string, boolean>();
  const rows = await prisma.topicProgress.findMany({
    where: { profileId, topicId: { in: topicIds }, status: "COMPLETED" },
  });
  return new Map(rows.map((r) => [r.topicId, true]));
}

export function percent(done: number, total: number) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

export async function subjectProgress(profileId: string, subjectId: string) {
  const topics = await prisma.topic.findMany({
    where: { chapter: { subjectId } },
    select: { id: true },
  });
  const done = await prisma.topicProgress.count({
    where: { profileId, topicId: { in: topics.map((t) => t.id) }, status: "COMPLETED" },
  });
  return { total: topics.length, completed: done, percent: percent(done, topics.length) };
}

export async function overallProgress(profileId: string) {
  const total = await prisma.topic.count();
  const done = await prisma.topicProgress.count({ where: { profileId, status: "COMPLETED" } });
  return { total, completed: done, percent: percent(done, total) };
}
