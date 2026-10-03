import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.uploadedDocument.findUnique({
      where: { id: params.id },
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
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        pageCount: document.pageCount,
        isScanned: document.isScanned,
        status: document.status,
        processingStep: document.processingStep,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
        questionCount: document.questions.length,
        questions: document.questions,
      },
    });
  } catch (error: any) {
    console.error("Error fetching document details:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.uploadedDocument.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Get all question IDs for this document
    const docQuestions = await prisma.question.findMany({
      where: { documentId: params.id },
      select: { id: true },
    });
    const qIds = docQuestions.map((q) => q.id);

    if (qIds.length > 0) {
      await prisma.testResponse.deleteMany({
        where: { questionId: { in: qIds } },
      });
      await prisma.questionOption.deleteMany({
        where: { questionId: { in: qIds } },
      });
      await prisma.question.deleteMany({
        where: { documentId: params.id },
      });
    }

    await prisma.uploadedDocument.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: `Document '${document.fileName}' and associated questions deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete document" },
      { status: 500 }
    );
  }
}
