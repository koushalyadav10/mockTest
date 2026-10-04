import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth/password";
import fs from "fs";
import path from "path";

async function main() {
  const adminPassword = "Admin@Secure2026";
  const teacherPassword = "Teacher@Secure2026";

  const adminHash = hashPassword(adminPassword);
  const teacherHash = hashPassword(teacherPassword);

  const accounts = [
    {
      name: "Koushal Yadav (Platform Admin)",
      email: "koushalyadavyadav01@gmail.com",
      role: "ADMIN",
      department: "System Administration & Examination Controller",
      password: adminPassword,
      passwordHash: adminHash,
    },
    {
      name: "ExamForge Head Administrator",
      email: "admin@examforge.ai",
      role: "ADMIN",
      department: "Examination Operations & Assessment Center",
      password: adminPassword,
      passwordHash: adminHash,
    },
    {
      name: "Dr. Raman Verma (Mathematics Faculty)",
      email: "teacher@examforge.ai",
      role: "TEACHER",
      department: "Quantitative Aptitude & Mathematics",
      password: teacherPassword,
      passwordHash: teacherHash,
    },
    {
      name: "Prof. Ananya Sen (Reasoning & GK Faculty)",
      email: "faculty@examforge.ai",
      role: "TEACHER",
      department: "General Intelligence & Reasoning",
      password: teacherPassword,
      passwordHash: teacherHash,
    },
  ];

  for (const acc of accounts) {
    const existing = await prisma.user.findUnique({ where: { email: acc.email } });
    if (existing) {
      await prisma.user.update({
        where: { email: acc.email },
        data: {
          name: acc.name,
          role: acc.role,
          department: acc.department,
          passwordHash: acc.passwordHash,
          status: "ACTIVE",
          isEmailVerified: true,
        },
      });
      console.log(`Updated user: ${acc.email} (${acc.role})`);
    } else {
      await prisma.user.create({
        data: {
          name: acc.name,
          email: acc.email,
          role: acc.role,
          department: acc.department,
          passwordHash: acc.passwordHash,
          status: "ACTIVE",
          isEmailVerified: true,
          studentRollNo: `ADM-${Math.floor(100000 + Math.random() * 900000)}`,
        },
      });
      console.log(`Created user: ${acc.email} (${acc.role})`);
    }
  }

  // Generate CSV
  const csvHeaders = "Role,Name,Email,Password,Department,Login URL,Direct Dashboard URL\n";
  const csvRows = accounts.map((a) => {
    const dashUrl = a.role === "ADMIN" ? "http://15.207.89.195/admin" : "http://15.207.89.195/teacher";
    return `"${a.role}","${a.name}","${a.email}","${a.password}","${a.department}","http://15.207.89.195/login","${dashUrl}"`;
  }).join("\n");

  const csvContent = csvHeaders + csvRows;

  // Save to root
  const rootCsvPath = path.join(process.cwd(), "admin_teacher_credentials.csv");
  fs.writeFileSync(rootCsvPath, csvContent, "utf-8");

  // Save to public folder for direct browser download
  const publicCsvPath = path.join(process.cwd(), "public", "admin_teacher_credentials.csv");
  fs.writeFileSync(publicCsvPath, csvContent, "utf-8");

  console.log(`\n✅ Saved credentials CSV to:`);
  console.log(`- ${rootCsvPath}`);
  console.log(`- ${publicCsvPath} (Downloadable at http://15.207.89.195/admin_teacher_credentials.csv)`);
  console.log(`\nCSV Content:\n${csvContent}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
