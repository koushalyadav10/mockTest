import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const documentId = params.id;
    const document = await prisma.uploadedDocument.findUnique({
      where: { id: documentId },
      include: {
        questions: {
          include: { options: true },
          orderBy: { questionNumber: "asc" },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    if (document.questions.length === 0) {
      return NextResponse.json(
        { error: "Cannot publish a paper with 0 extracted questions. Please process or add questions first." },
        { status: 400 }
      );
    }

    // Determine clean exam title
    const cleanTitle = document.fileName
      .replace(/\.(pdf|txt|png|jpe?g)$/i, "")
      .replace(/[_]/g, " ");

    const totalQuestions = document.questions.length;
    const totalMarks = totalQuestions * 2.0;
    const totalDurationMinutes = Math.max(15, Math.ceil(totalQuestions * 1.2)); // ~1.2 min per question

    // Check if exam config already exists for this document
    let examConfig = document.publishedExamId
      ? await prisma.examConfig.findUnique({ where: { id: document.publishedExamId } })
      : await prisma.examConfig.findFirst({ where: { documentId: document.id } });

    if (examConfig) {
      examConfig = await prisma.examConfig.update({
        where: { id: examConfig.id },
        data: {
          title: cleanTitle,
          status: "PUBLISHED",
          scheduledStatus: "LIVE",
          totalQuestions,
          totalMarks,
          totalDurationMinutes,
          documentId: document.id,
        },
      });
    } else {
      examConfig = await prisma.examConfig.create({
        data: {
          code: `PUB_DOC_${document.id.slice(0, 8).toUpperCase()}`,
          title: cleanTitle,
          description: `Official All-India CBT Mock Test extracted from ${document.fileName}`,
          category: "SSC",
          mode: "TIER_1",
          totalQuestions,
          totalMarks,
          totalDurationMinutes,
          marksPerCorrect: 2.0,
          negativeMarks: 0.5,
          status: "PUBLISHED",
          scheduledStatus: "LIVE",
          documentId: document.id,
          questionShuffle: false,
          optionShuffle: false,
          sections: {
            create: [
              {
                name: "Official Section",
                order: 1,
                questionCount: totalQuestions,
                marksPerCorrect: 2.0,
                negativeMarks: 0.5,
              },
            ],
          },
        },
      });
    }

    // Mark document as public
    await prisma.uploadedDocument.update({
      where: { id: document.id },
      data: {
        isPublic: true,
        publishedExamId: examConfig.id,
      },
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "TEST_PUBLISHED",
        entity: "ExamConfig",
        entityId: examConfig.id,
        details: `Published document '${document.fileName}' as public test with ${totalQuestions} questions`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Paper published successfully! Candidates and teachers can now take this examination.`,
      exam: examConfig,
    });
  } catch (error: any) {
    console.error("Publish document error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to publish document as public test" },
      { status: 500 }
    );
  }
}

// Unpublish / Make Private
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const documentId = params.id;
    const document = await prisma.uploadedDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    if (document.publishedExamId) {
      await prisma.examConfig.update({
        where: { id: document.publishedExamId },
        data: {
          status: "DRAFT",
          scheduledStatus: "UPCOMING",
        },
      }).catch(() => {});
    }

    await prisma.uploadedDocument.update({
      where: { id: documentId },
      data: { isPublic: false },
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "TEST_UNPUBLISHED",
        entity: "UploadedDocument",
        entityId: document.id,
        details: `Unpublished paper '${document.fileName}'. Set back to private draft.`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Paper unpublished. Candidates can no longer access this mock test.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to unpublish paper" },
      { status: 500 }
    );
  }
}
