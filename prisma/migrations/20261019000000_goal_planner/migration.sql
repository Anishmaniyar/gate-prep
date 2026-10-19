-- CreateEnum
CREATE TYPE "GoalPriority" AS ENUM ('HIGH', 'MEDIUM', 'SELECTIVE');

-- CreateEnum
CREATE TYPE "GoalCoverage" AS ENUM ('CORE', 'SUPPORTING', 'OPTIONAL');

-- CreateTable
CREATE TABLE "GoalPlan" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "dailyStudyMinutes" INTEGER NOT NULL DEFAULT 90,
    "strategy" TEXT,
    "studyPlanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoalPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalSubject" (
    "id" TEXT NOT NULL,
    "goalPlanId" TEXT NOT NULL,
    "subjectId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "priority" "GoalPriority" NOT NULL DEFAULT 'MEDIUM',
    "weightageEstimate" DOUBLE PRECISION,
    "weightageSource" TEXT,
    "weightageYear" INTEGER,
    "plannedCoverage" INTEGER NOT NULL DEFAULT 100,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoalSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalChapter" (
    "id" TEXT NOT NULL,
    "goalSubjectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "priority" "GoalPriority" NOT NULL DEFAULT 'MEDIUM',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GoalChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalTopic" (
    "id" TEXT NOT NULL,
    "goalChapterId" TEXT NOT NULL,
    "topicId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "priority" "GoalPriority" NOT NULL DEFAULT 'MEDIUM',
    "coverage" "GoalCoverage" NOT NULL DEFAULT 'CORE',
    "plannedStart" TIMESTAMP(3),
    "plannedEnd" TIMESTAMP(3),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoalTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalMonth" (
    "id" TEXT NOT NULL,
    "goalPlanId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "goal" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GoalMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalMonthSubject" (
    "id" TEXT NOT NULL,
    "goalMonthId" TEXT NOT NULL,
    "goalSubjectId" TEXT NOT NULL,
    "focus" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GoalMonthSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalWeek" (
    "id" TEXT NOT NULL,
    "goalPlanId" TEXT NOT NULL,
    "goalMonthId" TEXT,
    "weekNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "goal" TEXT,
    "targetPercent" INTEGER NOT NULL DEFAULT 0,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GoalWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalWeekTopic" (
    "id" TEXT NOT NULL,
    "goalWeekId" TEXT NOT NULL,
    "goalTopicId" TEXT NOT NULL,
    "isTarget" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GoalWeekTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GoalPlan_profileId_idx" ON "GoalPlan"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalSubject_goalPlanId_slug_key" ON "GoalSubject"("goalPlanId", "slug");

-- CreateIndex
CREATE INDEX "GoalSubject_goalPlanId_displayOrder_idx" ON "GoalSubject"("goalPlanId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GoalChapter_goalSubjectId_slug_key" ON "GoalChapter"("goalSubjectId", "slug");

-- CreateIndex
CREATE INDEX "GoalChapter_goalSubjectId_displayOrder_idx" ON "GoalChapter"("goalSubjectId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GoalTopic_goalChapterId_slug_key" ON "GoalTopic"("goalChapterId", "slug");

-- CreateIndex
CREATE INDEX "GoalTopic_goalChapterId_displayOrder_idx" ON "GoalTopic"("goalChapterId", "displayOrder");

-- CreateIndex
CREATE INDEX "GoalTopic_topicId_idx" ON "GoalTopic"("topicId");

-- CreateIndex
CREATE INDEX "GoalMonth_goalPlanId_displayOrder_idx" ON "GoalMonth"("goalPlanId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GoalMonthSubject_goalMonthId_goalSubjectId_key" ON "GoalMonthSubject"("goalMonthId", "goalSubjectId");

-- CreateIndex
CREATE INDEX "GoalMonthSubject_goalMonthId_displayOrder_idx" ON "GoalMonthSubject"("goalMonthId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GoalWeek_goalPlanId_weekNumber_key" ON "GoalWeek"("goalPlanId", "weekNumber");

-- CreateIndex
CREATE INDEX "GoalWeek_goalPlanId_displayOrder_idx" ON "GoalWeek"("goalPlanId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "GoalWeekTopic_goalWeekId_goalTopicId_key" ON "GoalWeekTopic"("goalWeekId", "goalTopicId");

-- CreateIndex
CREATE INDEX "GoalWeekTopic_goalWeekId_idx" ON "GoalWeekTopic"("goalWeekId");

-- CreateIndex
CREATE INDEX "GoalWeekTopic_goalTopicId_idx" ON "GoalWeekTopic"("goalTopicId");

-- AddForeignKey
ALTER TABLE "GoalPlan" ADD CONSTRAINT "GoalPlan_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalSubject" ADD CONSTRAINT "GoalSubject_goalPlanId_fkey" FOREIGN KEY ("goalPlanId") REFERENCES "GoalPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalChapter" ADD CONSTRAINT "GoalChapter_goalSubjectId_fkey" FOREIGN KEY ("goalSubjectId") REFERENCES "GoalSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalTopic" ADD CONSTRAINT "GoalTopic_goalChapterId_fkey" FOREIGN KEY ("goalChapterId") REFERENCES "GoalChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalMonth" ADD CONSTRAINT "GoalMonth_goalPlanId_fkey" FOREIGN KEY ("goalPlanId") REFERENCES "GoalPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalMonthSubject" ADD CONSTRAINT "GoalMonthSubject_goalMonthId_fkey" FOREIGN KEY ("goalMonthId") REFERENCES "GoalMonth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalMonthSubject" ADD CONSTRAINT "GoalMonthSubject_goalSubjectId_fkey" FOREIGN KEY ("goalSubjectId") REFERENCES "GoalSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalWeek" ADD CONSTRAINT "GoalWeek_goalPlanId_fkey" FOREIGN KEY ("goalPlanId") REFERENCES "GoalPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalWeek" ADD CONSTRAINT "GoalWeek_goalMonthId_fkey" FOREIGN KEY ("goalMonthId") REFERENCES "GoalMonth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalWeekTopic" ADD CONSTRAINT "GoalWeekTopic_goalWeekId_fkey" FOREIGN KEY ("goalWeekId") REFERENCES "GoalWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalWeekTopic" ADD CONSTRAINT "GoalWeekTopic_goalTopicId_fkey" FOREIGN KEY ("goalTopicId") REFERENCES "GoalTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
