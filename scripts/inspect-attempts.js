const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.testAttempt.count();
  console.log("Total test attempts:", count);

  const attempts = await prisma.testAttempt.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, studentRollNo: true } },
      examConfig: { select: { id: true, title: true, code: true, totalMarks: true } },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  for (const a of attempts) {
    console.log({
      id: a.id,
      candidate: a.user?.name || "Guest",
      email: a.user?.email || "N/A",
      exam: a.examConfig?.title,
      status: a.status,
      score: a.finalScore,
      accuracy: a.accuracy,
      completedAt: a.completedAt,
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
