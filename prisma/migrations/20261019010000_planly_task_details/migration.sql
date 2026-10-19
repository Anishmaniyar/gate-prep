-- Add the Planly study-brief and persisted-notes fields to StudyTask.
ALTER TABLE "StudyTask"
  ADD COLUMN "subtopic" TEXT,
  ADD COLUMN "instructions" TEXT,
  ADD COLUMN "expectedOutcome" TEXT,
  ADD COLUMN "practiceNotes" TEXT,
  ADD COLUMN "pyqNotes" TEXT,
  ADD COLUMN "notes" TEXT;
