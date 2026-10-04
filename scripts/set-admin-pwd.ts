import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const hash = hashPassword("Admin@123");
  await prisma.user.update({
    where: { email: "koushalyadavyadav01@gmail.com" },
    data: {
      passwordHash: hash,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });
  console.log("Successfully ensured koushalyadavyadav01@gmail.com has password Admin@123 and role ADMIN");
}

main().catch(console.error).finally(() => prisma.$disconnect());
