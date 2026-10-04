import { prisma } from "../src/lib/db";
import { DocumentProcessingPipeline } from "../src/lib/ai/pipeline";
import fs from "fs";
import path from "path";

async function main() {
  const doc = await prisma.uploadedDocument.findFirst({
    where: {
      OR: [
        { id: "2c8feba3-8ea4-4336-981d-86403913ed4d" },
        { fileName: { contains: "PIPe" } },
        { fileName: { contains: "pipe" } },
      ],
    },
  });

  if (!doc) {
    console.error("Document PIPe.pdf not found in DB!");
    return;
  }

  console.log(`Found PIPe.pdf document with ID: ${doc.id}`);

  // Delete old questions linked to this document
  const deletedOld = await prisma.question.deleteMany({
    where: { documentId: doc.id },
  });
  console.log(`Deleted ${deletedOld.count} old questions from document.`);

  // Read the file buffer
  const filePath = path.join(process.cwd(), "public", "uploads", `${doc.id}.pdf`);
  const fileBuffer = fs.existsSync(filePath) ? fs.readFileSync(filePath) : undefined;

  // Run the pipeline (which extracts 88 questions and automatically saves to DB in Step 15)
  const pipeline = new DocumentProcessingPipeline();
  const extraction = await pipeline.runPipeline({
    documentId: doc.id,
    fileName: doc.fileName,
    fileType: doc.fileType,
    fileBuffer,
  });

  console.log(`Pipeline successfully extracted and saved ${extraction.questions.length} questions from ${doc.fileName}!`);

  // Count questions in DB
  const dbQuestionCount = await prisma.question.count({
    where: { documentId: doc.id },
  });
  console.log(`Total questions in database for document ${doc.id}: ${dbQuestionCount}`);

  // Update uploaded document record
  await prisma.uploadedDocument.update({
    where: { id: doc.id },
    data: {
      status: "COMPLETED",
      processingStep: "STEP 15: Storage and persistence - COMPLETED",
      isPublic: true,
    },
  });

  // Create / Update the Exam for Chapter 13: Pipe & Cistern
  const examCode = `SSC_PIPE_${doc.id.slice(0, 8).toUpperCase()}`;
  const existingExam = await prisma.examConfig.findFirst({
    where: {
      OR: [
        { code: examCode },
        { documentId: doc.id },
      ],
    },
  });

  const examData = {
    code: examCode,
    title: "SSC CGL / CPO / CHSL - Chapter 13: Pipe & Cistern (Aditya Ranjan)",
    description: "Official All-India CBT Mock Test: 88 authentic bilingual questions from Chapter 13 Pipe & Cistern with complete TCS solutions",
    category: "SSC",
    mode: "EXAM",
    totalQuestions: dbQuestionCount,
    totalMarks: dbQuestionCount * 2,
    totalDurationMinutes: 90,
    marksPerCorrect: 2.0,
    negativeMarks: 0.5,
    sectionalTiming: false,
    sectionLock: false,
    allowBackNavigation: true,
    navigationRules: "FREE",
    questionShuffle: true,
    optionShuffle: true,
    difficulty: "MEDIUM",
    languages: "en,hi",
    instructions: "Each question carries 2 marks. Deduction of 0.5 marks for each incorrect response.",
    availability: "ALWAYS",
    status: "PUBLISHED",
    documentId: doc.id,
  };

  let examId = "";
  if (existingExam) {
    const updated = await prisma.examConfig.update({
      where: { id: existingExam.id },
      data: examData,
    });
    examId = updated.id;
    console.log(`Updated existing exam config ${examId}`);
  } else {
    const created = await prisma.examConfig.create({
      data: {
        ...examData,
        sections: {
          create: [
            {
              name: "Quantitative Aptitude (Pipe & Cistern)",
              order: 1,
              questionCount: dbQuestionCount,
              marksPerCorrect: 2.0,
              negativeMarks: 0.5,
              allowBackNavigation: true,
            },
          ],
        },
      },
    });
    examId = created.id;
    console.log(`Created new exam config ${examId}`);
  }

  // Link publishedExamId to uploaded document
  await prisma.uploadedDocument.update({
    where: { id: doc.id },
    data: { publishedExamId: examId },
  });

  console.log(`✅ All 88 Questions from PIPe.pdf successfully processed and published as Exam ${examId}!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
