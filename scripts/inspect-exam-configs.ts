import { prisma } from "../src/lib/db";

async function main() {
  const configs = await prisma.examConfig.findMany({
    include: {
      sections: true,
      testAttempts: {
        include: { user: true },
      },
    },
  });

  console.log(`Total ExamConfigs: ${configs.length}`);
  for (const c of configs) {
    console.log(`- Config [${c.id}]: "${c.title}" | isPublic: ${c.isPublic} | Questions: ${c.totalQuestions} | Attempts: ${c.testAttempts?.length || 0}`);
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isVerified: true },
  });
  console.log("\nUsers in database:");
  for (const u of users) {
    console.log(`- [${u.role}] ${u.name} <${u.email}> (Verified: ${u.isVerified})`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
