import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Single preparation profile
  const profile = await prisma.profile.upsert({
    where: { id: "sample-profile-1" },
    update: {},
    create: {
      id: "sample-profile-1",
      name: "Aspirant",
      examTarget: "GATE 2027 CS",
      startDate: new Date("2026-10-15T00:00:00Z"),
      targetDate: new Date("2027-02-06T00:00:00Z"),
      dailyStudyMinutes: 240,
    },
  });

  // SAMPLE subjects (clearly labeled; NOT the official syllabus)
  const dm = await prisma.subject.upsert({
    where: { slug: "sample-discrete-mathematics" },
    update: {},
    create: {
      name: "SAMPLE Discrete Mathematics",
      slug: "sample-discrete-mathematics",
      description: "SAMPLE data — placeholder until official GATE 2027 CS syllabus is imported.",
      displayOrder: 1,
      isSample: true,
    },
  });

  const coa = await prisma.subject.upsert({
    where: { slug: "sample-digital-logic" },
    update: {},
    create: {
      name: "SAMPLE Digital Logic",
      slug: "sample-digital-logic",
      description: "SAMPLE data — placeholder until official GATE 2027 CS syllabus is imported.",
      displayOrder: 2,
      isSample: true,
    },
  });

  const logic = await prisma.chapter.upsert({
    where: { subjectId_slug: { subjectId: dm.id, slug: "sample-logic" } },
    update: {},
    create: {
      subjectId: dm.id,
      name: "SAMPLE Logic",
      slug: "sample-logic",
      description: "SAMPLE chapter.",
      displayOrder: 1,
      isSample: true,
    },
  });

  const combinational = await prisma.chapter.upsert({
    where: { subjectId_slug: { subjectId: coa.id, slug: "sample-combinational" } },
    update: {},
    create: {
      subjectId: coa.id,
      name: "SAMPLE Combinational Circuits",
      slug: "sample-combinational",
      description: "SAMPLE chapter.",
      displayOrder: 1,
      isSample: true,
    },
  });

  // Note: upsert on the compound unique with nullable parentTopicId is not
  // supported by Prisma, so use findFirst-or-create for topics.
  let implication = await prisma.topic.findFirst({
    where: { chapterId: logic.id, parentTopicId: null, slug: "sample-implication" },
  });
  if (!implication) {
    implication = await prisma.topic.create({
      data: {
        chapterId: logic.id,
        parentTopicId: null,
        name: "SAMPLE Implication",
        slug: "sample-implication",
        description: "SAMPLE topic.",
        priority: "HIGH",
        displayOrder: 1,
        isSample: true,
      },
    });
  }

  const truthTables = await prisma.topic.findFirst({
    where: { chapterId: logic.id, parentTopicId: implication.id, slug: "sample-truth-tables" },
  });
  if (!truthTables) {
    await prisma.topic.create({
      data: {
        chapterId: logic.id,
        parentTopicId: implication.id,
        name: "SAMPLE Truth tables (subtopic)",
        slug: "sample-truth-tables",
        description: "SAMPLE subtopic.",
        priority: "MEDIUM",
        displayOrder: 1,
        isSample: true,
      },
    });
  }

  await prisma.topicProgress.upsert({
    where: { profileId_topicId: { profileId: profile.id, topicId: implication.id } },
    update: { status: "COMPLETED", completedAt: new Date() },
    create: {
      profileId: profile.id,
      topicId: implication.id,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  const resource = await prisma.resource.upsert({
    where: { id: "sample-resource-1" },
    update: {},
    create: {
      id: "sample-resource-1",
      title: "SAMPLE Logic lecture (placeholder)",
      resourceType: "VIDEO",
      url: "https://example.com/sample-logic",
      description: "SAMPLE resource — replace with curated link.",
      isSample: true,
    },
  });
  await prisma.resourceTopic.upsert({
    where: { topicId_resourceId: { topicId: implication.id, resourceId: resource.id } },
    update: {},
    create: { topicId: implication.id, resourceId: resource.id },
  });

  const q = await prisma.question.upsert({
    where: { id: "sample-question-1" },
    update: {},
    create: {
      id: "sample-question-1",
      sourceType: "PYQ",
      questionType: "MCQ",
      content: "SAMPLE PYQ-shaped placeholder (not a real GATE question).",
      year: 2020,
      marks: 1,
      sourceRef: "SAMPLE",
      verified: false,
      isSample: true,
    },
  });
  await prisma.topicQuestion.upsert({
    where: { topicId_questionId: { topicId: implication.id, questionId: q.id } },
    update: {},
    create: { topicId: implication.id, questionId: q.id },
  });

  const plan = await prisma.studyPlan.create({
    data: {
      startDate: new Date("2026-10-15T00:00:00Z"),
      targetDate: new Date("2027-02-06T00:00:00Z"),
      status: "ACTIVE",
      tasks: {
        create: [
          {
            scheduledDate: new Date("2026-10-15T00:00:00Z"),
            title: "SAMPLE: Learn Implication basics",
            taskType: "LEARNING",
            topicId: implication.id,
            resourceId: resource.id,
            estimatedMinutes: 60,
            status: "PENDING",
            displayOrder: 1,
          },
          {
            scheduledDate: new Date("2026-10-15T00:00:00Z"),
            title: "SAMPLE: Solve implication PYQs",
            taskType: "PYQ",
            topicId: implication.id,
            estimatedMinutes: 45,
            status: "PENDING",
            displayOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.revisionSchedule.create({
    data: {
      topicId: implication.id,
      scheduledDate: new Date("2026-10-22T00:00:00Z"),
      status: "PENDING",
    },
  });

  console.log("Seed OK:", { profile: profile.id, plan: plan.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
