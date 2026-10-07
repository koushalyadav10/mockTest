import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const search = searchParams.get("search");

    const whereClause: any = {
      isPublished: true,
    };

    if (subject && subject !== "ALL") {
      whereClause.subject = subject;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { author: { contains: search } },
      ];
    }

    const books = await prisma.book.findMany({
      where: whereClause,
      include: {
        volumes: {
          orderBy: { volumeNumber: "asc" },
        },
        chapters: {
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            volumeId: true,
            totalQuestions: true,
            totalTheoryBlocks: true,
            totalExamples: true,
          },
          orderBy: { chapterNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedBooks = books.map((book: any) => {
      const totalQuestions = book.chapters.reduce((sum: number, ch: any) => sum + (ch.totalQuestions || 0), 0);
      const totalTheory = book.chapters.reduce((sum: number, ch: any) => sum + (ch.totalTheoryBlocks || 0), 0);
      return {
        ...book,
        totalQuestions,
        totalTheory,
        chapterCount: book.chapters.length,
      };
    });

    return NextResponse.json({ success: true, books: formattedBooks });
  } catch (error: any) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch books" }, { status: 500 });
  }
}
