import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { safelyShuffleOptions } from "@/lib/exam/shuffling";
import {
  filterQuestionIdsByMode,
  SpecializedPracticeMode,
} from "@/lib/exam/specialized-practice";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mode, // "MISTAKES" | "MARKED" | "UNATTEMPTED"
      attemptId, // Optional: filter from specific previous attempt
    } = body;

    if (!mode || !["MISTAKES", "MARKED", "UNATTEMPTED"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Must be MISTAKES, MARKED, or UNATTEMPTED" },
        { status: 400 }
      );
    }

    // Get active user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "student@examforge.ai",
          name: "Aditya Sharma",
          passwordHash: "mock_hash",
        },
      });
    }

    // Query historical responses for this user (or specifically for attemptId)
    const responseQueryWhere: any = {};
    if (attemptId) {
      responseQueryWhere.testAttemptId = attemptId;
    } else if (user) {
      responseQueryWhere.testAttempt = { userId: user.id };
    }

    const previousResponses = await prisma.testResponse.findMany({
      where: responseQueryWhere,
      select: {
        questionId: true,
        selectedOptionStableId: true,
        isCorrect: true,
        responseState: true,
      },
    });

    const targetQuestionIds = filterQuestionIdsByMode(
      mode as SpecializedPracticeMode,
      previousResponses
    );

    if (targetQuestionIds.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No questions found matching ${mode} practice mode criteria. Complete a mock test first or flag questions!`,
        count: 0,
      });
    }

    // Fetch questions with options
    const questions = await prisma.question.findMany({
      where: {
        id: { in: targetQuestionIds },
        status: "APPROVED",
      },
      include: {
        options: true,
      },
    });

    if (questions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "None of the target practice questions are currently approved in question bank.",
        count: 0,
      });
    }

    // Find or create Practice Exam Configuration
    let practiceConfig = await prisma.examConfig.findFirst({
      where: { code: "CUSTOM_PRACTICE_MODE" },
    });

    if (!practiceConfig) {
      practiceConfig = await prisma.examConfig.create({
        data: {
          code: "CUSTOM_PRACTICE_MODE",
          title: "Specialized Targeted Practice Mode",
          category: "CUSTOM",
          mode: "PRACTICE",
          totalQuestions: questions.length,
          totalMarks: questions.length * 2,
          totalDurationMinutes: Math.max(15, Math.ceil((questions.length * 1.5))),
          marksPerCorrect: 2.0,
          negativeMarks: 0.5,
          questionShuffle: true,
          optionShuffle: true,
          allowedQuestionTypes: "MCQ",
        },
      });
    }

    // Create Test Attempt in PRACTICE mode
    const practiceAttempt = await prisma.testAttempt.create({
      data: {
        userId: user.id,
        examConfigId: practiceConfig.id,
        status: "NOT_STARTED",
        mode: "PRACTICE",
        totalQuestions: questions.length,
        questionOrderJson: JSON.stringify(questions.map((q) => q.id)),
      },
    });

    // Create Test Response records
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const shuffledOptions = safelyShuffleOptions(
        q.options.map((opt) => ({
          stableId: opt.stableId,
          label: opt.label,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        true
      );

      const effectiveCorrectLabel = q.verifiedAnswer || q.sourceAnswer || q.aiSuggestedAnswer;
      let correctOpt = effectiveCorrectLabel
        ? q.options.find((o) => o.label.trim().toUpperCase() === effectiveCorrectLabel.trim().toUpperCase())
        : null;
      if (!correctOpt) {
        correctOpt = q.options.find((o) => o.isCorrect) || null;
      }

      await prisma.testResponse.create({
        data: {
          testAttemptId: practiceAttempt.id,
          questionId: q.id,
          correctOptionStableId: correctOpt?.stableId || null,
          responseState: "NOT_VISITED",
          orderIndex: i + 1,
          shuffledOptionsJson: JSON.stringify(shuffledOptions),
          responseVersion: 1,
          syncStatus: "SYNCED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      testAttemptId: practiceAttempt.id,
      count: questions.length,
      mode: "PRACTICE",
      subMode: mode,
    });
  } catch (error: any) {
    console.error("Specialized practice creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create specialized practice session" },
      { status: 500 }
    );
  }
}
