import { prisma } from "../src/lib/db";

async function main() {
  const junkConfigs = await prisma.examConfig.findMany({
    where: {
      OR: [
        { title: { contains: "UPSI Hindi Special Practice Mock 01" } },
        { totalQuestions: { lte: 1 } },
      ],
    },
  });

  console.log(`Found ${junkConfigs.length} junk/duplicate test configs.`);
  for (const c of junkConfigs) {
    // Delete test attempts for this junk config first
    await prisma.testAttempt.deleteMany({
      where: { examConfigId: c.id },
    });
    // Delete sections for this junk config
    await prisma.examSectionConfig.deleteMany({
      where: { examConfigId: c.id },
    });
    // Delete the config itself
    await prisma.examConfig.delete({
      where: { id: c.id },
    });
    console.log(`Deleted junk config: ${c.id} (${c.title})`);
  }

  const remaining = await prisma.examConfig.findMany({
    select: { id: true, code: true, title: true, totalQuestions: true },
  });
  console.log(`\nRemaining clean configs (${remaining.length}):`);
  for (const r of remaining) {
    console.log(`- [${r.code}] "${r.title}" (${r.totalQuestions} Questions)`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
