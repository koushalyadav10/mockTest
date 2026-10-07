import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    // 1. Search in Book Chapters
    const matchingChapters = await prisma.bookChapter.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { summary: { contains: query } },
        ],
      },
      include: {
        book: {
          select: { id: true, title: true, subject: true },
        },
        volume: {
          select: { id: true, volumeNumber: true, title: true },
        },
      },
      take: 8,
    });

    // 2. Search in Study Content (Theory & Rules)
    const matchingTheory = await prisma.studyContent.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      },
      include: {
        chapter: {
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            bookId: true,
            book: { select: { title: true, subject: true } },
          },
        },
      },
      take: 10,
    });

    // 3. Search in Questions
    const matchingQuestions = await prisma.question.findMany({
      where: {
        bookId: { not: null },
        OR: [
          { questionText: { contains: query } },
          { explanation: { contains: query } },
          { sourceConcept: { contains: query } },
        ],
      },
      include: {
        chapter: {
          select: { id: true, title: true, chapterNumber: true, bookId: true },
        },
      },
      take: 8,
    });

    return NextResponse.json({
      success: true,
      results: {
        chapters: matchingChapters,
        theory: matchingTheory.map((t: any) => ({
          id: t.id,
          title: t.title,
          contentType: t.contentType,
          snippet: t.content.slice(0, 160).replace(/\n/g, " ") + "...",
          chapterId: t.chapterId,
          chapterTitle: t.chapter.title,
          bookId: t.chapter.bookId,
          bookTitle: t.chapter.book.title,
          sourcePage: t.sourcePage,
        })),
        questions: matchingQuestions.map((q: any) => ({
          id: q.id,
          questionNumber: q.questionNumber,
          snippet: q.questionText.slice(0, 160).replace(/\n/g, " ") + "...",
          chapterId: q.chapterId,
          chapterTitle: q.chapter?.title,
          bookId: q.bookId,
          sourcePage: q.sourcePage,
        })),
      },
    });
  } catch (error: any) {
    console.error("Error performing book search:", error);
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
