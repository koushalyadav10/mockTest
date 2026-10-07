import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyJwt(token);
    if (!decoded || (decoded.role !== "ADMIN" && decoded.role !== "TEACHER")) {
      return NextResponse.json({ error: "Forbidden: Admin or Teacher required" }, { status: 403 });
    }

    const books = await prisma.book.findMany({
      include: {
        volumes: {
          orderBy: { volumeNumber: "asc" },
        },
        chapters: {
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            totalQuestions: true,
            totalTheoryBlocks: true,
            totalExamples: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const report = books.map((b: any) => ({
      id: b.id,
      title: b.title,
      code: b.code,
      subject: b.subject,
      author: b.author,
      edition: b.edition,
      totalPages: b.totalPages,
      status: b.status,
      isPublished: b.isPublished,
      volumes: b.volumes.map((v: any) => ({
        id: v.id,
        volumeNumber: v.volumeNumber,
        title: v.title,
        totalPages: v.totalPages,
        status: v.status,
        validationReport: v.validationReport ? JSON.parse(v.validationReport) : null,
      })),
      totalChapters: b.chapters.length,
      totalQuestions: b.chapters.reduce((sum: number, ch: any) => sum + (ch.totalQuestions || 0), 0),
      totalTheory: b.chapters.reduce((sum: number, ch: any) => sum + (ch.totalTheoryBlocks || 0), 0),
      totalExamples: b.chapters.reduce((sum: number, ch: any) => sum + (ch.totalExamples || 0), 0),
      updatedAt: b.updatedAt,
    }));

    return NextResponse.json({ success: true, books: report });
  } catch (error: any) {
    console.error("Admin books fetch error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch admin books" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyJwt(token);
    if (!decoded || (decoded.role !== "ADMIN" && decoded.role !== "TEACHER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { bookId, action, isPublished } = body;

    if (!bookId) {
      return NextResponse.json({ error: "Book ID required" }, { status: 400 });
    }

    if (action === "TOGGLE_PUBLISH") {
      const updated = await prisma.book.update({
        where: { id: bookId },
        data: {
          isPublished: Boolean(isPublished),
          status: isPublished ? "PUBLISHED" : "DRAFT",
        },
      });
      return NextResponse.json({ success: true, book: updated });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin book action error:", error);
    return NextResponse.json({ error: error.message || "Action failed" }, { status: 500 });
  }
}
