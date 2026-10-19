// Clearly-labeled SAMPLE data for the Phase 1/2 frontend shell.
// Real GATE 2027 syllabus + verified PYQs are NOT included yet (Phase 4).

import type { TopicNode } from "@/components/TopicTree";
import type { Task } from "@/components/TaskList";

export const MOCK_PROFILE = {
  name: "Anish",
  examTarget: "GATE 2027 CS",
  targetDate: "2027-02-06",
  streak: 3,
  overallPercent: 12,
};

export const MOCK_SUBJECTS = [
  { slug: "sample-discrete-mathematics", name: "SAMPLE Discrete Mathematics", progress: 25, topics: "1/4 topics" },
  { slug: "sample-digital-logic", name: "SAMPLE Digital Logic", progress: 0, topics: "0/2 topics" },
];

export const MOCK_TOPICS: TopicNode[] = [
  {
    id: "t-implication",
    name: "SAMPLE Implication",
    slug: "sample-implication",
    priority: "HIGH",
    completed: true,
    children: [{ id: "t-truth", name: "SAMPLE Truth tables (subtopic)", slug: "sample-truth-tables" }],
  },
  { id: "t-equivalence", name: "SAMPLE Equivalence", slug: "sample-equivalence", priority: "MEDIUM" },
];

export const MOCK_TASKS: Task[] = [
  { id: "task-1", title: "SAMPLE: Learn Implication basics", taskType: "LEARNING", estimatedMinutes: 60, status: "COMPLETED", topicName: "Implication" },
  { id: "task-2", title: "SAMPLE: Solve implication PYQs", taskType: "PYQ", estimatedMinutes: 45, status: "PENDING", topicName: "Implication" },
  { id: "task-3", title: "SAMPLE: Revise truth tables", taskType: "REVISION", estimatedMinutes: 20, status: "PENDING", topicName: "Truth tables" },
];

export const MOCK_REVISIONS = [
  { id: "r-1", topic: "SAMPLE Implication", date: "2026-10-22", status: "PENDING" },
];

export function daysRemaining(targetIso: string, today = new Date()) {
  const target = new Date(targetIso + "T00:00:00Z");
  const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);
  return Math.max(0, diff);
}
