import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookId,
      volumeId,
      volumeMode = "COMBINED",
      chapterIds = [],
      questionCount = 20,
      difficulty = "ALL",
      sourceFilter = "ALL",
      mode = "PRACTICE", // PRACTICE or MOCK (timed CBT)
      rangeFrom,
      rangeTo,
    } = body;

    // Optional user authentication
    let userId: string | null = null;
    let studentRollNo = `EF-${Date.now().toString().slice(-6)}`;
    const token = cookies().get("auth-token")?.value;
    if (token) {
      try {
        const decoded = verifyJwt(token);
        if (decoded?.userId) {
          userId = decoded.userId;
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user?.studentRollNo) studentRollNo = user.studentRollNo;
        }
      } catch (e) {}
    }

    // 1. Build Query Conditions
    const whereClause: any = {};

    if (chapterIds.length > 0) {
      whereClause.chapterId = { in: chapterIds };
    } else if (volumeId) {
      whereClause.volumeId = volumeId;
    } else if (bookId) {
      whereClause.bookId = bookId;
    }

    if (difficulty && difficulty !== "ALL") {
      whereClause.difficulty = difficulty;
    }

    if (sourceFilter === "PYQ") {
      whereClause.OR = [
        { generationType: "PYQ" },
        { tags: { contains: "Shift" } },
        { year: { not: null } },
      ];
    } else if (sourceFilter === "AI_GENERATED") {
      whereClause.generationType = "AI_GENERATED";
    }

    // 2. Fetch Available Questions
    let availableQuestions = await prisma.question.findMany({
      where: whereClause,
      include: {
        options: true,
        chapter: {
          select: { title: true, chapterNumber: true },
        },
      },
      orderBy: { questionNumber: "asc" },
    });

    // If custom range specified
    if (rangeFrom && rangeTo && rangeFrom >= 1 && rangeTo >= rangeFrom) {
      const fromIdx = Math.max(0, Number(rangeFrom) - 1);
      const toIdx = Math.min(availableQuestions.length, Number(rangeTo));
      availableQuestions = availableQuestions.slice(fromIdx, toIdx);
    }

    if (availableQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions match the selected criteria for this book / chapter selection." },
        { status: 400 }
      );
    }

    // Shuffle and pick target count
    const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
    const countToPick = Math.min(shuffled.length, Math.max(1, parseInt(String(questionCount), 10) || 20));
    const selectedQuestions = shuffled.slice(0, countToPick);

    // 3. Resolve Book & Chapter metadata for Exam title
    let bookTitle = "Chapter Practice";
    if (bookId) {
      const b = await prisma.book.findUnique({ where: { id: bookId } });
      if (b) bookTitle = b.title;
    }

    let chapterLabel = "Custom Selection";
    if (chapterIds.length === 1) {
      const ch = await prisma.bookChapter.findUnique({ where: { id: chapterIds[0] } });
      if (ch) chapterLabel = `Ch ${ch.chapterNumber}: ${ch.title}`;
    } else if (chapterIds.length > 1) {
      chapterLabel = `${chapterIds.length} Chapters Combined`;
    }

    const examTitle = `[Book Practice] ${bookTitle} — ${chapterLabel} (${selectedQuestions.length} Qs)`;
    const examCode = `PRACTICE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 4. Create Ephemeral ExamConfig for CBT Session
    const examConfig = await prisma.examConfig.create({
      data: {
        code: examCode,
        title: examTitle,
        category: "CUSTOM",
        mode: mode === "PRACTICE" ? "PRACTICE" : "TIER_1",
        totalQuestions: selectedQuestions.length,
        totalMarks: selectedQuestions.length * 2.0,
        totalDurationMinutes: Math.max(10, Math.ceil(selectedQuestions.length * 1.2)),
        marksPerCorrect: 2.0,
        negativeMarks: 0.5,
        sectionalTiming: false,
        sectionLock: false,
        allowBackNavigation: true,
        questionShuffle: true,
        optionShuffle: false,
        availability: "ALWAYS",
        status: "PUBLISHED",
        instructions: JSON.stringify({
          mode,
          instantFeedback: mode === "PRACTICE",
          bookId,
          chapterIds,
          questionCount: selectedQuestions.length,
        }),
      },
    });

    // 5. Create TestAttempt with Linked Questions
    const testAttempt = await prisma.testAttempt.create({
      data: {
        userId,
        studentRollNo,
        examConfigId: examConfig.id,
        status: "RUNNING",
        mode: mode === "PRACTICE" ? "PRACTICE" : "MOCK",
        totalQuestions: selectedQuestions.length,
        startedAt: new Date(),
      },
    });

    // 6. Create TestResponse rows for each question
    await prisma.testResponse.createMany({
      data: selectedQuestions.map((q, idx) => ({
        testAttemptId: testAttempt.id,
        questionId: q.id,
        orderIndex: idx + 1,
        responseState: "NOT_VISITED",
        timeSpentSeconds: 0,
      })),
    });

    return NextResponse.json({
      success: true,
      testAttemptId: testAttempt.id,
      examId: examConfig.id,
      questionCount: selectedQuestions.length,
      mode,
    });
  } catch (error: any) {
    console.error("Error generating book practice test:", error);
    return NextResponse.json({ error: error.message || "Failed to generate test" }, { status: 500 });
  }
}
