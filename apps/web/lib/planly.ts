export type PlannerStatus = "Completed" | "In Progress" | "Upcoming";
export type TaskApiStatus = "PENDING" | "COMPLETED" | "SKIPPED";

export type QuestionRef = {
  year: number | null;
  sourceRef: string | null;
  sourceType?: string | null;
};

export type PlannerTask = {
  id: string;
  label: string;
  title: string;
  taskType: string;
  status: TaskApiStatus;
  estimatedMinutes: number;
  scheduledDate: string;
  subject: string | null;
  chapter: string | null;
  topic: string | null;
  subtopic: string | null;
  instructions: string | null;
  expectedOutcome: string | null;
  practiceNotes: string | null;
  pyqNotes: string | null;
  notes: string | null;
  description: string | null;
  resource: { title: string; url: string | null; isSample?: boolean } | null;
  questions: QuestionRef[];
  isPreview?: boolean;
};

export type PlannerDay = {
  key: string;
  date: string;
  weekday: string;
  dayLabel: string;
  isSunday: boolean;
  tasks: PlannerTask[];
  plannedMinutes: number;
  completed: number;
  total: number;
  status: PlannerStatus;
};

export type PlannerWeek = {
  number: number;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
  days: PlannerDay[];
  completed: number;
  total: number;
  studyDaysCompleted: number;
  studyDaysTotal: number;
  status: PlannerStatus;
};

export type WeekMeta = {
  weekNumber: number;
  start: string;
  end: string;
  title: string;
  goal: string;
};

export const PREVIEW_START = "2026-10-19";
export const PREVIEW_COMPLETED_KEY = "axiom:planly:preview-completed";

export function isoDay(value: string | Date) {
  return new Date(value).toISOString().slice(0, 10);
}

export function todayIso() {
  return isoDay(new Date());
}

export function addDays(iso: string, days: number) {
  const date = new Date(iso + "T00:00:00.000Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatDay(iso: string) {
  return new Date(iso + "T00:00:00.000Z").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatShortDate(iso: string) {
  return new Date(iso + "T00:00:00.000Z").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatRange(start: string, end: string) {
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

export function weekdayName(iso: string) {
  return new Date(iso + "T00:00:00.000Z").toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "UTC",
  });
}

export const PREVIEW_WEEKS: WeekMeta[] = [
  {
    weekNumber: 1,
    start: "2026-10-19",
    end: "2026-10-25",
    title: "Foundations: DBMS and Logic",
    goal: "DBMS relational model, keys, constraints, and SQL introduction. Logic revision, truth tables, logical equivalence, and initial predicates.",
  },
  {
    weekNumber: 2,
    start: "2026-10-26",
    end: "2026-11-01",
    title: "Programming and Automata",
    goal: "C fundamentals, pointers, recursion, and complexity. DFA and NFA fundamentals.",
  },
  {
    weekNumber: 3,
    start: "2026-11-02",
    end: "2026-11-08",
    title: "SQL Practice and Sets",
    goal: "SQL practice and relational algebra. Sets, relations, and functions.",
  },
  {
    weekNumber: 4,
    start: "2026-11-09",
    end: "2026-11-15",
    title: "Data Structures and Regular Languages",
    goal: "Arrays, stacks, queues, and linked lists. Regular expressions and regular languages.",
  },
  {
    weekNumber: 5,
    start: "2026-11-16",
    end: "2026-11-22",
    title: "Normalization and Counting",
    goal: "Functional dependencies and normalization. Counting and combinatorics.",
  },
  {
    weekNumber: 6,
    start: "2026-11-23",
    end: "2026-11-29",
    title: "Trees, Heaps, and CFG",
    goal: "Trees, BST, heaps, searching and sorting. Pumping lemma and CFG fundamentals.",
  },
  {
    weekNumber: 7,
    start: "2026-11-30",
    end: "2026-12-06",
    title: "Algorithms and Graph Theory",
    goal: "Complexity, greedy, and DP fundamentals. Recurrence relations and graph theory.",
  },
  {
    weekNumber: 8,
    start: "2026-12-07",
    end: "2026-12-13",
    title: "Transactions and Final Revision",
    goal: "Transactions, serializability, indexing, mixed practice, and full revision with PYQs.",
  },
];

type PreviewTopic = {
  subject: string;
  chapter: string;
  topic: string;
  description: string;
};

const WEEK_TOPICS: PreviewTopic[][] = [
  [
    {
      subject: "DBMS",
      chapter: "Relational Model",
      topic: "Relational model and keys",
      description:
        "Relations, tuples, attributes, candidate keys, primary keys, foreign keys, and integrity constraints.",
    },
    {
      subject: "Discrete Mathematics",
      chapter: "Logic",
      topic: "Propositional logic",
      description:
        "Truth tables, logical connectives, tautologies, contradictions, and logical equivalence.",
    },
  ],
  [
    {
      subject: "Programming, Data Structures & Algorithms",
      chapter: "Programming",
      topic: "C fundamentals and pointers",
      description:
        "C syntax, arrays, pointers, pointer arithmetic, function calls, and recursion basics.",
    },
    {
      subject: "Theory of Computation",
      chapter: "Finite Automata",
      topic: "DFA and NFA",
      description:
        "Deterministic and nondeterministic finite automata, transition tables, and epsilon transitions.",
    },
  ],
  [
    {
      subject: "DBMS",
      chapter: "SQL",
      topic: "SQL and relational algebra",
      description:
        "SELECT, joins, aggregation, nested queries, projection, selection, and joins in relational algebra.",
    },
    {
      subject: "Discrete Mathematics",
      chapter: "Sets, Relations, Functions",
      topic: "Sets, relations, and functions",
      description:
        "Set operations, equivalence relations, partial orders, injective and surjective functions.",
    },
  ],
  [
    {
      subject: "Programming, Data Structures & Algorithms",
      chapter: "Data Structures",
      topic: "Arrays, stacks, queues, linked lists",
      description:
        "Array representations, stack and queue operations, singly and doubly linked lists.",
    },
    {
      subject: "Theory of Computation",
      chapter: "Regular Languages",
      topic: "Regular expressions and conversions",
      description:
        "Regular expressions, RE to NFA, DFA minimisation, and closure properties.",
    },
  ],
  [
    {
      subject: "DBMS",
      chapter: "Normalization",
      topic: "Functional dependencies and normalization",
      description:
        "Armstrong's axioms, closure, 1NF to BCNF, lossless decomposition, and dependency preservation.",
    },
    {
      subject: "Discrete Mathematics",
      chapter: "Counting",
      topic: "Counting and combinatorics",
      description:
        "Permutations, combinations, pigeonhole principle, inclusion-exclusion, and binomial coefficients.",
    },
  ],
  [
    {
      subject: "Programming, Data Structures & Algorithms",
      chapter: "Data Structures",
      topic: "Trees, BST, and heaps",
      description:
        "Tree traversals, binary search trees, AVL basics, min-heaps and max-heaps.",
    },
    {
      subject: "Theory of Computation",
      chapter: "Context-Free Grammars",
      topic: "Pumping lemma and CFG",
      description:
        "Pumping lemma for regular languages, context-free grammars, derivations, and ambiguity.",
    },
  ],
  [
    {
      subject: "Programming, Data Structures & Algorithms",
      chapter: "Algorithms",
      topic: "Greedy and dynamic programming",
      description:
        "Greedy choice, exchange arguments, overlapping subproblems, memoisation, and tabulation.",
    },
    {
      subject: "Discrete Mathematics",
      chapter: "Graph Theory",
      topic: "Recurrence relations and graph theory",
      description:
        "Solving recurrences, graph connectivity, Euler and Hamiltonian paths, and planarity.",
    },
  ],
  [
    {
      subject: "DBMS",
      chapter: "Transactions",
      topic: "Transactions and concurrency",
      description:
        "ACID properties, schedules, serializability, locking, and recovery.",
    },
    {
      subject: "Programming, Data Structures & Algorithms",
      chapter: "Algorithms",
      topic: "BFS, DFS, MST, shortest paths",
      description:
        "Graph traversals, Kruskal and Prim, Dijkstra, Bellman-Ford, and Floyd-Warshall.",
    },
  ],
];

const APTITUDE: PreviewTopic = {
  subject: "General Aptitude",
  chapter: "Quantitative Aptitude",
  topic: "Percentages and ratios",
  description: "Percentages, ratios, proportions, and data interpretation warm-up questions.",
};

const REVIEW: PreviewTopic = {
  subject: "Weekly review",
  chapter: "Buffer and recall",
  topic: "Weekly review and mistake log",
  description:
    "Clear pending tasks, update the mistake log, and recall this week's highest-value formulas and patterns.",
};

function previewTask(
  id: string,
  label: string,
  title: string,
  taskType: string,
  minutes: number,
  date: string,
  topic: PreviewTopic,
  status: TaskApiStatus,
  extra?: Partial<PlannerTask>
): PlannerTask {
  return {
    id,
    label,
    title,
    taskType,
    status,
    estimatedMinutes: minutes,
    scheduledDate: date,
    subject: topic.subject,
    chapter: topic.chapter,
    topic: topic.topic,
    subtopic: null,
    instructions: null,
    expectedOutcome: null,
    practiceNotes: null,
    pyqNotes: null,
    notes: null,
    description: topic.description,
    resource: null,
    questions: [],
    isPreview: true,
    ...extra,
  };
}

export function buildPreviewWeeks(completedIds?: Set<string>): PlannerWeek[] {
  const today = todayIso();
  const weeks: PlannerWeek[] = PREVIEW_WEEKS.map((meta) => {
    const days: PlannerDay[] = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(meta.start, dayIndex);
      const isSunday = weekdayName(date) === "Sunday";
      const topics = WEEK_TOPICS[meta.weekNumber - 1];
      const topicA = topics[0];
      const topicB = topics[1];
      const rotate = dayIndex % 2 === 0 ? topicA : topicB;

      const base: { label: string; title: string; type: string; minutes: number; topic: PreviewTopic }[] =
        isSunday
          ? [
              {
                label: "Task 1",
                title: `Weekly review — ${meta.title}`,
                type: "REVISION",
                minutes: 45,
                topic: { ...REVIEW, topic: meta.title },
              },
              {
                label: "Practice",
                title: "Mixed practice set",
                type: "PRACTICE",
                minutes: 30,
                topic: { ...REVIEW, chapter: "Mixed practice", topic: meta.title },
              },
              {
                label: "Revision",
                title: "Mistake log review",
                type: "REVISION",
                minutes: 15,
                topic: REVIEW,
              },
            ]
          : [
              {
                label: "Task 1",
                title: `${topicA.subject} — ${topicA.topic}`,
                type: "LEARNING",
                minutes: 45,
                topic: topicA,
              },
              {
                label: "Task 2",
                title: `${topicB.subject} — ${topicB.topic}`,
                type: "LEARNING",
                minutes: 25,
                topic: topicB,
              },
              {
                label: "Practice",
                title: `Practice — ${rotate.topic}`,
                type: "PRACTICE",
                minutes: 20,
                topic: rotate,
              },
              dayIndex % 3 === 0
                ? {
                    label: "PYQ",
                    title: `PYQ — ${rotate.topic}`,
                    type: "PYQ",
                    minutes: 15,
                    topic: rotate,
                  }
                : {
                    label: "Revision",
                    title: `Revision — ${rotate.topic}`,
                    type: "REVISION",
                    minutes: 15,
                    topic: rotate,
                  },
              dayIndex % 2 === 0
                ? {
                    label: "Aptitude",
                    title: "General Aptitude — percentages and ratios",
                    type: "LEARNING",
                    minutes: 10,
                    topic: APTITUDE,
                  }
                : {
                    label: "Revision",
                    title: `Recall — ${topicB.topic}`,
                    type: "REVISION",
                    minutes: 10,
                    topic: topicB,
                  },
            ];

      const tasks = base.map((item, taskIndex) => {
        const taskId = `preview-w${meta.weekNumber}-d${dayIndex}-t${taskIndex}`;
        const seededComplete = meta.weekNumber === 1 && dayIndex === 0;
        const status: TaskApiStatus =
          completedIds?.has(taskId) || (!completedIds && seededComplete) ? "COMPLETED" : "PENDING";
        return previewTask(
          taskId,
          item.label,
          item.title,
          item.type,
          item.minutes,
          date,
          item.topic,
          status,
          {
            questions:
              item.type === "PYQ"
                ? [
                    { year: 2024, sourceRef: "GATE CS 2024 Set 1" },
                    { year: 2023, sourceRef: "GATE CS 2023" },
                  ]
                : [],
          }
        );
      });

      return summariseDay(date, tasks, today);
    });

    const completed = days.reduce((sum, day) => sum + day.completed, 0);
    const total = days.reduce((sum, day) => sum + day.total, 0);
    const studyDays = days.filter((day) => day.total > 0 && !day.isSunday);
    const studyDaysCompleted = studyDays.filter((day) => day.status === "Completed").length;
    const status: PlannerStatus =
      total > 0 && completed === total
        ? "Completed"
        : completed > 0 || meta.start <= today
          ? "In Progress"
          : "Upcoming";

    return {
      number: meta.weekNumber,
      title: meta.title,
      goal: meta.goal,
      startDate: meta.start,
      endDate: meta.end,
      days,
      completed,
      total,
      studyDaysCompleted,
      studyDaysTotal: studyDays.length,
      status,
    };
  });

  return weeks;
}

export function summariseDay(date: string, tasks: PlannerTask[], today: string): PlannerDay {
  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  const total = tasks.length;
  const status: PlannerStatus =
    total > 0 && completed === total
      ? "Completed"
      : completed > 0 || (total > 0 && date <= today)
        ? "In Progress"
        : "Upcoming";
  return {
    key: date,
    date,
    weekday: weekdayName(date),
    dayLabel: formatDay(date).replace(", ", " · "),
    isSunday: weekdayName(date) === "Sunday",
    tasks,
    plannedMinutes: tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0),
    completed,
    total,
    status,
  };
}

export type ApiTask = {
  id: string;
  title: string;
  taskType: string;
  status: TaskApiStatus;
  estimatedMinutes: number;
  scheduledDate: string;
  displayOrder?: number;
  subtopic?: string | null;
  instructions?: string | null;
  expectedOutcome?: string | null;
  practiceNotes?: string | null;
  pyqNotes?: string | null;
  notes?: string | null;
  topic?: {
    name: string;
    description?: string | null;
    chapter?: { name: string; subject?: { name: string } | null } | null;
  } | null;
  resource?: {
    title: string;
    url?: string | null;
    isSample?: boolean;
  } | null;
  questions?: {
    question: {
      year?: number | null;
      sourceRef?: string | null;
      sourceType?: string | null;
    };
  }[];
};

export function mapApiTask(task: ApiTask): PlannerTask {
  const label =
    task.title.toLowerCase().includes("aptitude")
      ? "Aptitude"
      : task.taskType === "PRACTICE"
        ? "Practice"
        : task.taskType === "PYQ"
          ? "PYQ"
          : task.taskType === "REVISION"
            ? "Revision"
            : `Task ${task.displayOrder ?? 1}`;

  return {
    id: task.id,
    label,
    title: task.title,
    taskType: task.taskType,
    status: task.status,
    estimatedMinutes: task.estimatedMinutes,
    scheduledDate: isoDay(task.scheduledDate),
    subject: task.topic?.chapter?.subject?.name ?? null,
    chapter: task.topic?.chapter?.name ?? null,
    topic: task.topic?.name ?? null,
    subtopic: task.subtopic ?? null,
    instructions: task.instructions ?? null,
    expectedOutcome: task.expectedOutcome ?? null,
    practiceNotes: task.practiceNotes ?? null,
    pyqNotes: task.pyqNotes ?? null,
    notes: task.notes ?? null,
    description: task.topic?.description ?? null,
    resource: task.resource
      ? {
          title: task.resource.title,
          url: task.resource.url ?? null,
          isSample: task.resource.isSample,
        }
      : null,
    questions: (task.questions ?? []).map(({ question }) => ({
      year: question.year ?? null,
      sourceRef: question.sourceRef ?? null,
      sourceType: question.sourceType ?? null,
    })),
  };
}

export function buildWeeksFromTasks(weeks: WeekMeta[], tasks: PlannerTask[]): PlannerWeek[] {
  const today = todayIso();
  const byDate = new Map<string, PlannerTask[]>();
  for (const task of tasks) {
    const list = byDate.get(task.scheduledDate) ?? [];
    list.push(task);
    byDate.set(task.scheduledDate, list);
  }

  return weeks.map((meta) => {
    const days: PlannerDay[] = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(meta.start, dayIndex);
      const dayTasks = (byDate.get(date) ?? []).sort((a, b) => a.id.localeCompare(b.id));
      return summariseDay(date, dayTasks, today);
    });

    const completed = days.reduce((sum, day) => sum + day.completed, 0);
    const total = days.reduce((sum, day) => sum + day.total, 0);
    const studyDays = days.filter((day) => day.total > 0 && !day.isSunday);
    const studyDaysCompleted = studyDays.filter((day) => day.status === "Completed").length;
    const status: PlannerStatus =
      total > 0 && completed === total
        ? "Completed"
        : completed > 0 || meta.start <= today
          ? "In Progress"
          : "Upcoming";

    return {
      number: meta.weekNumber,
      title: meta.title,
      goal: meta.goal,
      startDate: meta.start,
      endDate: meta.end,
      days,
      completed,
      total,
      studyDaysCompleted,
      studyDaysTotal: studyDays.length,
      status,
    };
  });
}

export function expectedOutcome(task: PlannerTask) {
  if (task.expectedOutcome) return task.expectedOutcome;
  const topic = task.topic ?? "this topic";
  switch (task.taskType) {
    case "PRACTICE":
      return `Solve a mixed set on ${topic} without notes and log every mistake.`;
    case "PYQ":
      return `Attempt the linked previous-year questions on ${topic} under exam timing.`;
    case "REVISION":
      return `Recall the key ideas of ${topic} and redo the mistakes from your log.`;
    default:
      return `Explain ${topic} in your own words and solve two standard problems.`;
  }
}

export function dayScheduleNote(day: PlannerDay) {
  if (day.isSunday) return "Buffer / Revision / Weekly Review";
  if (day.total === 0) return "No tasks scheduled";
  return `${day.plannedMinutes} min planned`;
}
