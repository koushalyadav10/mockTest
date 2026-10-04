import { prisma } from "../src/lib/db";
import { DocumentProcessingPipeline } from "../src/lib/ai/pipeline";
import fs from "fs";
import path from "path";

async function main() {
  const docId = "bac08bdf-8ecf-4cd7-af0e-2764bd609144";
  const doc = await prisma.uploadedDocument.findUnique({
    where: { id: docId },
  });

  if (!doc) {
    console.log("Document not found in database:", docId);
    return;
  }

  console.log("Found document:", doc.fileName, "id:", doc.id);

  const filePath = path.join(process.cwd(), "public", "uploads", `${doc.id}.pdf`);
  let fileBuffer: Buffer | undefined;
  if (fs.existsSync(filePath)) {
    fileBuffer = fs.readFileSync(filePath);
    console.log("Read file buffer of size:", fileBuffer.length);
  } else {
    console.log("File not found on disk at:", filePath);
  }

  const pipeline = new DocumentProcessingPipeline();
  console.log("Running pipeline for document...");
  const result = await pipeline.runPipeline({
    documentId: doc.id,
    fileBuffer,
    fileName: doc.fileName,
    fileType: doc.fileType,
    onProgress: (step) => {
      console.log(`Step ${step.step}: ${step.title} (${step.status}) - ${step.message || ""}`);
    },
  });

  console.log(`Pipeline completed! Extracted ${result.questions.length} questions.`);
  const savedQuestions = await prisma.question.findMany({
    where: { documentId: doc.id },
    include: { options: true },
  });
  console.log(`Verified DB questions count: ${savedQuestions.length}`);
  for (const q of savedQuestions.slice(0, 3)) {
    console.log(`- Q.${q.questionNumber}: ${q.questionText.slice(0, 60)}... (Answer: ${q.sourceAnswer})`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
