import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    const document = await prisma.uploadedDocument.findUnique({
      where: { id: documentId },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: { questionNumber: "asc" },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({
      document: {
        id: document.id,
        fileName: document.fileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        pageCount: document.pageCount,
        isScanned: document.isScanned,
        status: document.status,
        processingStep: document.processingStep,
        errorMessage: document.errorMessage,
        createdAt: document.createdAt,
      },
      questions: document.questions.map((q) => ({
        id: q.id,
        questionNumber: q.questionNumber,
        language: q.language,
        subject: q.subject,
        topic: q.topic,
        subtopic: q.subtopic,
        difficulty: q.difficulty,
        questionText: q.questionText,
        hasVisualContent: q.hasVisualContent,
        imageUrl: q.imageUrl,
        diagramUrl: q.diagramUrl,
        sourcePage: q.sourcePage,
        sourceAnswer: q.sourceAnswer,
        aiSuggestedAnswer: q.aiSuggestedAnswer,
        explanation: q.explanation,
        requiresReview: q.requiresReview,
        status: q.status,
        confidence: {
          question: q.confidenceQuestion,
          options: q.confidenceOptions,
          classification: q.confidenceClassification,
          answer: q.confidenceAnswer,
        },
        options: q.options.map((opt) => ({
          id: opt.id,
          stableId: opt.stableId,
          label: opt.label,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch document status" },
      { status: 500 }
    );
  }
}
