import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Priority = "HIGH" | "MEDIUM" | "SELECTIVE";
type Coverage = "CORE" | "SUPPORTING" | "OPTIONAL";
type TaskType = "LEARNING" | "PRACTICE" | "PYQ" | "REVISION";

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
  // Goal tracks appear in the Goal Planner. Support subjects (General Aptitude)
  // are seeded so Planly tasks can link to a real syllabus topic.
  goalTrack: boolean;
  plannedCoverage: number | null;
  chapters: ChapterSeed[];
};

const PLAN_ID = "goal-plan-2026";
const STUDY_PLAN_ID = "goal-study-plan-2026";

// Weightage is intentionally left unavailable. The application must not
// fabricate exact topic-wise marks or percentages for these subjects.
const WEIGHTAGE_ESTIMATE: number | null = null;
const WEIGHTAGE_SOURCE: string | null = null;

const SUBJECTS: SubjectSeed[] = [
  {
    slug: "programming-data-structures-algorithms",
    name: "Programming, Data Structures & Algorithms",
    priority: "HIGH",
    goalTrack: true,
    plannedCoverage: 70,
    chapters: [
      {
        key: "programming",
        name: "Programming",
        priority: "HIGH",
        topics: [
          { key: "c-programming-fundamentals", name: "C Programming Fundamentals", priority: "HIGH", coverage: "CORE", weeks: [2] },
          { key: "pointers-recursion", name: "Pointers and Recursion", priority: "HIGH", coverage: "CORE", weeks: [2] },
          { key: "programming-output-tracing", name: "Programming Output Tracing", priority: "MEDIUM", coverage: "SUPPORTING", weeks: [8] },
        ],
      },
      {
        key: "data-structures",
        name: "Data Structures",
        priority: "HIGH",
        topics: [
          { key: "arrays", name: "Arrays", priority: "HIGH", coverage: "CORE", weeks: [4] },
          { key: "stacks-queues", name: "Stacks and Queues", priority: "HIGH", coverage: "CORE", weeks: [4] },
          { key: "linked-lists", name: "Linked Lists", priority: "HIGH", coverage: "CORE", weeks: [4] },
          { key: "trees-bst", name: "Trees and Binary Search Trees", priority: "HIGH", coverage: "CORE", weeks: [6] },
          { key: "heaps", name: "Heaps", priority: "MEDIUM", coverage: "CORE", weeks: [6] },
          { key: "graph-representations-traversals", name: "Graph Representations and Traversals", priority: "HIGH", coverage: "CORE", weeks: [8] },
        ],
      },
      {
        key: "algorithms",
        name: "Algorithms",
        priority: "HIGH",
        topics: [
          { key: "time-space-complexity", name: "Time and Space Complexity", priority: "HIGH", coverage: "CORE", weeks: [2, 7] },
          { key: "searching-sorting", name: "Searching and Sorting", priority: "HIGH", coverage: "CORE", weeks: [6] },
          { key: "hashing", name: "Hashing", priority: "MEDIUM", coverage: "CORE", weeks: [6, 8] },
          { key: "greedy", name: "Greedy Algorithms", priority: "HIGH", coverage: "CORE", weeks: [7] },
          { key: "dynamic-programming", name: "Dynamic Programming", priority: "HIGH", coverage: "CORE", weeks: [7] },
          {
            key: "graph-algorithms",
            name: "Graph Algorithms — BFS, DFS, MST, Shortest Paths",
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
    name: "Database Management Systems (DBMS)",
    priority: "HIGH",
    goalTrack: true,
    plannedCoverage: 88,
    chapters: [
      {
        key: "relational-model-schema",
        name: "Relational Model and Schema",
        priority: "HIGH",
        topics: [
          { key: "relational-database-fundamentals", name: "Relational database fundamentals", priority: "HIGH", coverage: "CORE", weeks: [1] },
          { key: "relation-tuple-attribute-domain", name: "Relation, tuple, attribute, and domain", priority: "HIGH", coverage: "CORE", weeks: [1] },
          { key: "schema-and-instances", name: "Schema and instances", priority: "MEDIUM", coverage: "CORE", weeks: [1] },
        ],
      },
      {
        key: "keys-integrity-constraints",
        name: "Keys and Integrity Constraints",
        priority: "HIGH",
        topics: [
          { key: "keys", name: "Super, candidate, primary, foreign, and composite keys", priority: "HIGH", coverage: "CORE", weeks: [1] },
          { key: "integrity-constraints", name: "Integrity constraints", priority: "HIGH", coverage: "CORE", weeks: [1] },
        ],
      },
      {
        key: "sql",
        name: "SQL",
        priority: "HIGH",
        topics: [
          { key: "sql-basics", name: "SELECT, FROM, WHERE, DISTINCT, ORDER BY", priority: "HIGH", coverage: "CORE", weeks: [1] },
          { key: "sql-filtering-aggregation", name: "AND, OR, NOT, LIKE, BETWEEN, COUNT, SUM, AVG", priority: "HIGH", coverage: "CORE", weeks: [1] },
          { key: "sql-grouping", name: "GROUP BY and HAVING", priority: "HIGH", coverage: "CORE", weeks: [3] },
          { key: "sql-joins", name: "SQL joins", priority: "HIGH", coverage: "CORE", weeks: [3] },
        ],
      },
      {
        key: "relational-algebra",
        name: "Relational Algebra",
        priority: "HIGH",
        topics: [
          { key: "relational-algebra", name: "Relational algebra operations", priority: "HIGH", coverage: "CORE", weeks: [3] },
        ],
      },
      {
        key: "functional-dependencies",
        name: "Functional Dependencies",
        priority: "HIGH",
        topics: [
          { key: "functional-dependencies", name: "Functional dependencies and closure", priority: "HIGH", coverage: "CORE", weeks: [5] },
        ],
      },
      {
        key: "normalization",
        name: "Normalization",
        priority: "HIGH",
        topics: [
          { key: "normalization", name: "1NF, 2NF, 3NF, BCNF", priority: "HIGH", coverage: "CORE", weeks: [5] },
        ],
      },
      {
        key: "transactions-acid",
        name: "Transactions and ACID",
        priority: "HIGH",
        topics: [
          { key: "transactions-acid", name: "Transactions and ACID properties", priority: "HIGH", coverage: "CORE", weeks: [8] },
        ],
      },
      {
        key: "serializability-concurrency",
        name: "Serializability and Concurrency Control",
        priority: "HIGH",
        topics: [
          { key: "serializability", name: "Serializability", priority: "HIGH", coverage: "CORE", weeks: [8] },
          { key: "concurrency-control", name: "Concurrency control", priority: "MEDIUM", coverage: "CORE", weeks: [8] },
        ],
      },
      {
        key: "indexing-b-trees",
        name: "Indexing — B-Trees and B+ Trees",
        priority: "MEDIUM",
        topics: [
          { key: "indexing-b-plus-trees", name: "Indexing, B-trees, and B+ trees", priority: "MEDIUM", coverage: "CORE", weeks: [8] },
        ],
      },
    ],
  },
  {
    slug: "discrete-mathematics",
    name: "Discrete Mathematics",
    priority: "MEDIUM",
    goalTrack: true,
    plannedCoverage: 65,
    chapters: [
      {
        key: "propositional-logic",
        name: "Propositional Logic",
        priority: "HIGH",
        topics: [
          { key: "propositions-connectives", name: "Propositions and logical connectives", priority: "HIGH", coverage: "CORE", weeks: [1] },
          { key: "truth-tables-equivalence", name: "Truth tables and logical equivalence", priority: "HIGH", coverage: "CORE", weeks: [1] },
          { key: "converse-inverse-contrapositive", name: "Converse, inverse, and contrapositive", priority: "MEDIUM", coverage: "CORE", weeks: [1] },
        ],
      },
      {
        key: "predicates-quantifiers",
        name: "Predicates and Quantifiers",
        priority: "HIGH",
        topics: [
          { key: "predicates", name: "Predicates", priority: "HIGH", coverage: "CORE", weeks: [1] },
          { key: "quantifiers", name: "Universal and existential quantifiers", priority: "HIGH", coverage: "CORE", weeks: [1] },
        ],
      },
      {
        key: "sets-relations-functions",
        name: "Sets, Relations, and Functions",
        priority: "HIGH",
        topics: [
          { key: "sets", name: "Sets", priority: "HIGH", coverage: "CORE", weeks: [3] },
          { key: "relations", name: "Relations", priority: "HIGH", coverage: "CORE", weeks: [3] },
          { key: "functions", name: "Functions", priority: "HIGH", coverage: "CORE", weeks: [3] },
        ],
      },
      {
        key: "counting-combinatorics",
        name: "Counting and Combinatorics",
        priority: "MEDIUM",
        topics: [
          { key: "counting", name: "Counting", priority: "MEDIUM", coverage: "CORE", weeks: [5] },
          { key: "permutations-combinations", name: "Permutations and combinations", priority: "MEDIUM", coverage: "CORE", weeks: [5] },
        ],
      },
      {
        key: "recurrence-generating-functions",
        name: "Recurrence Relations and Generating Functions",
        priority: "MEDIUM",
        topics: [
          { key: "recurrence-relations", name: "Recurrence relations", priority: "MEDIUM", coverage: "CORE", weeks: [7] },
          { key: "generating-functions", name: "Generating functions (selected)", priority: "SELECTIVE", coverage: "OPTIONAL", weeks: [7] },
        ],
      },
      {
        key: "graph-theory",
        name: "Graph Theory",
        priority: "MEDIUM",
        topics: [
          { key: "graph-theory", name: "Graph theory fundamentals", priority: "MEDIUM", coverage: "CORE", weeks: [7] },
        ],
      },
      {
        key: "algebraic-structures",
        name: "Groups, Monoids, Posets, and Lattices",
        priority: "SELECTIVE",
        topics: [
          { key: "groups-monoids", name: "Groups and monoids", priority: "SELECTIVE", coverage: "OPTIONAL", weeks: [8] },
          { key: "posets-lattices", name: "Posets and lattices", priority: "SELECTIVE", coverage: "OPTIONAL", weeks: [8] },
        ],
      },
    ],
  },
  {
    slug: "theory-of-computation",
    name: "Theory of Computation (TOC)",
    priority: "MEDIUM",
    goalTrack: true,
    plannedCoverage: 60,
    chapters: [
      {
        key: "finite-automata",
        name: "Finite Automata — DFA and NFA",
        priority: "HIGH",
        topics: [
          { key: "dfa", name: "Deterministic finite automata (DFA)", priority: "HIGH", coverage: "CORE", weeks: [2] },
          { key: "nfa", name: "Nondeterministic finite automata (NFA)", priority: "HIGH", coverage: "CORE", weeks: [2] },
        ],
      },
      {
        key: "regular-expressions",
        name: "Regular Expressions and Regular Languages",
        priority: "HIGH",
        topics: [
          { key: "regular-expressions", name: "Regular expressions", priority: "HIGH", coverage: "CORE", weeks: [4] },
          { key: "regular-languages", name: "Regular languages", priority: "HIGH", coverage: "CORE", weeks: [4] },
        ],
      },
      {
        key: "automata-conversion-equivalence",
        name: "Automata Conversion and Equivalence",
        priority: "HIGH",
        topics: [
          { key: "automata-conversions", name: "Automata conversions and equivalence", priority: "HIGH", coverage: "CORE", weeks: [4] },
        ],
      },
      {
        key: "pumping-lemma",
        name: "Pumping Lemma",
        priority: "MEDIUM",
        topics: [
          { key: "pumping-lemma", name: "Pumping lemma", priority: "MEDIUM", coverage: "CORE", weeks: [6] },
        ],
      },
      {
        key: "cfg-parse-trees",
        name: "Context-Free Grammars and Parse Trees",
        priority: "MEDIUM",
        topics: [
          { key: "cfg-parse-trees", name: "CFG, derivations, and parse trees", priority: "MEDIUM", coverage: "CORE", weeks: [6] },
        ],
      },
      {
        key: "pda-cfl",
        name: "Pushdown Automata and Context-Free Languages",
        priority: "MEDIUM",
        topics: [
          { key: "pda-cfl", name: "Pushdown automata and context-free languages", priority: "MEDIUM", coverage: "CORE", weeks: [8] },
        ],
      },
      {
        key: "turing-machines",
        name: "Turing Machines and Decidability",
        priority: "MEDIUM",
        topics: [
          { key: "turing-machines", name: "Turing machines", priority: "MEDIUM", coverage: "CORE", weeks: [8] },
          { key: "decidability", name: "Decidability fundamentals", priority: "SELECTIVE", coverage: "OPTIONAL", weeks: [8] },
        ],
      },
    ],
  },
  // ---- Remaining official GATE 2027 CS sections (canonical syllabus only;
  // these are not part of the two-month goal plan). Topics follow the
  // official syllabus wording published by the GATE 2027 organizing institute.
  {
    slug: "engineering-mathematics",
    name: "Engineering Mathematics",
    priority: "HIGH",
    goalTrack: false,
    plannedCoverage: null,
    chapters: [
      {
        key: "linear-algebra",
        name: "Linear Algebra",
        priority: "HIGH",
        topics: [
          { key: "matrices-determinants", name: "Matrices and determinants", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "systems-linear-equations", name: "System of linear equations", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "eigenvalues-eigenvectors", name: "Eigenvalues and eigenvectors", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "lu-decomposition", name: "LU decomposition", priority: "MEDIUM", coverage: "SUPPORTING", weeks: [] },
        ],
      },
      {
        key: "calculus",
        name: "Calculus",
        priority: "MEDIUM",
        topics: [
          { key: "limits-continuity-differentiability", name: "Limits, continuity, and differentiability", priority: "MEDIUM", coverage: "CORE", weeks: [] },
          { key: "maxima-minima", name: "Maxima and minima", priority: "MEDIUM", coverage: "CORE", weeks: [] },
          { key: "mean-value-theorem", name: "Mean value theorem", priority: "MEDIUM", coverage: "CORE", weeks: [] },
          { key: "integration", name: "Integration", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "probability-statistics",
        name: "Probability and Statistics",
        priority: "HIGH",
        topics: [
          { key: "random-variables", name: "Random variables", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "standard-distributions", name: "Uniform, normal, exponential, Poisson, and binomial distributions", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "mean-median-mode-sd", name: "Mean, median, mode, and standard deviation", priority: "MEDIUM", coverage: "CORE", weeks: [] },
          { key: "conditional-probability-bayes", name: "Conditional probability and Bayes theorem", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
    ],
  },
  {
    slug: "digital-logic",
    name: "Digital Logic",
    priority: "MEDIUM",
    goalTrack: false,
    plannedCoverage: null,
    chapters: [
      {
        key: "boolean-algebra",
        name: "Boolean Algebra and Minimization",
        priority: "HIGH",
        topics: [
          { key: "boolean-algebra", name: "Boolean algebra", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "minimization", name: "Minimization — Karnaugh map and tabular method", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "circuits",
        name: "Combinational and Sequential Circuits",
        priority: "HIGH",
        topics: [
          { key: "combinational-circuits", name: "Design of combinational circuits", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "sequential-circuits", name: "Design of sequential circuits", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "number-representation",
        name: "Number Representation and Arithmetic",
        priority: "MEDIUM",
        topics: [
          { key: "number-representation", name: "Number representation", priority: "MEDIUM", coverage: "CORE", weeks: [] },
          { key: "computer-arithmetic", name: "Computer arithmetic (fixed and floating point)", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
    ],
  },
  {
    slug: "computer-organization-architecture",
    name: "Computer Organization and Architecture",
    priority: "MEDIUM",
    goalTrack: false,
    plannedCoverage: null,
    chapters: [
      {
        key: "instruction-set",
        name: "Instruction Set and Addressing Modes",
        priority: "HIGH",
        topics: [
          { key: "machine-instructions", name: "Machine instructions", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "addressing-modes", name: "Addressing modes", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "alu-control-unit",
        name: "ALU and Control Unit",
        priority: "HIGH",
        topics: [
          { key: "alu-design", name: "Design of arithmetic and logic unit (ALU)", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "control-unit", name: "Control unit — hardwired and microprogrammed", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "memory-hierarchy",
        name: "Memory Hierarchy",
        priority: "HIGH",
        topics: [
          { key: "memory-hierarchy", name: "Memory hierarchy and performance", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "cache-mapping", name: "Cache memory mapping", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "io-interface",
        name: "I/O Interface",
        priority: "MEDIUM",
        topics: [
          { key: "interrupt-dma", name: "I/O interface — interrupt and DMA mode", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "pipelining",
        name: "Pipelining",
        priority: "HIGH",
        topics: [
          { key: "pipelining-hazards", name: "Instruction pipelining and pipeline hazards", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
    ],
  },
  {
    slug: "compiler-design",
    name: "Compiler Design",
    priority: "MEDIUM",
    goalTrack: false,
    plannedCoverage: null,
    chapters: [
      {
        key: "lexical-analysis",
        name: "Lexical Analysis",
        priority: "HIGH",
        topics: [
          { key: "lexical-analysis", name: "Lexical analysis", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "parsing",
        name: "Parsing",
        priority: "HIGH",
        topics: [
          { key: "parsing", name: "Parsing", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "syntax-directed-translation",
        name: "Syntax-Directed Translation",
        priority: "HIGH",
        topics: [
          { key: "syntax-directed-translation", name: "Syntax-directed translation", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "runtime-environments",
        name: "Runtime Environments",
        priority: "MEDIUM",
        topics: [
          { key: "runtime-environments", name: "Runtime environments", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "intermediate-code",
        name: "Intermediate Code Generation",
        priority: "MEDIUM",
        topics: [
          { key: "intermediate-code-generation", name: "Intermediate code generation", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "optimisation",
        name: "Optimisation and Data Flow Analysis",
        priority: "MEDIUM",
        topics: [
          { key: "local-optimisation", name: "Local optimisation", priority: "MEDIUM", coverage: "CORE", weeks: [] },
          { key: "data-flow-analysis", name: "Data flow analysis — constant propagation, liveness, common subexpression elimination", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
    ],
  },
  {
    slug: "operating-system",
    name: "Operating System",
    priority: "HIGH",
    goalTrack: false,
    plannedCoverage: null,
    chapters: [
      {
        key: "processes-threads",
        name: "Processes and Threads",
        priority: "HIGH",
        topics: [
          { key: "system-calls", name: "System calls", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "processes-threads", name: "Processes and threads", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "concurrency-synchronization",
        name: "Concurrency and Synchronization",
        priority: "HIGH",
        topics: [
          { key: "ipc", name: "Inter-process communication", priority: "MEDIUM", coverage: "CORE", weeks: [] },
          { key: "concurrency-synchronization", name: "Concurrency and synchronization", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "deadlock", name: "Deadlock", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "scheduling",
        name: "CPU and I/O Scheduling",
        priority: "HIGH",
        topics: [
          { key: "cpu-io-scheduling", name: "CPU and I/O scheduling", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "memory-management",
        name: "Memory Management",
        priority: "HIGH",
        topics: [
          { key: "memory-virtual-memory", name: "Memory management and virtual memory", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "file-systems",
        name: "File Systems",
        priority: "MEDIUM",
        topics: [
          { key: "file-systems", name: "File systems", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
    ],
  },
  {
    slug: "computer-networks",
    name: "Computer Networks",
    priority: "MEDIUM",
    goalTrack: false,
    plannedCoverage: null,
    chapters: [
      {
        key: "layering",
        name: "Layering",
        priority: "HIGH",
        topics: [
          { key: "osi-tcp-ip", name: "Layering — OSI and TCP/IP protocol stacks", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "switching",
        name: "Switching",
        priority: "MEDIUM",
        topics: [
          { key: "packet-circuit-switching", name: "Packet, circuit, and virtual-circuit switching", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "data-link-layer",
        name: "Data Link Layer",
        priority: "MEDIUM",
        topics: [
          { key: "framing-error-detection", name: "Framing and error detection", priority: "MEDIUM", coverage: "CORE", weeks: [] },
          { key: "mac-ethernet-bridging", name: "Medium access control and Ethernet bridging", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "routing",
        name: "Routing Protocols",
        priority: "HIGH",
        topics: [
          { key: "routing-protocols", name: "Shortest path, flooding, distance vector, and link state routing", priority: "HIGH", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "ip-addressing",
        name: "IP Addressing",
        priority: "HIGH",
        topics: [
          { key: "ipv4-cidr", name: "IPv4 and CIDR notation", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "fragmentation-ip", name: "Fragmentation and IP addressing", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "transport-application",
        name: "Transport and Application Layer",
        priority: "MEDIUM",
        topics: [
          { key: "tcp-udp", name: "TCP and UDP", priority: "HIGH", coverage: "CORE", weeks: [] },
          { key: "application-protocols", name: "Application layer protocols", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "network-security",
        name: "Network Security",
        priority: "SELECTIVE",
        topics: [
          { key: "network-security-basics", name: "Network security basics", priority: "SELECTIVE", coverage: "OPTIONAL", weeks: [] },
        ],
      },
    ],
  },
  {
    slug: "general-aptitude",
    name: "General Aptitude",
    priority: "MEDIUM",
    goalTrack: false,
    plannedCoverage: null,
    chapters: [
      {
        key: "quantitative-aptitude",
        name: "Quantitative Aptitude",
        priority: "MEDIUM",
        topics: [
          { key: "percentages", name: "Percentages — fundamentals", priority: "MEDIUM", coverage: "CORE", weeks: [1] },
          { key: "ratio-proportion", name: "Ratio and proportion", priority: "MEDIUM", coverage: "CORE", weeks: [1] },
          { key: "averages", name: "Averages", priority: "MEDIUM", coverage: "CORE", weeks: [1] },
          { key: "reasoning", name: "Basic reasoning", priority: "MEDIUM", coverage: "CORE", weeks: [1] },
        ],
      },
      {
        key: "verbal-aptitude",
        name: "Verbal Aptitude",
        priority: "MEDIUM",
        topics: [
          { key: "verbal-ability", name: "Verbal ability", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "analytical-aptitude",
        name: "Analytical Aptitude",
        priority: "MEDIUM",
        topics: [
          { key: "analytical-aptitude", name: "Analytical aptitude", priority: "MEDIUM", coverage: "CORE", weeks: [] },
        ],
      },
      {
        key: "spatial-aptitude",
        name: "Spatial Aptitude",
        priority: "SELECTIVE",
        topics: [
          { key: "spatial-aptitude", name: "Spatial aptitude", priority: "SELECTIVE", coverage: "OPTIONAL", weeks: [] },
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
    title: "Foundation: DBMS + Logic",
    goal: "DBMS: Relational model, keys and constraints, SQL introduction. Discrete Mathematics: Logic revision, truth tables, logical equivalence, initial predicates.",
  },
  {
    weekNumber: 2,
    start: "2026-10-26",
    end: "2026-11-01",
    title: "Programming + TOC",
    goal: "Programming: C fundamentals, pointers, recursion, complexity. TOC: DFA and NFA fundamentals.",
  },
  {
    weekNumber: 3,
    start: "2026-11-02",
    end: "2026-11-08",
    title: "DBMS + Discrete Mathematics",
    goal: "DBMS: SQL practice and relational algebra. Discrete Mathematics: Sets, relations, functions.",
  },
  {
    weekNumber: 4,
    start: "2026-11-09",
    end: "2026-11-15",
    title: "Data Structures + TOC",
    goal: "Data Structures: Arrays, stacks, queues, linked lists. TOC: Regular expressions, automata conversions, regular languages.",
  },
  {
    weekNumber: 5,
    start: "2026-11-16",
    end: "2026-11-22",
    title: "DBMS + Counting",
    goal: "DBMS: Functional dependencies and normalization. Discrete Mathematics: Counting, permutations and combinations.",
  },
  {
    weekNumber: 6,
    start: "2026-11-23",
    end: "2026-11-29",
    title: "Trees + TOC",
    goal: "Data Structures and Algorithms: Trees, BST, heaps, searching and sorting. TOC: Pumping lemma and CFG fundamentals.",
  },
  {
    weekNumber: 7,
    start: "2026-11-30",
    end: "2026-12-06",
    title: "Algorithms + Discrete Mathematics",
    goal: "Algorithms: Complexity, greedy fundamentals, DP fundamentals. Discrete Mathematics: Recurrence relations, graph theory fundamentals.",
  },
  {
    weekNumber: 8,
    start: "2026-12-07",
    end: "2026-12-13",
    title: "Consolidation and advanced topics",
    goal: "DBMS: Transactions, serializability, indexing. Algorithms: Mixed practice and remaining high-priority topics. TOC: PDA, context-free languages, Turing machine fundamentals. All tracks: revision, mixed PYQs, mistake-log review.",
  },
];

const MONTHS = [
  {
    id: "goal-month-1",
    title: "Month 1: Foundation and core topics",
    start: "2026-10-19",
    end: "2026-11-15",
    goal: "Build the foundations and cover high-value topics across DBMS, Programming/Data Structures, Discrete Mathematics, and TOC.",
    weeks: [1, 2, 3, 4],
    subjects: [
      ["dbms", "Target 65–75%: relational model, keys and constraints, SQL fundamentals, relational algebra, functional dependencies and normalization foundations."],
      ["programming-data-structures-algorithms", "Target 35%: C fundamentals, pointers, recursion, complexity, arrays, stacks, queues, linked lists, trees, BST, heaps, intro to searching, sorting and hashing."],
      ["discrete-mathematics", "Target 40–50%: continue Logic, equivalence and truth tables, predicates and quantifiers, sets, relations, functions, intro to counting."],
      ["theory-of-computation", "Target 30–40%: DFA, NFA, regular expressions, automata conversions, regular languages."],
    ] as [string, string][],
  },
  {
    id: "goal-month-2",
    title: "Month 2: Advanced topics, practice, and revision",
    start: "2026-11-16",
    end: "2026-12-13",
    goal: "Extend coverage into advanced topics and consolidate with practice, previous-year questions, and revision.",
    weeks: [5, 6, 7, 8],
    subjects: [
      ["dbms", "Target 85–90%: transactions and ACID, serializability, concurrency control, indexing, B/B+ trees, mixed PYQs and revision."],
      ["programming-data-structures-algorithms", "Target 65–75%: searching, sorting, hashing, trees/heaps practice, graphs, BFS, DFS, greedy, DP, MST and shortest paths, mixed algorithmic PYQs."],
      ["discrete-mathematics", "Target 60–70%: counting and combinatorics, recurrence relations, graph theory, selected generating functions, mixed practice and revision."],
      ["theory-of-computation", "Target 55–65%: pumping lemma, CFG and parse trees, PDA and context-free languages, Turing machines and decidability, mixed PYQs and revision."],
    ] as [string, string][],
  },
];

const RESOURCES = [
  {
    id: "resource-dbms-amit",
    title: "Amit Khurana — DBMS playlist",
    resourceType: "PLAYLIST" as const,
    url: "https://youtube.com/playlist?list=PLC36xJgs4dxGcz7nZaxGxxmbJrcgDXhFk",
  },
  {
    id: "resource-logic-amit",
    title: "Amit Khurana — Logic playlist",
    resourceType: "PLAYLIST" as const,
    url: "https://youtube.com/playlist?list=PLC36xJgs4dxF5fTaOmUjEJJS8PMnbgO_Y",
  },
];

type TaskSeed = {
  id: string;
  date: string;
  title: string;
  taskType: TaskType;
  minutes: number;
  topicKey?: string;
  resourceKey?: string;
  subtopic?: string;
  instructions?: string;
  expectedOutcome?: string;
  practiceNotes?: string;
  pyqNotes?: string;
};

const PYQ_UNVERIFIED_NOTE =
  "Use verified GATE previous-year questions for this subtopic if available; otherwise use self-made practice questions and label them as practice, not official PYQs.";

const WEEK1_TASKS: TaskSeed[] = [
  // Monday · 19 October 2026 — fully detailed Day 1 (90 minutes)
  {
    id: "task-w1-d1-t1",
    date: "2026-10-19",
    title: "Relational database fundamentals",
    taskType: "LEARNING",
    minutes: 20,
    topicKey: "dbms::relational-database-fundamentals",
    resourceKey: "resource-dbms-amit",
    subtopic: "Relation, tuple, attribute, domain, schema",
    instructions:
      "1. Study the relevant lecture segment.\n2. Understand the meaning of each term.\n3. Identify attributes, tuples, and relations in a small example.\n4. Write concise notes.",
    expectedOutcome:
      "You can explain relation, tuple, attribute, domain, and schema in your own words.",
  },
  {
    id: "task-w1-d1-t2",
    date: "2026-10-19",
    title: "Identify relational-model components",
    taskType: "PRACTICE",
    minutes: 15,
    topicKey: "dbms::relation-tuple-attribute-domain",
    subtopic: "Relational-model examples",
    instructions:
      "Create a small example relation, such as Student(student_id, name, department). Identify its attributes, possible domain values, tuples, and schema.",
    expectedOutcome: "You can classify the parts of a simple relational table.",
  },
  {
    id: "task-w1-d1-t3",
    date: "2026-10-19",
    title: "Propositional logic revision",
    taskType: "REVISION",
    minutes: 15,
    topicKey: "discrete-mathematics::propositions-connectives",
    resourceKey: "resource-logic-amit",
    subtopic: "Proposition, AND, OR, NOT, implication, equivalence",
    instructions:
      "1. Revise existing knowledge instead of restarting the complete chapter.\n2. Review the meaning of the six concepts.\n3. Recall the truth-table rules.",
    expectedOutcome: "You can explain each connective and its truth conditions.",
  },
  {
    id: "task-w1-d1-t4",
    date: "2026-10-19",
    title: "Truth tables practice",
    taskType: "PRACTICE",
    minutes: 10,
    topicKey: "discrete-mathematics::truth-tables-equivalence",
    subtopic: "Truth tables",
    instructions:
      "Solve 3–4 basic truth-table questions involving AND, OR, NOT, implication, or equivalence.",
    expectedOutcome: "You can construct and evaluate basic truth tables.",
  },
  {
    id: "task-w1-d1-t5",
    date: "2026-10-19",
    title: "General Aptitude — Percentages fundamentals",
    taskType: "LEARNING",
    minutes: 10,
    topicKey: "general-aptitude::percentages",
    subtopic: "Percentages — fundamentals",
    instructions:
      "Practice basic percentage conversions and straightforward percentage calculations.",
    expectedOutcome:
      "Solve a small set of introductory percentage questions and record mistakes.",
  },
  {
    id: "task-w1-d1-t6",
    date: "2026-10-19",
    title: "Quick revision — Day 1 recall",
    taskType: "REVISION",
    minutes: 5,
    topicKey: "dbms::relational-database-fundamentals",
    subtopic: "Day 1 recall",
    instructions:
      "Without looking at notes, recall the five DBMS relational-model terms, the six Logic concepts, and one mistake or confusing concept from the practice tasks. Subject association: DBMS and Discrete Mathematics.",
    expectedOutcome: "A short written recall note.",
  },
  {
    id: "task-w1-d1-t7",
    date: "2026-10-19",
    title: "DBMS topic-specific questions",
    taskType: "PYQ",
    minutes: 15,
    topicKey: "dbms::relation-tuple-attribute-domain",
    subtopic: "Relational model basics",
    instructions:
      "Attempt selected questions on relations, tuples, attributes, domains, and schemas.",
    pyqNotes: PYQ_UNVERIFIED_NOTE,
    expectedOutcome: "Record the answer and explanation for each attempted question.",
  },

  // Tuesday · 20 October 2026
  {
    id: "task-w1-d2-t1",
    date: "2026-10-20",
    title: "Keys: super, candidate, primary, foreign, composite",
    taskType: "LEARNING",
    minutes: 25,
    topicKey: "dbms::keys",
    subtopic: "Keys in relational schemas",
    instructions:
      "Study each key type, then mark every key in two small relations.",
    expectedOutcome: "You can identify each key type in a given relation.",
  },
  {
    id: "task-w1-d2-t2",
    date: "2026-10-20",
    title: "Implication and equivalence",
    taskType: "LEARNING",
    minutes: 20,
    topicKey: "discrete-mathematics::truth-tables-equivalence",
    subtopic: "Implication, equivalence, truth-table practice",
    instructions: "Revise implication and equivalence with truth tables.",
    expectedOutcome: "You can evaluate implication and equivalence expressions.",
  },
  {
    id: "task-w1-d2-t3",
    date: "2026-10-20",
    title: "Identify keys from small relations",
    taskType: "PRACTICE",
    minutes: 20,
    topicKey: "dbms::keys",
    subtopic: "Key identification",
    instructions: "Given small relations, list candidate, primary, and foreign keys.",
    expectedOutcome: "You can derive keys from a schema and its constraints.",
  },
  {
    id: "task-w1-d2-t4",
    date: "2026-10-20",
    title: "Logic questions practice",
    taskType: "PRACTICE",
    minutes: 15,
    topicKey: "discrete-mathematics::propositions-connectives",
    subtopic: "Logic questions",
    instructions: "Solve a set of logic questions on connectives.",
    expectedOutcome: "You can apply connectives confidently.",
  },
  {
    id: "task-w1-d2-t5",
    date: "2026-10-20",
    title: "General Aptitude — Percentages",
    taskType: "LEARNING",
    minutes: 10,
    topicKey: "general-aptitude::percentages",
    subtopic: "Percentages",
    instructions: "Practice percentage calculations.",
    expectedOutcome: "Solve introductory percentage questions.",
  },

  // Wednesday · 21 October 2026
  {
    id: "task-w1-d3-t1",
    date: "2026-10-21",
    title: "Logical equivalence, converse, inverse, contrapositive",
    taskType: "LEARNING",
    minutes: 25,
    topicKey: "discrete-mathematics::converse-inverse-contrapositive",
    subtopic: "Equivalence and derived implications",
    instructions:
      "Study logical equivalence and derive converse, inverse, and contrapositive of a statement.",
    expectedOutcome: "You can derive and compare the four related statements.",
  },
  {
    id: "task-w1-d3-t2",
    date: "2026-10-21",
    title: "Keys and constraints revision",
    taskType: "REVISION",
    minutes: 20,
    topicKey: "dbms::integrity-constraints",
    subtopic: "Key identification and constraints",
    instructions: "Revise key types and integrity constraints.",
    expectedOutcome: "You can recall key and constraint definitions.",
  },
  {
    id: "task-w1-d3-t3",
    date: "2026-10-21",
    title: "Logical-equivalence questions",
    taskType: "PRACTICE",
    minutes: 20,
    topicKey: "discrete-mathematics::truth-tables-equivalence",
    subtopic: "Logical equivalence",
    instructions: "Solve logical-equivalence questions using truth tables.",
    expectedOutcome: "You can prove simple equivalences.",
  },
  {
    id: "task-w1-d3-t4",
    date: "2026-10-21",
    title: "Key-identification examples",
    taskType: "PRACTICE",
    minutes: 15,
    topicKey: "dbms::keys",
    subtopic: "Key-identification examples",
    instructions: "Work through key-identification examples.",
    expectedOutcome: "You can pick the correct primary key.",
  },
  {
    id: "task-w1-d3-t5",
    date: "2026-10-21",
    title: "General Aptitude — Ratio and proportion",
    taskType: "LEARNING",
    minutes: 10,
    topicKey: "general-aptitude::ratio-proportion",
    subtopic: "Ratio and proportion",
    instructions: "Practice ratio and proportion problems.",
    expectedOutcome: "Solve basic ratio and proportion questions.",
  },

  // Thursday · 22 October 2026
  {
    id: "task-w1-d4-t1",
    date: "2026-10-22",
    title: "SQL basics: SELECT, FROM, WHERE, DISTINCT, ORDER BY",
    taskType: "LEARNING",
    minutes: 25,
    topicKey: "dbms::sql-basics",
    subtopic: "SQL fundamentals",
    instructions:
      "Study SELECT, FROM, WHERE, DISTINCT, and ORDER BY on a small example table.",
    expectedOutcome: "You can write basic SELECT queries.",
  },
  {
    id: "task-w1-d4-t2",
    date: "2026-10-22",
    title: "Truth tables and equivalence practice",
    taskType: "PRACTICE",
    minutes: 20,
    topicKey: "discrete-mathematics::truth-tables-equivalence",
    subtopic: "Truth tables",
    instructions: "Solve truth-table and equivalence questions.",
    expectedOutcome: "You can evaluate compound propositions reliably.",
  },
  {
    id: "task-w1-d4-t3",
    date: "2026-10-22",
    title: "Write basic SQL queries",
    taskType: "PRACTICE",
    minutes: 20,
    topicKey: "dbms::sql-basics",
    subtopic: "Basic SQL queries",
    instructions: "Write basic SQL queries against a small example table.",
    expectedOutcome: "You can filter and order rows correctly.",
  },
  {
    id: "task-w1-d4-t4",
    date: "2026-10-22",
    title: "General Aptitude — Averages",
    taskType: "LEARNING",
    minutes: 10,
    topicKey: "general-aptitude::averages",
    subtopic: "Averages",
    instructions: "Practice average calculations.",
    expectedOutcome: "Solve basic average problems.",
  },
  {
    id: "task-w1-d4-t5",
    date: "2026-10-22",
    title: "SQL and logic recall",
    taskType: "REVISION",
    minutes: 15,
    topicKey: "dbms::sql-basics",
    subtopic: "Recall",
    instructions: "Recall today's SQL clauses and logic rules.",
    expectedOutcome: "You can reproduce the key definitions.",
  },

  // Friday · 23 October 2026
  {
    id: "task-w1-d5-t1",
    date: "2026-10-23",
    title: "SQL filtering and aggregation",
    taskType: "LEARNING",
    minutes: 25,
    topicKey: "dbms::sql-filtering-aggregation",
    subtopic: "AND, OR, NOT, LIKE, BETWEEN, COUNT, SUM, AVG, GROUP BY, HAVING",
    instructions:
      "Study boolean filters, pattern matching, aggregates, and grouping.",
    expectedOutcome: "You can build filtered and aggregated queries.",
  },
  {
    id: "task-w1-d5-t2",
    date: "2026-10-23",
    title: "Predicates versus propositions",
    taskType: "LEARNING",
    minutes: 20,
    topicKey: "discrete-mathematics::predicates",
    subtopic: "Predicate versus proposition, introductory quantifiers",
    instructions: "Study how predicates differ from propositions.",
    expectedOutcome: "You can tell predicates and propositions apart.",
  },
  {
    id: "task-w1-d5-t3",
    date: "2026-10-23",
    title: "SQL filtering and aggregation questions",
    taskType: "PRACTICE",
    minutes: 20,
    topicKey: "dbms::sql-filtering-aggregation",
    subtopic: "Filtering and aggregation practice",
    instructions: "Solve SQL filtering and aggregation questions.",
    expectedOutcome: "You can answer grouped-query questions.",
  },
  {
    id: "task-w1-d5-t4",
    date: "2026-10-23",
    title: "Simple predicate examples",
    taskType: "PRACTICE",
    minutes: 15,
    topicKey: "discrete-mathematics::predicates",
    subtopic: "Predicate examples",
    instructions: "Write simple predicate examples with small domains.",
    expectedOutcome: "You can evaluate predicates over a domain.",
  },
  {
    id: "task-w1-d5-t5",
    date: "2026-10-23",
    title: "General Aptitude — Basic reasoning",
    taskType: "LEARNING",
    minutes: 10,
    topicKey: "general-aptitude::reasoning",
    subtopic: "Basic reasoning",
    instructions: "Practice basic reasoning questions.",
    expectedOutcome: "Solve a small reasoning set.",
  },

  // Saturday · 24 October 2026
  {
    id: "task-w1-d6-t1",
    date: "2026-10-24",
    title: "DBMS concept recall",
    taskType: "REVISION",
    minutes: 20,
    topicKey: "dbms::relational-database-fundamentals",
    subtopic: "Relational model and SQL recall",
    instructions: "Recall the relational model and SQL from this week.",
    expectedOutcome: "You can summarise the week's DBMS concepts.",
  },
  {
    id: "task-w1-d6-t2",
    date: "2026-10-24",
    title: "SQL query practice",
    taskType: "PRACTICE",
    minutes: 20,
    topicKey: "dbms::sql-filtering-aggregation",
    subtopic: "Query practice",
    instructions: "Write mixed SQL queries from scratch.",
    expectedOutcome: "You can write queries without notes.",
  },
  {
    id: "task-w1-d6-t3",
    date: "2026-10-24",
    title: "DBMS topic-specific PYQs",
    taskType: "PYQ",
    minutes: 15,
    topicKey: "dbms::keys",
    subtopic: "Keys and constraints",
    instructions: "Attempt selected DBMS questions on keys and constraints.",
    pyqNotes: PYQ_UNVERIFIED_NOTE,
    expectedOutcome: "Record answers and explanations.",
  },
  {
    id: "task-w1-d6-t4",
    date: "2026-10-24",
    title: "Universal and existential quantifiers",
    taskType: "LEARNING",
    minutes: 20,
    topicKey: "discrete-mathematics::quantifiers",
    subtopic: "Meaning of universal and existential quantifiers",
    instructions: "Study the meaning and negation of each quantifier.",
    expectedOutcome: "You can translate quantified statements.",
  },
  {
    id: "task-w1-d6-t5",
    date: "2026-10-24",
    title: "General Aptitude — Mixed practice",
    taskType: "PRACTICE",
    minutes: 15,
    topicKey: "general-aptitude::percentages",
    subtopic: "Mixed practice from the week's topics",
    instructions: "Solve mixed aptitude questions from this week.",
    expectedOutcome: "Log the mistakes you make.",
  },

  // Sunday · 25 October 2026 — buffer and weekly review (flexible, under 90 minutes)
  {
    id: "task-w1-d7-t1",
    date: "2026-10-25",
    title: "Short DBMS assessment",
    taskType: "PRACTICE",
    minutes: 25,
    topicKey: "dbms::sql-basics",
    subtopic: "Weekly DBMS assessment",
    instructions: "Take a short assessment covering this week's DBMS topics.",
    expectedOutcome: "You have a score to compare against next week.",
  },
  {
    id: "task-w1-d7-t2",
    date: "2026-10-25",
    title: "Logic truth-table practice",
    taskType: "PRACTICE",
    minutes: 20,
    topicKey: "discrete-mathematics::truth-tables-equivalence",
    subtopic: "Truth-table practice",
    instructions: "Solve extra truth-table questions.",
    expectedOutcome: "You can evaluate truth tables quickly.",
  },
  {
    id: "task-w1-d7-t3",
    date: "2026-10-25",
    title: "General Aptitude practice",
    taskType: "PRACTICE",
    minutes: 10,
    topicKey: "general-aptitude::averages",
    subtopic: "Aptitude practice",
    instructions: "Solve a short aptitude set.",
    expectedOutcome: "Record mistakes.",
  },
  {
    id: "task-w1-d7-t4",
    date: "2026-10-25",
    title: "Weekly review and mistake log",
    taskType: "REVISION",
    minutes: 15,
    topicKey: "dbms::relational-database-fundamentals",
    subtopic: "Week 1 review",
    instructions:
      "Review incomplete tasks, update the weekly mistake log, and prepare for Week 2.",
    expectedOutcome: "A clear list of pending items and mistakes.",
  },
];

function iso(date: string) {
  return new Date(date + "T00:00:00.000Z");
}

function addDays(date: string, days: number) {
  const d = iso(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function id(prefix: string, key: string) {
  return `${prefix}-${key}`;
}

function topicRefKey(subjectSlug: string, topicKey: string) {
  return `${subjectSlug}::${topicKey}`;
}

type TopicRef = { key: string; topicId: string; name: string; subjectName: string; chapterName: string };

function generateWeekTasks(
  week: (typeof WEEKS)[number],
  pool: TopicRef[],
  aptitude: TopicRef[]
): TaskSeed[] {
  if (pool.length === 0) return [];
  const tasks: TaskSeed[] = [];
  const aptitudeFor = (i: number) => aptitude[i % Math.max(aptitude.length, 1)];

  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const date = addDays(week.start, dayIndex);
    const apt = aptitudeFor(dayIndex + week.weekNumber);
    if (dayIndex === 6) {
      const reviewTopic = pool[week.weekNumber % pool.length];
      tasks.push(
        {
          id: `task-w${week.weekNumber}-d7-t1`,
          date,
          title: `Weekly review — ${week.title}`,
          taskType: "REVISION",
          minutes: 30,
          topicKey: reviewTopic.key,
          instructions:
            "Review this week's goals, clear pending tasks, and update the mistake log.",
          expectedOutcome: "A short list of completed topics and pending items.",
        },
        {
          id: `task-w${week.weekNumber}-d7-t2`,
          date,
          title: "Mixed practice set",
          taskType: "PRACTICE",
          minutes: 25,
          topicKey: reviewTopic.key,
          instructions: "Solve a mixed set drawn from this week's topics under time.",
          expectedOutcome: "You can attempt unfamiliar mixed questions.",
        },
        {
          id: `task-w${week.weekNumber}-d7-t3`,
          date,
          title: `General Aptitude — ${apt.name}`,
          taskType: "LEARNING",
          minutes: 15,
          topicKey: apt.key,
          instructions: `Practice a short General Aptitude set on ${apt.name}.`,
          expectedOutcome: "Solve a small aptitude set and record mistakes.",
        },
        {
          id: `task-w${week.weekNumber}-d7-t4`,
          date,
          title: "Mistake-log review",
          taskType: "REVISION",
          minutes: 15,
          topicKey: reviewTopic.key,
          instructions: "Re-read the mistake log and re-solve two earlier problems.",
          expectedOutcome: "Two previously wrong problems now solved correctly.",
        }
      );
      continue;
    }

    const a = pool[dayIndex % pool.length];
    const b = pool[(dayIndex + 1) % pool.length];
    tasks.push(
      {
        id: `task-w${week.weekNumber}-d${dayIndex + 1}-t1`,
        date,
        title: a.name,
        taskType: "LEARNING",
        minutes: 40,
        topicKey: a.key,
        instructions: `Study ${a.name}. Read the concept, work through one solved example, and write concise notes.`,
        expectedOutcome: `You can explain ${a.name} and solve a standard problem from it.`,
      },
      {
        id: `task-w${week.weekNumber}-d${dayIndex + 1}-t2`,
        date,
        title: `Practice — ${b.name}`,
        taskType: "PRACTICE",
        minutes: 25,
        topicKey: b.key,
        instructions: `Solve 8–12 questions on ${b.name} without notes and log every mistake.`,
        expectedOutcome: `You can solve basic questions on ${b.name}.`,
      },
      {
        id: `task-w${week.weekNumber}-d${dayIndex + 1}-t3`,
        date,
        title: `General Aptitude — ${apt.name}`,
        taskType: "LEARNING",
        minutes: 10,
        topicKey: apt.key,
        instructions: `Practice a short General Aptitude set on ${apt.name}.`,
        expectedOutcome: "Solve a small aptitude set and record mistakes.",
      },
      dayIndex % 2 === 0
        ? {
            id: `task-w${week.weekNumber}-d${dayIndex + 1}-t4`,
            date,
            title: `Revision — ${a.name}`,
            taskType: "REVISION",
            minutes: 10,
            topicKey: a.key,
            instructions: `Recall ${a.name} from memory, then redo the mistakes in your log.`,
            expectedOutcome: `You can reproduce the key ideas of ${a.name}.`,
          }
        : {
            id: `task-w${week.weekNumber}-d${dayIndex + 1}-t4`,
            date,
            title: `PYQ — ${b.name}`,
            taskType: "PYQ",
            minutes: 10,
            topicKey: b.key,
            instructions: `Attempt relevant questions on ${b.name}.`,
            pyqNotes: PYQ_UNVERIFIED_NOTE,
            expectedOutcome: "Record the answer and explanation for each question.",
          }
    );
  }
  return tasks;
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
    where: { id: STUDY_PLAN_ID },
    update: { startDate: iso("2026-10-19"), targetDate: iso("2026-12-13"), status: "ACTIVE" },
    create: {
      id: STUDY_PLAN_ID,
      startDate: iso("2026-10-19"),
      targetDate: iso("2026-12-13"),
      status: "ACTIVE",
    },
  });

  for (const r of RESOURCES) {
    await prisma.resource.upsert({
      where: { id: r.id },
      update: { title: r.title, url: r.url, resourceType: r.resourceType },
      create: { id: r.id, title: r.title, url: r.url, resourceType: r.resourceType, isSample: false },
    });
  }

  // Rebuild the goal-plan structure from scratch so restructured chapters do
  // not leave stale rows behind. Completion lives in TopicProgress/StudyTask,
  // which this does not touch.
  await prisma.goalPlan.deleteMany({ where: { id: PLAN_ID } });

  await prisma.goalPlan.create({
    data: {
      id: PLAN_ID,
      profileId: profile.id,
      title: "GATE 2027 CS — Two-Month High-Priority Plan",
      startDate: iso("2026-10-19"),
      endDate: iso("2026-12-13"),
      dailyStudyMinutes: 90,
      strategy:
        "One main study block, one weaker-topic block, practice/PYQs, daily Aptitude, and revision. Month 1 builds foundations; Month 2 extends into advanced topics with practice and revision. Schedule displayed in Asia/Kolkata.",
      studyPlanId: STUDY_PLAN_ID,
    },
  });

  const topicRefs = new Map<string, TopicRef>();
  const subjectRealIds = new Map<string, string>();
  const goalSubjectIds = new Map<string, string>();
  const topicsByWeek = new Map<number, TopicRef[]>();

  const upsertDesiredChapters = new Map<string, string[]>();

  for (const [subjectIndex, s] of SUBJECTS.entries()) {
    const subject = await prisma.subject.upsert({
      where: { id: id("subject", s.slug) },
      update: { name: s.name, slug: s.slug, displayOrder: subjectIndex + 1, isSample: false },
      create: {
        id: id("subject", s.slug),
        name: s.name,
        slug: s.slug,
        description: "GATE 2027 CS preparation track.",
        displayOrder: subjectIndex + 1,
        isSample: false,
      },
    });
    subjectRealIds.set(s.slug, subject.id);
    upsertDesiredChapters.set(s.slug, []);

    let goalSubjectId: string | null = null;
    if (s.goalTrack) {
      const goalSubject = await prisma.goalSubject.create({
        data: {
          id: id("goal-subject", s.slug),
          goalPlanId: PLAN_ID,
          subjectId: subject.id,
          name: s.name,
          slug: s.slug,
          priority: s.priority,
          weightageEstimate: WEIGHTAGE_ESTIMATE,
          weightageSource: WEIGHTAGE_SOURCE,
          weightageYear: null,
          plannedCoverage: s.plannedCoverage ?? 100,
          displayOrder: subjectIndex + 1,
        },
      });
      goalSubjectId = goalSubject.id;
      goalSubjectIds.set(s.slug, goalSubject.id);
    }

    for (const [chapterIndex, c] of s.chapters.entries()) {
      const chapterId = id("chapter", `${s.slug}-${c.key}`);
      const chapter = await prisma.chapter.upsert({
        where: { id: chapterId },
        update: { subjectId: subject.id, name: c.name, slug: `${s.slug}-${c.key}`, displayOrder: chapterIndex + 1, isSample: false },
        create: {
          id: chapterId,
          subjectId: subject.id,
          name: c.name,
          slug: `${s.slug}-${c.key}`,
          displayOrder: chapterIndex + 1,
          isSample: false,
        },
      });
      upsertDesiredChapters.get(s.slug)!.push(chapter.id);

      let goalChapterId: string | null = null;
      if (goalSubjectId) {
        const goalChapter = await prisma.goalChapter.create({
          data: {
            id: id("goal-chapter", `${s.slug}-${c.key}`),
            goalSubjectId,
            name: c.name,
            slug: c.key,
            priority: c.priority,
            displayOrder: chapterIndex + 1,
          },
        });
        goalChapterId = goalChapter.id;
      }

      for (const [topicIndex, t] of c.topics.entries()) {
        const topicId = id("topic", `${s.slug}-${t.key}`);
        const topic = await prisma.topic.upsert({
          where: { id: topicId },
          update: { chapterId: chapter.id, name: t.name, slug: t.key, displayOrder: topicIndex + 1, isSample: false },
          create: {
            id: topicId,
            chapterId: chapter.id,
            parentTopicId: null,
            name: t.name,
            slug: t.key,
            priority: t.priority === "SELECTIVE" ? "LOW" : t.priority,
            displayOrder: topicIndex + 1,
            isSample: false,
          },
        });

        const ref: TopicRef = {
          key: topicRefKey(s.slug, t.key),
          topicId: topic.id,
          name: t.name,
          subjectName: s.name,
          chapterName: c.name,
        };
        topicRefs.set(topicRefKey(s.slug, t.key), ref);

        for (const weekNumber of t.weeks) {
          const list = topicsByWeek.get(weekNumber) ?? [];
          list.push(ref);
          topicsByWeek.set(weekNumber, list);
        }

        if (goalChapterId) {
          const weekStarts = t.weeks.map((n) => WEEKS.find((w) => w.weekNumber === n)).filter(Boolean) as typeof WEEKS;
          const plannedStart = weekStarts.length ? weekStarts[0].start : null;
          const plannedEnd = weekStarts.length ? weekStarts[weekStarts.length - 1].end : null;
          await prisma.goalTopic.create({
            data: {
              id: id("goal-topic", `${s.slug}-${t.key}`),
              goalChapterId,
              topicId: topic.id,
              name: t.name,
              slug: t.key,
              priority: t.priority,
              coverage: t.coverage,
              plannedStart: plannedStart ? iso(plannedStart) : null,
              plannedEnd: plannedEnd ? iso(plannedEnd) : null,
              displayOrder: topicIndex + 1,
            },
          });
        }
      }
    }

    // Remove real chapters under this subject that are no longer part of the seed.
    const desired = upsertDesiredChapters.get(s.slug) ?? [];
    await prisma.chapter.deleteMany({
      where: { subjectId: subject.id, id: { notIn: desired } },
    });
  }

  // Goal plan months
  for (const [index, m] of MONTHS.entries()) {
    await prisma.goalMonth.create({
      data: {
        id: m.id,
        goalPlanId: PLAN_ID,
        title: m.title,
        startDate: iso(m.start),
        endDate: iso(m.end),
        goal: m.goal,
        displayOrder: index + 1,
      },
    });
  }

  // Goal plan weeks
  for (const [index, w] of WEEKS.entries()) {
    const month = MONTHS.find((m) => m.weeks.includes(w.weekNumber));
    await prisma.goalWeek.create({
      data: {
        id: `goal-week-${w.weekNumber}`,
        goalPlanId: PLAN_ID,
        goalMonthId: month?.id ?? null,
        weekNumber: w.weekNumber,
        title: `${w.title}`,
        startDate: iso(w.start),
        endDate: iso(w.end),
        goal: w.goal,
        targetPercent: Math.round(((index + 1) / WEEKS.length) * 100),
        displayOrder: index + 1,
      },
    });
  }

  // Month → subject focus
  for (const m of MONTHS) {
    for (const [subjectIndex, [slug, focus]] of m.subjects.entries()) {
      const goalSubjectId = goalSubjectIds.get(slug);
      if (!goalSubjectId) continue;
      await prisma.goalMonthSubject.create({
        data: {
          goalMonthId: m.id,
          goalSubjectId,
          focus,
          displayOrder: subjectIndex + 1,
        },
      });
    }
  }

  // Link goal topics to the weeks they are planned for.
  for (const s of SUBJECTS) {
    if (!s.goalTrack) continue;
    for (const c of s.chapters) {
      for (const t of c.topics) {
        const goalTopicId = id("goal-topic", `${s.slug}-${t.key}`);
        for (const weekNumber of t.weeks) {
          await prisma.goalWeekTopic.create({
            data: {
              goalWeekId: `goal-week-${weekNumber}`,
              goalTopicId,
              isTarget: true,
            },
          });
        }
      }
    }
  }

  // ---- Planly tasks ----
  const aptitudePool = [
    topicRefs.get(topicRefKey("general-aptitude", "percentages")),
    topicRefs.get(topicRefKey("general-aptitude", "ratio-proportion")),
    topicRefs.get(topicRefKey("general-aptitude", "averages")),
    topicRefs.get(topicRefKey("general-aptitude", "reasoning")),
  ].filter((t): t is TopicRef => Boolean(t));

  const allTasks: TaskSeed[] = [...WEEK1_TASKS];
  for (const w of WEEKS) {
    if (w.weekNumber === 1) continue;
    const pool = topicsByWeek.get(w.weekNumber) ?? [];
    allTasks.push(...generateWeekTasks(w, pool, aptitudePool));
  }

  for (const t of allTasks) {
    const ref = t.topicKey ? topicRefs.get(t.topicKey) : undefined;
    const topicId = ref?.topicId ?? null;
    const data = {
      studyPlanId: STUDY_PLAN_ID,
      scheduledDate: iso(t.date),
      title: t.title,
      taskType: t.taskType,
      topicId,
      resourceId: t.resourceKey ?? null,
      subtopic: t.subtopic ?? null,
      instructions: t.instructions ?? null,
      expectedOutcome: t.expectedOutcome ?? null,
      practiceNotes: t.practiceNotes ?? null,
      pyqNotes: t.pyqNotes ?? null,
      estimatedMinutes: t.minutes,
      displayOrder: Number(t.id.split("-t").pop() ?? 1),
    };
    const existing = await prisma.studyTask.findUnique({ where: { id: t.id } });
    if (existing) {
      // Descriptive fields only — status, completedAt, and user notes are preserved.
      await prisma.studyTask.update({ where: { id: t.id }, data });
    } else {
      await prisma.studyTask.create({ data: { id: t.id, ...data } });
    }
  }

  const day1 = allTasks.filter((t) => t.date === "2026-10-19");
  const day1Minutes = day1.reduce((sum, t) => sum + t.minutes, 0);

  console.log("Goal plan seed OK:", {
    profile: profile.id,
    subjects: SUBJECTS.filter((s) => s.goalTrack).length,
    months: MONTHS.length,
    weeks: WEEKS.length,
    tasks: allTasks.length,
    day1Tasks: day1.length,
    day1Minutes,
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
