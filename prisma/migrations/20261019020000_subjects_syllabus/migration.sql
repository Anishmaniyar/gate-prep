-- Subjects & Syllabus: add a fourth topic status and per-topic notes.
ALTER TYPE "TopicStatus" ADD VALUE IF NOT EXISTS 'NEEDS_REVISION';
ALTER TABLE "Topic" ADD COLUMN "notes" TEXT;
