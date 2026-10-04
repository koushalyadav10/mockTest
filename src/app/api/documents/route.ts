import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const documents = await prisma.uploadedDocument.findMany({
      include: {
        questions: {
          select: {
            id: true,
            subject: true,
            topic: true,
            difficulty: true,
            status: true,
            requiresReview: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = documents.map((doc) => {
      const subjectBreakdown: Record<string, number> = {};
      const difficultyBreakdown: Record<string, number> = {};
      let pendingReviewCount = 0;

      doc.questions.forEach((q) => {
        // Subjects
        const subj = q.subject || "General";
        subjectBreakdown[subj] = (subjectBreakdown[subj] || 0) + 1;

        // Difficulty
        const diff = q.difficulty || "MEDIUM";
        difficultyBreakdown[diff] = (difficultyBreakdown[diff] || 0) + 1;

        // Review
        if (q.requiresReview || q.status === "PENDING") {
          pendingReviewCount++;
        }
      });

      return {
        id: doc.id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        fileSize: doc.fileSize,
        pageCount: doc.pageCount,
        isScanned: doc.isScanned,
        status: doc.status,
        processingStep: doc.processingStep,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
        isPublic: doc.isPublic,
        publishedExamId: doc.publishedExamId,
        questionCount: doc.questions.length,
        subjectBreakdown,
        difficultyBreakdown,
        pendingReviewCount,
      };
    });

    return NextResponse.json({
      success: true,
      total: documents.length,
      documents: formatted,
    });
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
