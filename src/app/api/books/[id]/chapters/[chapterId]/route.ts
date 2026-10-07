import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const { id: bookId, chapterId } = params;

    // Optional user authentication
    let userId: string | null = null;
    const token = cookies().get("auth-token")?.value;
    if (token) {
      try {
        const decoded = verifyJwt(token);
        if (decoded?.userId) userId = decoded.userId;
      } catch (e) {}
    }

    // 1. Fetch Chapter Metadata & Hierarchy
    const chapter = await prisma.bookChapter.findUnique({
      where: { id: chapterId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            code: true,
            subject: true,
          },
        },
        volume: {
          select: {
            id: true,
            volumeNumber: true,
            title: true,
          },
        },
        studyContents: {
          orderBy: { orderIndex: "asc" },
        },
        questions: {
          include: {
            options: {
              orderBy: { label: "asc" },
            },
          },
          orderBy: { questionNumber: "asc" },
        },
        userProgress: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // 2. Classify Study Contents into Tabs
    const theoryItems = chapter.studyContents.filter(
      (c: any) => ["THEORY", "RULE", "EXCEPTION", "FACT", "TABLE", "VOCABULARY"].includes(c.contentType)
    );

    const exampleItems = chapter.studyContents.filter(
      (c: any) => ["EXAMPLE", "SOLVED_EXAMPLE"].includes(c.contentType)
    );

    const revisionNotes = chapter.studyContents.filter(
      (c: any) => ["REVISION_NOTE", "FACT", "RULE"].includes(c.contentType)
    );

    // 3. Classify Questions
    const pyqs = chapter.questions.filter(
      (q: any) => q.generationType === "PYQ" || Boolean(q.year) || q.tags?.includes("Shift")
    );

    // 4. Fetch User Mistake Ledger if authenticated
    let userMistakes: any[] = [];
    if (userId) {
      const wrongResponses = await prisma.testResponse.findMany({
        where: {
          testAttempt: { userId },
          question: { chapterId },
          isCorrect: false,
        },
        include: {
          question: {
            include: {
              options: true,
            },
          },
        },
        take: 30,
        orderBy: { createdAt: "desc" },
      });

      // Deduplicate by questionId
      const seen = new Set<string>();
      userMistakes = wrongResponses
        .filter((r: any) => {
          if (seen.has(r.questionId)) return false;
          seen.add(r.questionId);
          return true;
        })
        .map((r: any) => r.question);
    }

    // Format progress
    const progress = chapter.userProgress?.[0] || {
      theoryCompleted: false,
      examplesStudied: 0,
      questionsAttempted: 0,
      questionsCorrect: 0,
      accuracyPercent: 0,
      weakTopics: "[]",
    };

    return NextResponse.json({
      success: true,
      chapter: {
        id: chapter.id,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        summary: chapter.summary,
        startPage: chapter.startPage,
        endPage: chapter.endPage,
        book: chapter.book,
        volume: chapter.volume,
        counts: {
          theory: theoryItems.length,
          examples: exampleItems.length,
          questions: chapter.questions.length,
          pyqs: pyqs.length,
          mistakes: userMistakes.length,
        },
      },
      learn: theoryItems,
      examples: exampleItems,
      questions: chapter.questions,
      pyqs: pyqs.length > 0 ? pyqs : chapter.questions.slice(0, 15),
      revision: revisionNotes,
      myMistakes: userMistakes,
      progress,
    });
  } catch (error: any) {
    console.error("Error fetching chapter details:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch chapter" }, { status: 500 });
  }
}
