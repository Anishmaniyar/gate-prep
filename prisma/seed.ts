import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Priority = "HIGH" | "MEDIUM" | "SELECTIVE";
type Coverage = "CORE" | "SUPPORTING" | "OPTIONAL";

type TopicSeed = {
  key: string;
  name: string;
  priority: Priority;
  coverage: Coverage;
  weeks: number[];
};

type ChapterSeed = {
  key: string;
  name: string;
  priority: Priority;
  topics: TopicSeed[];
};

type SubjectSeed = {
  slug: string;
  name: string;
  priority: Priority;
  weightage: number | null;
  chapters: ChapterSeed[];
};

const ESTIMATE_SOURCE =
  "Approximate estimate based on past GATE CS papers and coaching analysis; not an official GATE 2027 distribution.";

const SUBJECTS: SubjectSeed[] = [
  {
    slug: "programming-data-structures-algorithms",
    name: "Programming, Data Structures & Algorithms",
    priority: "HIGH",
    weightage: 18,
    chapters: [
      {
        key: "programming",
        name: "Programming",
        priority: "HIGH",
        topics: [
          { key: "c-fundamentals", name: "C fundamentals", priority: "HIGH", coverage: "CORE", weeks: [2] },
          { key: "pointers-recursion", name: "Pointers and recursion", priority: "HIGH", coverage: "CORE", weeks: [2] },
          {
            key: "output-tracing-complexity",
            name: "Output tracing and complexity-related programming",
            priority: "MEDIUM",
            coverage: "SUPPORTING",
            weeks: [8],
          },
        ],
      },
      {
        key: "data-structures",
        name: "Data Structures",
        priority: "HIGH",
        topics: [
          {
            key: "arrays-stacks-queues-linked-lists",
            name: "Arrays, stacks, queues, linked lists",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [4],
          },
          { key: "trees-bst", name: "Trees and binary search trees", priority: "HIGH", coverage: "CORE", weeks: [6] },
          { key: "heaps", name: "Heaps", priority: "MEDIUM", coverage: "CORE", weeks: [6] },
          {
            key: "graph-representations-traversals",
            name: "Graph representations and traversals",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [8],
          },
        ],
      },
      {
        key: "algorithms",
        name: "Algorithms",
        priority: "HIGH",
        topics: [
          {
            key: "time-space-complexity",
            name: "Time and space complexity",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [2, 7],
          },
          { key: "searching-sorting", name: "Searching and sorting", priority: "HIGH", coverage: "CORE", weeks: [6] },
          { key: "hashing", name: "Hashing", priority: "MEDIUM", coverage: "CORE", weeks: [6, 8] },
          { key: "greedy", name: "Greedy algorithms", priority: "HIGH", coverage: "CORE", weeks: [7] },
          { key: "dynamic-programming", name: "Dynamic programming", priority: "HIGH", coverage: "CORE", weeks: [7] },
          {
            key: "bfs-dfs-mst-shortest-paths",
            name: "BFS, DFS, minimum spanning trees, shortest paths",
            priority: "MEDIUM",
            coverage: "CORE",
            weeks: [8],
          },
        ],
      },
    ],
  },
  {
    slug: "dbms",
    name: "DBMS",
    priority: "HIGH",
    weightage: 15,
    chapters: [
      {
        key: "relational-model",
        name: "Relational Model",
        priority: "HIGH",
        topics: [
          {
            key: "relational-model-schemas",
            name: "Relational model, schemas, tuples, attributes",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [1],
          },
          {
            key: "keys-integrity-constraints",
            name: "Keys and integrity constraints",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [1],
          },
        ],
      },
      {
        key: "sql",
        name: "SQL",
        priority: "HIGH",
        topics: [
          {
            key: "sql-selection-filtering",
            name: "SQL selection and filtering",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [1],
          },
          {
            key: "sql-sorting-aggregation-grouping",
            name: "SQL sorting, aggregation, and grouping",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [3],
          },
          { key: "sql-joins", name: "SQL joins", priority: "HIGH", coverage: "CORE", weeks: [3] },
        ],
      },
      {
        key: "relational-algebra",
        name: "Relational Algebra",
        priority: "HIGH",
        topics: [
          { key: "relational-algebra", name: "Relational algebra", priority: "HIGH", coverage: "CORE", weeks: [3] },
        ],
      },
      {
        key: "functional-dependencies-normalization",
        name: "Functional Dependencies & Normalization",
        priority: "HIGH",
        topics: [
          {
            key: "functional-dependencies",
            name: "Functional dependencies",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [5],
          },
          {
            key: "normalization",
            name: "Normalization: 1NF, 2NF, 3NF, BCNF",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [5],
          },
        ],
      },
      {
        key: "transactions-concurrency",
        name: "Transactions & Concurrency",
        priority: "HIGH",
        topics: [
          { key: "transactions-acid", name: "Transactions and ACID properties", priority: "HIGH", coverage: "CORE", weeks: [8] },
          { key: "serializability", name: "Serializability", priority: "HIGH", coverage: "CORE", weeks: [8] },
          { key: "concurrency-control", name: "Concurrency control", priority: "MEDIUM", coverage: "CORE", weeks: [8] },
        ],
      },
      {
        key: "indexing",
        name: "Indexing",
        priority: "MEDIUM",
        topics: [
          {
            key: "indexing-b-trees",
            name: "Indexing, B-trees, and B+ trees",
            priority: "MEDIUM",
            coverage: "CORE",
            weeks: [8],
          },
        ],
      },
    ],
  },
  {
    slug: "discrete-mathematics",
    name: "Discrete Mathematics",
    priority: "MEDIUM",
    weightage: 12,
    chapters: [
      {
        key: "logic",
        name: "Logic (continuing from current position)",
        priority: "HIGH",
        topics: [
          { key: "propositional-logic", name: "Propositional logic", priority: "HIGH", coverage: "CORE", weeks: [1] },
          {
            key: "logical-equivalence-truth-tables",
            name: "Logical operators, equivalence, and truth tables",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [1],
          },
          {
            key: "predicates-quantifiers",
            name: "Predicates and quantifiers",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [1],
          },
        ],
      },
      {
        key: "sets-relations-functions",
        name: "Sets, Relations & Functions",
        priority: "HIGH",
        topics: [
          {
            key: "sets-relations-functions",
            name: "Sets, relations, and functions",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [3],
          },
        ],
      },
      {
        key: "counting-combinatorics",
        name: "Counting & Combinatorics",
        priority: "MEDIUM",
        topics: [
          {
            key: "counting-permutations-combinations",
            name: "Counting, permutations, and combinations",
            priority: "MEDIUM",
            coverage: "CORE",
            weeks: [5],
          },
          {
            key: "recurrence-relations",
            name: "Recurrence relations",
            priority: "MEDIUM",
            coverage: "CORE",
            weeks: [7],
          },
          {
            key: "generating-functions",
            name: "Generating functions (selected)",
            priority: "SELECTIVE",
            coverage: "OPTIONAL",
            weeks: [7],
          },
        ],
      },
      {
        key: "graph-theory",
        name: "Graph Theory",
        priority: "MEDIUM",
        topics: [
          { key: "graph-theory", name: "Graph theory", priority: "MEDIUM", coverage: "CORE", weeks: [7] },
        ],
      },
      {
        key: "algebraic-structures",
        name: "Algebraic Structures",
        priority: "SELECTIVE",
        topics: [
          {
            key: "groups-monoids-posets-lattices",
            name: "Groups, monoids, posets, and lattices",
            priority: "SELECTIVE",
            coverage: "OPTIONAL",
            weeks: [8],
          },
        ],
      },
    ],
  },
  {
    slug: "theory-of-computation",
    name: "Theory of Computation (TOC)",
    priority: "MEDIUM",
    weightage: 10,
    chapters: [
      {
        key: "finite-automata",
        name: "Finite Automata",
        priority: "HIGH",
        topics: [
          { key: "dfa", name: "Deterministic finite automata (DFA)", priority: "HIGH", coverage: "CORE", weeks: [2] },
          { key: "nfa", name: "Nondeterministic finite automata (NFA)", priority: "HIGH", coverage: "CORE", weeks: [2] },
          {
            key: "automata-conversions-equivalence",
            name: "Automata conversions and equivalence",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [4],
          },
        ],
      },
      {
        key: "regular-languages",
        name: "Regular Languages",
        priority: "HIGH",
        topics: [
          {
            key: "regular-expressions",
            name: "Regular expressions",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [4],
          },
          {
            key: "regular-languages",
            name: "Regular languages",
            priority: "HIGH",
            coverage: "CORE",
            weeks: [4],
          },
          { key: "pumping-lemma", name: "Pumping lemma", priority: "MEDIUM", coverage: "CORE", weeks: [6] },
        ],
      },
      {
        key: "context-free-grammars",
        name: "Context-Free Grammars",
        priority: "MEDIUM",
        topics: [
          {
            key: "cfg-derivations-parse-trees",
            name: "CFG, derivations, and parse trees",
            priority: "MEDIUM",
            coverage: "CORE",
            weeks: [6],
          },
          {
            key: "pda-cfl",
            name: "Pushdown automata and context-free languages",
            priority: "MEDIUM",
            coverage: "CORE",
            weeks: [8],
          },
        ],
      },
      {
        key: "turing-machines",
        name: "Turing Machines",
        priority: "MEDIUM",
        topics: [
          { key: "turing-machines", name: "Turing machines", priority: "MEDIUM", coverage: "CORE", weeks: [8] },
          { key: "undecidability", name: "Undecidability", priority: "SELECTIVE", coverage: "OPTIONAL", weeks: [8] },
        ],
      },
    ],
  },
];

const WEEKS = [
  {
    weekNumber: 1,
    start: "2026-10-19",
    end: "2026-10-25",
    title: "Foundations: DBMS and Logic",
    goal: "DBMS: Relational model, keys, constraints, SQL introduction. Discrete Mathematics: Logic revision, truth tables, logical equivalence, initial predicates.",
    targetPercent: 12,
  },
  {
    weekNumber: 2,
    start: "2026-10-26",
    end: "2026-11-01",
    title: "Programming and Automata",
    goal: "Programming: C fundamentals, pointers, recursion, complexity. TOC: DFA and NFA fundamentals.",
    targetPercent: 25,
  },
  {
    weekNumber: 3,
    start: "2026-11-02",
    end: "2026-11-08",
    title: "SQL Practice and Sets",
    goal: "DBMS: SQL practice and relational algebra. Discrete Mathematics: Sets, relations, and functions.",
    targetPercent: 38,
  },
  {
    weekNumber: 4,
    start: "2026-11-09",
    end: "2026-11-15",
    title: "Data Structures and Regular Languages",
    goal: "Data Structures: Arrays, stacks, queues, linked lists. TOC: Regular expressions, conversions, and regular languages.",
    targetPercent: 50,
  },
  {
    weekNumber: 5,
    start: "2026-11-16",
    end: "2026-11-22",
    title: "Normalization and Counting",
    goal: "DBMS: Functional dependencies and normalization. Discrete Mathematics: Counting and combinatorics.",
    targetPercent: 62,
  },
  {
    weekNumber: 6,
    start: "2026-11-23",
    end: "2026-11-29",
    title: "Trees, Heaps, and CFG",
    goal: "Data Structures: Trees, BST, heaps, searching/sorting. TOC: Pumping lemma and CFG fundamentals.",
    targetPercent: 75,
  },
  {
    weekNumber: 7,
    start: "2026-11-30",
    end: "2026-12-06",
    title: "Algorithms and Graph Theory",
    goal: "Algorithms: Complexity, greedy, and DP fundamentals. Discrete Mathematics: Recurrence relations and graph theory.",
    targetPercent: 88,
  },
  {
    weekNumber: 8,
    start: "2026-12-07",
    end: "2026-12-13",
    title: "Transactions, Advanced Topics, and Revision",
    goal: "DBMS: Transactions, serializability, and indexing. Algorithms: Mixed practice and remaining high-priority topics. TOC: PDA, context-free languages, and Turing machine fundamentals. All subjects: Revision and mixed PYQs.",
    targetPercent: 100,
  },
];

const MONTHS = [
  {
    id: "goal-month-1",
    title: "Month 1",
    start: "2026-10-19",
    end: "2026-11-15",
    goal: "Build the foundations and cover high-value topics.",
    weeks: [1, 2, 3, 4],
    subjects: [
      ["dbms", "Relational model, keys, SQL basics, relational algebra."],
      ["programming-data-structures-algorithms", "C fundamentals, pointers, recursion, complexity, arrays, stacks, queues, linked lists."],
      ["discrete-mathematics", "Continue Logic, predicates, sets, relations, functions, start counting."],
      ["theory-of-computation", "DFA, NFA, regular expressions, conversions, and regular languages."],
    ] as [string, string][],
  },
  {
    id: "goal-month-2",
    title: "Month 2",
    start: "2026-11-16",
    end: "2026-12-13",
    goal: "Extend coverage, practice advanced topics, and strengthen recall.",
    weeks: [5, 6, 7, 8],
    subjects: [
      ["dbms", "Functional dependencies, normalization, transactions, serializability, indexing."],
      ["programming-data-structures-algorithms", "Trees, heaps, searching, sorting, hashing, graphs, greedy, DP, MST and shortest paths."],
      ["discrete-mathematics", "Counting, recurrence relations, graph theory, selected generating functions."],
      ["theory-of-computation", "Pumping lemma, CFG, PDA, context-free languages, Turing machines, undecidability."],
    ] as [string, string][],
  },
];

function iso(date: string) {
  return new Date(date + "T00:00:00.000Z");
}

function id(prefix: string, key: string) {
  return `${prefix}-${key}`;
}

async function main() {
  let profile = await prisma.profile.findFirst({ orderBy: { createdAt: "asc" } });
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        name: "Aspirant",
        examTarget: "GATE 2027 CS",
        startDate: iso("2026-10-19"),
        targetDate: iso("2027-02-06"),
        dailyStudyMinutes: 90,
      },
    });
  } else {
    profile = await prisma.profile.update({
      where: { id: profile.id },
      data: { startDate: iso("2026-10-19"), dailyStudyMinutes: 90 },
    });
  }

  await prisma.studyPlan.upsert({
    where: { id: "goal-study-plan-2026" },
    update: {
      startDate: iso("2026-10-19"),
      targetDate: iso("2026-12-13"),
      status: "ACTIVE",
    },
    create: {
      id: "goal-study-plan-2026",
      startDate: iso("2026-10-19"),
      targetDate: iso("2026-12-13"),
      status: "ACTIVE",
    },
  });

  await prisma.goalPlan.upsert({
    where: { id: "goal-plan-2026" },
    update: {
      profileId: profile.id,
      title: "GATE 2027 CS — Two-Month Preparation Plan",
      startDate: iso("2026-10-19"),
      endDate: iso("2026-12-13"),
      dailyStudyMinutes: 90,
      strategy:
        "One main topic block, one weaker topic block, daily Aptitude, practice/PYQs, and revision. Month 1 focuses on DBMS and Programming/Data Structures, with Discrete Mathematics and TOC in parallel.",
      studyPlanId: "goal-study-plan-2026",
    },
    create: {
      id: "goal-plan-2026",
      profileId: profile.id,
      title: "GATE 2027 CS — Two-Month Preparation Plan",
      startDate: iso("2026-10-19"),
      endDate: iso("2026-12-13"),
      dailyStudyMinutes: 90,
      strategy:
        "One main topic block, one weaker topic block, daily Aptitude, practice/PYQs, and revision. Month 1 focuses on DBMS and Programming/Data Structures, with Discrete Mathematics and TOC in parallel.",
      studyPlanId: "goal-study-plan-2026",
    },
  });

  for (const [index, m] of MONTHS.entries()) {
    await prisma.goalMonth.upsert({
      where: { id: m.id },
      update: {
        title: m.title,
        startDate: iso(m.start),
        endDate: iso(m.end),
        goal: m.goal,
        displayOrder: index + 1,
      },
      create: {
        id: m.id,
        goalPlanId: "goal-plan-2026",
        title: m.title,
        startDate: iso(m.start),
        endDate: iso(m.end),
        goal: m.goal,
        displayOrder: index + 1,
      },
    });
  }

  const subjectBySlug = new Map<string, { goalSubjectId: string; subjectId: string }>();
  const topicByKey = new Map<string, { goalTopicId: string; topicId: string; name: string }>();
  const topicKey = (subjectSlug: string, chapterKey: string, topicKeyValue: string) =>
    `${subjectSlug}::${chapterKey}::${topicKeyValue}`;

  for (const [subjectIndex, s] of SUBJECTS.entries()) {
    const subject = await prisma.subject.upsert({
      where: { slug: s.slug },
      update: { name: s.name, displayOrder: subjectIndex + 1, isSample: false },
      create: {
        name: s.name,
        slug: s.slug,
        description: "GATE 2027 CS preparation track.",
        displayOrder: subjectIndex + 1,
        isSample: false,
      },
    });

    const goalSubject = await prisma.goalSubject.upsert({
      where: { id: id("goal-subject", s.slug) },
      update: {
        subjectId: subject.id,
        name: s.name,
        priority: s.priority,
        weightageEstimate: s.weightage,
        weightageSource: ESTIMATE_SOURCE,
        weightageYear: null,
        displayOrder: subjectIndex + 1,
      },
      create: {
        id: id("goal-subject", s.slug),
        goalPlanId: "goal-plan-2026",
        subjectId: subject.id,
        name: s.name,
        slug: s.slug,
        priority: s.priority,
        weightageEstimate: s.weightage,
        weightageSource: ESTIMATE_SOURCE,
        weightageYear: null,
        displayOrder: subjectIndex + 1,
      },
    });
    subjectBySlug.set(s.slug, { goalSubjectId: goalSubject.id, subjectId: subject.id });

    for (const [chapterIndex, c] of s.chapters.entries()) {
      const chapter = await prisma.chapter.upsert({
        where: { id: id("chapter", `${s.slug}-${c.key}`) },
        update: { name: c.name, displayOrder: chapterIndex + 1, isSample: false },
        create: {
          id: id("chapter", `${s.slug}-${c.key}`),
          subjectId: subject.id,
          name: c.name,
          slug: `${s.slug}-${c.key}`,
          displayOrder: chapterIndex + 1,
          isSample: false,
        },
      });

      const goalChapter = await prisma.goalChapter.upsert({
        where: { id: id("goal-chapter", `${s.slug}-${c.key}`) },
        update: { name: c.name, priority: c.priority, displayOrder: chapterIndex + 1 },
        create: {
          id: id("goal-chapter", `${s.slug}-${c.key}`),
          goalSubjectId: goalSubject.id,
          name: c.name,
          slug: c.key,
          priority: c.priority,
          displayOrder: chapterIndex + 1,
        },
      });

      for (const [topicIndex, t] of c.topics.entries()) {
        const topic = await prisma.topic.upsert({
          where: { id: id("topic", `${s.slug}-${t.key}`) },
          update: { name: t.name, displayOrder: topicIndex + 1, isSample: false },
          create: {
            id: id("topic", `${s.slug}-${t.key}`),
            chapterId: chapter.id,
            parentTopicId: null,
            name: t.name,
            slug: t.key,
            priority: t.priority === "SELECTIVE" ? "LOW" : t.priority,
            displayOrder: topicIndex + 1,
            isSample: false,
          },
        });

        const goalTopic = await prisma.goalTopic.upsert({
          where: { id: id("goal-topic", `${s.slug}-${t.key}`) },
          update: {
            topicId: topic.id,
            name: t.name,
            priority: t.priority,
            coverage: t.coverage,
            displayOrder: topicIndex + 1,
          },
          create: {
            id: id("goal-topic", `${s.slug}-${t.key}`),
            goalChapterId: goalChapter.id,
            topicId: topic.id,
            name: t.name,
            slug: t.key,
            priority: t.priority,
            coverage: t.coverage,
            displayOrder: topicIndex + 1,
          },
        });

        topicByKey.set(topicKey(s.slug, c.key, t.key), {
          goalTopicId: goalTopic.id,
          topicId: topic.id,
          name: t.name,
        });
      }
    }
  }

  const weekIdByNumber = new Map<number, string>();
  for (const [index, w] of WEEKS.entries()) {
    const month = MONTHS.find((m) => m.weeks.includes(w.weekNumber));
    const week = await prisma.goalWeek.upsert({
      where: { id: `goal-week-${w.weekNumber}` },
      update: {
        goalMonthId: month?.id ?? null,
        title: w.title,
        startDate: iso(w.start),
        endDate: iso(w.end),
        goal: w.goal,
        targetPercent: w.targetPercent,
        displayOrder: index + 1,
      },
      create: {
        id: `goal-week-${w.weekNumber}`,
        goalPlanId: "goal-plan-2026",
        goalMonthId: month?.id ?? null,
        weekNumber: w.weekNumber,
        title: w.title,
        startDate: iso(w.start),
        endDate: iso(w.end),
        goal: w.goal,
        targetPercent: w.targetPercent,
        displayOrder: index + 1,
      },
    });
    weekIdByNumber.set(w.weekNumber, week.id);
  }

  for (const m of MONTHS) {
    for (const [subjectIndex, [slug, focus]] of m.subjects.entries()) {
      const subjectRef = subjectBySlug.get(slug);
      if (!subjectRef) continue;
      await prisma.goalMonthSubject.upsert({
        where: { goalMonthId_goalSubjectId: { goalMonthId: m.id, goalSubjectId: subjectRef.goalSubjectId } },
        update: { focus, displayOrder: subjectIndex + 1 },
        create: {
          goalMonthId: m.id,
          goalSubjectId: subjectRef.goalSubjectId,
          focus,
          displayOrder: subjectIndex + 1,
        },
      });
    }
  }

  for (const s of SUBJECTS) {
    for (const c of s.chapters) {
      for (const t of c.topics) {
        const ref = topicByKey.get(topicKey(s.slug, c.key, t.key));
        if (!ref) continue;
        for (const weekNumber of t.weeks) {
          const weekId = weekIdByNumber.get(weekNumber);
          if (!weekId) continue;
          await prisma.goalWeekTopic.upsert({
            where: { goalWeekId_goalTopicId: { goalWeekId: weekId, goalTopicId: ref.goalTopicId } },
            update: { isTarget: true },
            create: { goalWeekId: weekId, goalTopicId: ref.goalTopicId, isTarget: true },
          });
        }
      }
    }
  }

  const weekTopicRefs = new Map<number, { name: string; topicId: string | null }[]>();
  for (const s of SUBJECTS) {
    for (const c of s.chapters) {
      for (const t of c.topics) {
        const ref = topicByKey.get(topicKey(s.slug, c.key, t.key));
        for (const weekNumber of t.weeks) {
          const list = weekTopicRefs.get(weekNumber) ?? [];
          list.push({ name: t.name, topicId: ref?.topicId ?? null });
          weekTopicRefs.set(weekNumber, list);
        }
      }
    }
  }

  for (const w of WEEKS) {
    const refs = weekTopicRefs.get(w.weekNumber) ?? [];
    const first = refs[0];
    const second = refs[1] ?? first;
    if (!first) continue;

    const tasks = [
      {
        title: `Main block: ${first.name}`,
        taskType: "LEARNING" as const,
        estimatedMinutes: 45,
        offset: 0,
        topicId: first.topicId,
      },
      {
        title: `Weaker block: ${second.name}`,
        taskType: "PRACTICE" as const,
        estimatedMinutes: 25,
        offset: 2,
        topicId: null,
      },
      {
        title: "Aptitude and revision",
        taskType: "REVISION" as const,
        estimatedMinutes: 20,
        offset: 4,
        topicId: null,
      },
    ];

    for (const [taskIndex, task] of tasks.entries()) {
      const scheduled = iso(w.start);
      scheduled.setUTCDate(scheduled.getUTCDate() + task.offset);
      const existing = await prisma.studyTask.findFirst({
        where: {
          studyPlanId: "goal-study-plan-2026",
          title: task.title,
          scheduledDate: scheduled,
        },
      });
      if (existing) continue;
      await prisma.studyTask.create({
        data: {
          studyPlanId: "goal-study-plan-2026",
          scheduledDate: scheduled,
          title: task.title,
          taskType: task.taskType,
          topicId: task.topicId,
          estimatedMinutes: task.estimatedMinutes,
          displayOrder: taskIndex + 1,
        },
      });
    }
  }

  console.log("Goal plan seed OK:", {
    profile: profile.id,
    subjects: SUBJECTS.length,
    weeks: WEEKS.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
