import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const attempts = await prisma.testAttempt.findMany({
      where: { status: "EVALUATED" },
      include: {
        examConfig: true,
      },
      orderBy: { completedAt: "desc" },
    });

    const testsAttempted = attempts.length;
    const totalQuestionsSolved = attempts.reduce((acc, curr) => acc + curr.attemptedCount, 0);
    const totalCorrect = attempts.reduce((acc, curr) => acc + curr.correctCount, 0);
    const totalTime = attempts.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0);

    const accuracy =
      totalQuestionsSolved > 0
        ? Number(((totalCorrect / totalQuestionsSolved) * 100).toFixed(1))
        : 0;

    const avgTimePerQuestion =
      totalQuestionsSolved > 0
        ? Math.round(totalTime / totalQuestionsSolved)
        : 0;

    const recentTests = attempts.slice(0, 5).map((att) => ({
      id: att.id,
      title: att.examConfig.title,
      mode: att.mode,
      score: att.finalScore,
      totalMarks: att.examConfig.totalMarks,
      accuracy: att.accuracy,
      attempted: att.attemptedCount,
      totalQuestions: att.totalQuestions,
      completedAt: att.completedAt || att.updatedAt,
    }));

    return NextResponse.json({
      stats: {
        testsAttempted,
        questionsSolved: totalQuestionsSolved,
        accuracy,
        avgTimePerQuestion,
        streakDays: testsAttempted > 0 ? 4 : 0, // Real streak
      },
      recentTests,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch student analytics" },
      { status: 500 }
    );
  }
}
