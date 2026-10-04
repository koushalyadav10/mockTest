import { prisma } from "../src/lib/db";

async function main() {
  const doc = await prisma.uploadedDocument.findUnique({
    where: { id: "bac08bdf-8ecf-4cd7-af0e-2764bd609144" },
    include: { questions: true },
  });

  if (!doc) {
    console.log("Document not found");
    return;
  }

  console.log(`Document: ${doc.fileName}, questions: ${doc.questions.length}`);

  let examConfig = await prisma.examConfig.findFirst({
    where: { documentId: doc.id },
  });

  if (examConfig) {
    examConfig = await prisma.examConfig.update({
      where: { id: examConfig.id },
      data: {
        title: "SSC CHSL / CGL - Chapter 11: Average (Aditya Ranjan)",
        description: "Official All-India Mock Test from uploaded SSC Average chapter",
        status: "PUBLISHED",
        scheduledStatus: "LIVE",
        totalQuestions: doc.questions.length,
        totalMarks: doc.questions.length * 2.0,
        totalDurationMinutes: 25,
      },
    });
  } else {
    examConfig = await prisma.examConfig.create({
      data: {
        code: `SSC_AVG_${doc.id.slice(0, 8).toUpperCase()}`,
        title: "SSC CHSL / CGL - Chapter 11: Average (Aditya Ranjan)",
        description: "Official All-India Mock Test from uploaded SSC Average chapter",
        category: "SSC",
        mode: "PRACTICE",
        totalQuestions: doc.questions.length,
        totalMarks: doc.questions.length * 2.0,
        totalDurationMinutes: 25,
        marksPerCorrect: 2.0,
        negativeMarks: 0.5,
        status: "PUBLISHED",
        scheduledStatus: "LIVE",
        documentId: doc.id,
        sections: {
          create: [
            {
              name: "Quantitative Aptitude (Average)",
              order: 1,
              questionCount: doc.questions.length,
              marksPerCorrect: 2.0,
              negativeMarks: 0.5,
            },
          ],
        },
      },
    });
  }

  await prisma.uploadedDocument.update({
    where: { id: doc.id },
    data: {
      isPublic: true,
      publishedExamId: examConfig.id,
      status: "COMPLETED",
    },
  });

  console.log(`ExamConfig created/updated with ID: ${examConfig.id}`);
  console.log(`Title: ${examConfig.title}`);
}

main().finally(() => prisma.$disconnect());
