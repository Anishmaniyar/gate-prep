import { prisma } from "../db.js";

export type DayActivity = { date: string; tasks: number; minutes: number };

export function utcDayStart(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function dayKey(d: Date): string {
  return utcDayStart(d).toISOString().slice(0, 10);
}

function parseDayKey(key: string): Date {
  return new Date(key + "T00:00:00.000Z");
}

/**
 * Merge check-ins with completed-task counts into one per-day activity map.
 * Task-derived counts and manual check-ins describe the same day, so take the
 * max of each rather than summing (avoids double counting after sync).
 */
export function mergeActivity(
  checkins: { date: Date; tasksCompleted: number; minutesStudied: number }[],
  completedTasks: { scheduledDate: Date; estimatedMinutes: number }[]
): Map<string, DayActivity> {
  const map = new Map<string, DayActivity>();
  for (const c of checkins) {
    const key = dayKey(new Date(c.date));
    const cur = map.get(key) ?? { date: key, tasks: 0, minutes: 0 };
    cur.tasks = Math.max(cur.tasks, c.tasksCompleted);
    cur.minutes = Math.max(cur.minutes, c.minutesStudied);
    map.set(key, cur);
  }
  const sums = new Map<string, { tasks: number; minutes: number }>();
  for (const t of completedTasks) {
    const key = dayKey(new Date(t.scheduledDate));
    const cur = sums.get(key) ?? { tasks: 0, minutes: 0 };
    cur.tasks += 1;
    cur.minutes += t.estimatedMinutes;
    sums.set(key, cur);
  }
  for (const [key, s] of sums) {
    const cur = map.get(key) ?? { date: key, tasks: 0, minutes: 0 };
    cur.tasks = Math.max(cur.tasks, s.tasks);
    cur.minutes = Math.max(cur.minutes, s.minutes);
    map.set(key, cur);
  }
  return map;
}

export function isActiveDay(a: DayActivity): boolean {
  return a.tasks > 0 || a.minutes > 0;
}

/** Consecutive active days ending today (or yesterday if today is inactive). */
export function calcStreak(activity: Map<string, DayActivity>, ref = new Date()): number {
  const active = new Set(
    [...activity.values()].filter(isActiveDay).map((a) => a.date)
  );
  const cursor = utcDayStart(ref);
  if (!active.has(dayKey(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
  let streak = 0;
  while (active.has(dayKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

/**
 * Recompute a single day's check-in from its completed tasks.
 * Keeps manually logged minutes (never lowers them).
 */
export async function syncDayCheckin(profileId: string, day: Date) {
  const start = utcDayStart(day);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  const done = await prisma.studyTask.findMany({
    where: { scheduledDate: { gte: start, lt: end }, status: "COMPLETED" },
    select: { estimatedMinutes: true },
  });
  const existing = await prisma.checkin.findUnique({
    where: { profileId_date: { profileId, date: start } },
  });
  const minutes = done.reduce((s, t) => s + t.estimatedMinutes, 0);
  const data = {
    tasksCompleted: done.length,
    minutesStudied: Math.max(existing?.minutesStudied ?? 0, minutes),
  };
  if (existing) {
    // Drop empty rows so the heatmap shows a true zero-activity state.
    if (done.length === 0 && (existing.minutesStudied ?? 0) === 0 && !existing.notes) {
      await prisma.checkin.delete({ where: { id: existing.id } });
      return;
    }
    await prisma.checkin.update({ where: { id: existing.id }, data });
  } else if (done.length > 0) {
    await prisma.checkin.create({ data: { profileId, date: start, ...data } });
  }
}

export { parseDayKey };
