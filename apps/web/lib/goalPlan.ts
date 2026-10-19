export type GoalPriority = "HIGH" | "MEDIUM" | "SELECTIVE";
export type GoalCoverage = "CORE" | "SUPPORTING" | "OPTIONAL";
export type TopicStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type GoalProgress = {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  percent: number;
};

export type GoalTopic = {
  id: string;
  topicId: string | null;
  name: string;
  slug: string;
  priority: GoalPriority;
  coverage: GoalCoverage;
  plannedStart: string | null;
  plannedEnd: string | null;
  status: TopicStatus;
};

export type GoalChapter = {
  id: string;
  name: string;
  slug: string;
  priority: GoalPriority;
  topics: GoalTopic[];
};

export type GoalSubject = {
  id: string;
  name: string;
  slug: string;
  priority: GoalPriority;
  weightageEstimate: number | null;
  weightageSource: string | null;
  weightageYear: number | null;
  plannedCoverage: number;
  progress: GoalProgress;
  chapters: GoalChapter[];
};

export type GoalWeek = {
  id: string;
  weekNumber: number;
  title: string;
  startDate: string;
  endDate: string;
  goal: string | null;
  targetPercent: number;
  actualPercent: number;
  completed: number;
  total: number;
  planlyHref: string;
  subjects: string[];
  topics: {
    id: string;
    topicId: string | null;
    name: string;
    subjectName: string;
    chapterName: string;
    status: TopicStatus;
  }[];
};

export type GoalMonth = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  goal: string | null;
  progress: GoalProgress;
  weeksCompleted: number;
  weeksTotal: number;
  subjects: { id: string; name: string; priority: GoalPriority; focus: string | null }[];
};

export type GoalPlanResponse = {
  plan: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    dailyStudyMinutes: number;
    strategy: string | null;
    studyPlanId: string | null;
  } | null;
  summary: GoalProgress & {
    remaining: number;
    weeksCompleted: number;
    weeksTotal: number;
  };
  subjects: GoalSubject[];
  months: GoalMonth[];
  weeks: GoalWeek[];
};

export const PRIORITY_LABEL: Record<GoalPriority, string> = {
  HIGH: "High priority",
  MEDIUM: "Medium priority",
  SELECTIVE: "Selective coverage",
};

export const COVERAGE_LABEL: Record<GoalCoverage, string> = {
  CORE: "Core",
  SUPPORTING: "Supporting",
  OPTIONAL: "Optional",
};

export const STATUS_LABEL: Record<TopicStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};
