export type TopicStatusValue = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "NEEDS_REVISION";
export type PriorityValue = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Verified official GATE 2027 CS syllabus, published by the organizing
// institute (IIT Madras). Used for the "View Official Syllabus" action.
export const OFFICIAL_SYLLABUS_URL =
  "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf";

export type StatusCounts = {
  total: number;
  completed: number;
  inProgress: number;
  needsRevision: number;
  notStarted: number;
  percent: number;
};

export type SyllabusResource = {
  id: string;
  title: string;
  url: string | null;
  resourceType: string;
};

export type SyllabusTask = {
  id: string;
  title: string;
  status: string;
  taskType: string;
  scheduledDate: string;
  estimatedMinutes: number;
  weekNumber: number | null;
};

export type SyllabusMilestone = {
  weekNumber: number;
  title: string;
  startDate: string;
  endDate: string;
};

export type SyllabusTopic = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priority: PriorityValue;
  displayOrder: number;
  status: TopicStatusValue;
  notes: string | null;
  completedAt: string | null;
  updatedAt: string;
  estimatedMinutes: number;
  resources: SyllabusResource[];
  tasks: SyllabusTask[];
  milestones: SyllabusMilestone[];
};

export type SyllabusChapter = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  topicCount: number;
  progress: StatusCounts;
  topics: SyllabusTopic[];
};

export type SyllabusSubject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  isSample: boolean;
  chapterCount: number;
  topicCount: number;
  progress: StatusCounts;
  chapters: SyllabusChapter[];
};

export type SyllabusResponse = {
  profileId: string | null;
  stats: { subjects: number; chapters: number; topics: number };
  overall: StatusCounts;
  subjects: SyllabusSubject[];
};

export const STATUS_ORDER: TopicStatusValue[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "NEEDS_REVISION",
];

export const STATUS_LABEL: Record<TopicStatusValue, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  NEEDS_REVISION: "Needs Revision",
};

export const STATUS_PILL: Record<TopicStatusValue, string> = {
  COMPLETED:
    "border-[#4a7d5e]/40 bg-[#4a7d5e]/10 text-[#3f6d51] dark:border-[#7fae8d]/40 dark:bg-[#7fae8d]/10 dark:text-[#9cc9aa]",
  IN_PROGRESS:
    "border-[#5b8db8]/40 bg-[#5b8db8]/10 text-[#4a7ba3] dark:border-[#8fb8dd]/40 dark:bg-[#8fb8dd]/10 dark:text-[#a9c8e4]",
  NEEDS_REVISION: "border-ember bg-transparent text-brass dark:text-ember",
  NOT_STARTED: "border-mist-strong bg-fog text-slate",
};

export const STATUS_DOT: Record<TopicStatusValue, string> = {
  COMPLETED: "bg-[#4a7d5e] dark:bg-[#7fae8d]",
  IN_PROGRESS: "bg-[#5b8db8] dark:bg-[#8fb8dd]",
  NEEDS_REVISION: "bg-ember",
  NOT_STARTED: "bg-mist-strong",
};

export const PRIORITY_ORDER: PriorityValue[] = ["HIGH", "MEDIUM", "LOW", "CRITICAL"];

export const PRIORITY_LABEL: Record<PriorityValue, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  CRITICAL: "Critical",
};

export function formatMinutes(minutes: number): string | null {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatTaskDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
