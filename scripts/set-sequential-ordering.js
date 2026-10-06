const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Configuring sequential ordering for all document/chapter exams...");

  // 1. Update SSC Average and Koushal mock to questionShuffle: false, optionShuffle: false
  const updated = await prisma.examConfig.updateMany({
    where: {
      OR: [
        { documentId: { not: null } },
        { title: { contains: "Average" } },
        { title: { contains: "Koushal" } },
      ],
    },
    data: {
      questionShuffle: false,
      optionShuffle: false,
    },
  });
  console.log(`Updated ${updated.count} exam configs to sequential question order (no shuffle).`);

  // Verify settings
  const configs = await prisma.examConfig.findMany({
    select: { id: true, title: true, questionShuffle: true, optionShuffle: true, documentId: true },
  });
  for (const c of configs) {
    console.log(`- ${c.title} -> questionShuffle: ${c.questionShuffle}, optionShuffle: ${c.optionShuffle}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
