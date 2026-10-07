import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

async function main() {
  console.log("=== PUBLISHING ALL GK & ENGLISH BOOK CHAPTERS AS EXAM TESTS ===");

  const chapters = await prisma.bookChapter.findMany({
    include: {
      book: true,
      volume: true,
      questions: {
        select: { id: true },
      },
    },
    orderBy: [{ bookId: "asc" }, { volumeId: "asc" }, { chapterNumber: "asc" }],
  });

  console.log(`Found ${chapters.length} book chapters to process.`);

  let gkCreated = 0;
  let engCreated = 0;

  for (const ch of chapters) {
    const qCount = ch.questions.length;
    if (qCount === 0) continue;

    const isGK =
      ch.book.subject.toLowerCase().includes("general") ||
      ch.book.subject.toLowerCase().includes("gk");

    const category = isGK ? "GK_GS" : "ENGLISH";
    const volNum = ch.volume?.volumeNumber || 1;
    const chNum = ch.chapterNumber;
    const chSlug = slugify(ch.title).slice(0, 30);

    let examCode = "";
    let examTitle = "";

    if (isGK) {
      examCode = `SSC_GK_CH_${String(chNum).padStart(2, "0")}_${chSlug}`;
      examTitle = `Static GK (Brahmastra) — Chapter ${chNum}: ${ch.title}`;
    } else {
      examCode = `SSC_ENG_V${volNum}_CH_${String(chNum).padStart(2, "0")}_${chSlug}`;
      const volLabel = volNum === 1 ? "Vol 1" : "Vol 2";
      examTitle = `English (Neetu Singh ${volLabel}) — Chapter ${chNum}: ${ch.title}`;
    }

    // Check if ExamConfig already exists
    let existingExam = await prisma.examConfig.findUnique({
      where: { code: examCode },
    });

    let docId = existingExam?.documentId;

    if (!docId) {
      // Create UploadedDocument
      const doc = await prisma.uploadedDocument.create({
        data: {
          fileName: `${examCode}.pdf`,
          fileType: "application/pdf",
          fileSize: 1024,
          isPublic: true,
          status: "COMPLETED",
          pageCount: (ch.endPage && ch.startPage) ? Math.max(1, ch.endPage - ch.startPage + 1) : 10,
          rawText: ch.title,
        },
      });
      docId = doc.id;
    }

    const durationMinutes = Math.max(15, Math.ceil(qCount * 1.0));

    if (!existingExam) {
      existingExam = await prisma.examConfig.create({
        data: {
          code: examCode,
          title: examTitle,
          description: `Chapterwise test for ${ch.title} from ${ch.book.title}. Total ${qCount} authentic questions.`,
          category,
          mode: "PRACTICE",
          totalQuestions: qCount,
          totalMarks: qCount * 2.0,
          totalDurationMinutes: durationMinutes,
          marksPerCorrect: 2.0,
          negativeMarks: 0.50,
          sectionalTiming: false,
          sectionLock: false,
          allowBackNavigation: true,
          navigationRules: "FREE",
          questionShuffle: false,
          optionShuffle: false,
          allowedQuestionTypes: "MCQ",
          difficulty: "MEDIUM",
          languages: "en,hi",
          availability: "ALWAYS",
          scheduledStatus: "LIVE",
          status: "PUBLISHED",
          documentId: docId,
          instructions: JSON.stringify({
            subject: category,
            chapterId: ch.id,
            bookId: ch.bookId,
            instantFeedback: true,
            mode: "PRACTICE",
          }),
        },
      });

      // Create Section
      await prisma.examSectionConfig.create({
        data: {
          examConfigId: existingExam.id,
          name: ch.title,
          order: 1,
          questionCount: qCount,
          durationMinutes,
          marksPerCorrect: 2.0,
          negativeMarks: 0.50,
          allowBackNavigation: true,
        },
      });

      // Update doc publishedExamId
      await prisma.uploadedDocument.update({
        where: { id: docId },
        data: { publishedExamId: existingExam.id },
      });
    }

    // Link questions to this documentId
    await prisma.question.updateMany({
      where: { chapterId: ch.id },
      data: { documentId: docId },
    });

    if (isGK) gkCreated++;
    else engCreated++;
  }

  console.log(`\nCOMPLETED:`);
  console.log(`- Created/Updated GK Exams: ${gkCreated}`);
  console.log(`- Created/Updated English Exams: ${engCreated}`);
  console.log(`- Total Exams now available in /exams!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
