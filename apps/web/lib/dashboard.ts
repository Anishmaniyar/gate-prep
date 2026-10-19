// Shared types + date helpers for the Axiom dashboard.
// All showcased values come from GET /api/dashboard; these helpers only format.

export type DashboardTask = {
  id: string;
  title: string;
  taskType: "LEARNING" | "PRACTICE" | "PYQ" | "REVISION";
  topicId: string | null;
  resourceId: string | null;
  estimatedMinutes: number;
  status: "PENDING" | "COMPLETED" | "SKIPPED";
  scheduledDate: string;
  topic: { id: string; name: string; chapterId: string } | null;
  resource: { id: string; title: string; url: string | null } | null;
};

export type DashboardSubject = {
  id: string;
  slug: string;
  name: string;
  isSample: boolean;
  topicCompleted: number;
  topicTotal: number;
  progress: number;
};

export type DayActivity = { date: string; tasks: number; minutes: number };

export type DashboardRevision = {
  id: string;
  status: "PENDING" | "DONE" | "OVERDUE";
  scheduledDate: string;
  topicId: string;
  topicName: string;
  chapterId: string;
};

export type StreakState = { streak: number; activeToday: boolean };

/** Broadcast so the shell counter and the dashboard never disagree. */
export const STREAK_EVENT = "axiom:streak-changed";

export type DashboardData = {
  profile: {
    id: string;
    name: string;
    examTarget: string;
    startDate: string;
    targetDate: string;
    dailyStudyMinutes: number;
  };
  date: string;
  overall: { total: number; completed: number; percent: number };
  subjects: DashboardSubject[];
  planId: string | null;
  tasks: DashboardTask[];
  activity: DayActivity[];
  streak: number;
  activeToday: boolean;
  revisions: DashboardRevision[];
};

export function toDayKey(d: Date): string {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10);
}

export function todayKey(): string {
  return toDayKey(new Date());
}

export function formatDay(iso: string): string {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShort(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Whole days from `today` until the target date.
 * Positive = remaining, 0 = target is today, negative = overdue.
 */
export function daysUntil(targetIso: string, today = new Date()): number {
  const target = new Date(targetIso);
  const t = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
  const n = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((t - n) / 86400000);
}

export const TASK_TYPE_LABEL: Record<DashboardTask["taskType"], string> = {
  LEARNING: "Learning",
  PRACTICE: "Practice",
  PYQ: "PYQ",
  REVISION: "Revision",
};
