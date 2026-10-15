import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1).optional(),
  examTarget: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  targetDate: z.string().datetime().optional(),
  dailyStudyMinutes: z.number().int().positive().optional(),
});

export const subjectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

export const chapterSchema = z.object({
  subjectId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  displayOrder: z.number().int().optional(),
});

export const topicSchema = z.object({
  chapterId: z.string().min(1),
  parentTopicId: z.string().nullable().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  displayOrder: z.number().int().optional(),
});

export const topicProgressSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
});

export const resourceSchema = z.object({
  title: z.string().min(1),
  resourceType: z.enum(["VIDEO", "PLAYLIST", "BOOK", "NOTES", "LINK"]).optional(),
  url: z.string().url().nullable().optional(),
  description: z.string().optional(),
  topicIds: z.array(z.string()).optional(),
});

export const questionSchema = z.object({
  sourceType: z.enum(["PYQ", "BOOK", "CUSTOM"]),
  questionType: z.enum(["MCQ", "MSQ", "NAT", "OTHER"]).optional(),
  content: z.string().nullable().optional(),
  answer: z.string().nullable().optional(),
  explanation: z.string().nullable().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).nullable().optional(),
  year: z.number().int().nullable().optional(),
  session: z.string().nullable().optional(),
  marks: z.number().nullable().optional(),
  sourceRef: z.string().nullable().optional(),
  verified: z.boolean().optional(),
  topicIds: z.array(z.string()).optional(),
});

export const planSchema = z.object({
  startDate: z.string().datetime(),
  targetDate: z.string().datetime(),
});

export const taskSchema = z.object({
  studyPlanId: z.string().min(1),
  scheduledDate: z.string().datetime(),
  title: z.string().min(1),
  taskType: z.enum(["LEARNING", "PRACTICE", "PYQ", "REVISION"]),
  topicId: z.string().nullable().optional(),
  resourceId: z.string().nullable().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  displayOrder: z.number().int().optional(),
  questionIds: z.array(z.string()).optional(),
});

export const taskStatusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "SKIPPED"]),
});

export const attemptSchema = z.object({
  questionId: z.string().min(1),
  isCorrect: z.boolean().nullable().optional(),
  timeTakenSeconds: z.number().int().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const revisionSchema = z.object({
  topicId: z.string().min(1),
  scheduledDate: z.string().datetime(),
});

export const revisionStatusSchema = z.object({
  status: z.enum(["PENDING", "DONE", "OVERDUE"]),
});

export const checkinSchema = z.object({
  date: z.string().datetime(),
  tasksCompleted: z.number().int().optional(),
  minutesStudied: z.number().int().optional(),
  notes: z.string().nullable().optional(),
});
