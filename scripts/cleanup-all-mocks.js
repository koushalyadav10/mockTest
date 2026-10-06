const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupAllMocks() {
  console.log("Starting full mock & test database cleanup...");

  // 1. Delete test responses & violations
  const delResponses = await prisma.testResponse.deleteMany({});
  console.log(`Deleted ${delResponses.count} test responses.`);

  const delViolations = await prisma.attemptViolation.deleteMany({});
  console.log(`Deleted ${delViolations.count} attempt violations.`);

  // 2. Delete test attempts
  const delAttempts = await prisma.testAttempt.deleteMany({});
  console.log(`Deleted ${delAttempts.count} test attempts.`);

  // 3. Delete exam sections & exam configs
  const delSections = await prisma.examSectionConfig.deleteMany({});
  console.log(`Deleted ${delSections.count} exam sections.`);

  const delExams = await prisma.examConfig.deleteMany({});
  console.log(`Deleted ${delExams.count} exam configs.`);

  // 4. Delete questions & options
  const delOptions = await prisma.questionOption.deleteMany({});
  console.log(`Deleted ${delOptions.count} question options.`);

  const delQuestions = await prisma.question.deleteMany({});
  console.log(`Deleted ${delQuestions.count} questions.`);

  // 5. Delete uploaded documents
  const delDocs = await prisma.uploadedDocument.deleteMany({});
  console.log(`Deleted ${delDocs.count} uploaded documents.`);

  // Verify users are safe
  const userCount = await prisma.user.count();
  console.log(`Users preserved: ${userCount} users intact.`);

  console.log("Full cleanup completed successfully! Database is clean and ready for new PDF topic-wise tests.");
}

cleanupAllMocks()
  .catch((e) => {
    console.error("Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
