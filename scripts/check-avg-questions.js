const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const totalQ = await prisma.question.count();
  const avgQ = await prisma.question.count({
    where: {
      OR: [
        { topic: { contains: "Average" } },
        { questionText: { contains: "average" } },
        { questionText: { contains: "औसत" } },
        { sourceFileName: { contains: "Average" } },
      ],
    },
  });
  const sscQ = await prisma.question.count({
    where: {
      OR: [
        { exam: { contains: "SSC" } },
        { tags: { contains: "SSC" } },
      ],
    },
  });

  console.log({ totalQuestions: totalQ, averageQuestions: avgQ, sscQuestions: sscQ });

  const configs = await prisma.examConfig.findMany({
    select: { id: true, title: true, totalQuestions: true, status: true },
  });
  console.log("Exam Configs count:", configs.length);
  for (const c of configs) {
    console.log(`- ${c.title} (${c.totalQuestions}Q) [${c.status}] [ID: ${c.id}]`);
  }

  // Sample Average questions
  const sampleAvg = await prisma.question.findMany({
    where: {
      OR: [
        { topic: { contains: "Average" } },
        { sourceFileName: { contains: "Average" } },
      ],
    },
    include: { options: true },
    take: 3,
  });
  console.log("\nSample Average Questions:", JSON.stringify(sampleAvg, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
