import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { formatCleanChapterTitle } from "@/lib/exam/tag-parser";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionUser(req);

    if (!session?.userId) {
      return NextResponse.json({
        stats: {
          testsAttempted: 0,
          completedTests: 0,
          questionsSolved: 0,
          accuracy: 0,
          avgTimePerQuestion: 0,
          streakDays: 0,
          bestScore: 0,
        },
        recentTests: [],
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, role: true, email: true, name: true },
    });
    const isAdminOrTeacher = user?.role === "ADMIN" || user?.role === "TEACHER";

    if (isAdminOrTeacher) {
      const allExams = await prisma.examConfig.findMany({
        include: {
          testAttempts: {
            include: {
              user: {
                select: { id: true, name: true, email: true, studentRollNo: true },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const allAttempts = allExams.flatMap((e) => e.testAttempts);
      const uniqueCandidates = new Set(allAttempts.map((a) => a.userId).filter(Boolean)).size;

      const evaluatedAttempts = allAttempts.filter((a) => a.status === "EVALUATED");
      const totalScore = evaluatedAttempts.reduce((acc, curr) => acc + curr.finalScore, 0);
      const overallAverageScore =
        evaluatedAttempts.length > 0
          ? Number((totalScore / evaluatedAttempts.length).toFixed(1))
          : 0;

      const examAnalytics = allExams.map((exam) => {
        const attempts = exam.testAttempts;
        const evaluated = attempts.filter((a) => a.status === "EVALUATED");
        const inProgress = attempts.filter(
          (a) => a.status === "RUNNING" || a.status === "NOT_STARTED" || a.status === "SUBMITTED"
        );
        const topScore =
          evaluated.length > 0 ? Math.max(...evaluated.map((a) => a.finalScore)) : null;
        const avgScore =
          evaluated.length > 0
            ? Number(
                (
                  evaluated.reduce((acc, curr) => acc + curr.finalScore, 0) / evaluated.length
                ).toFixed(1)
              )
            : null;

        return {
          id: exam.id,
          title: formatCleanChapterTitle(exam.title),
          category: exam.category,
          mode: exam.mode,
          status: exam.status,
          totalQuestions: exam.totalQuestions,
          totalMarks: exam.totalMarks,
          totalDurationMinutes: exam.totalDurationMinutes,
          candidateCount: attempts.length,
          evaluatedCount: evaluated.length,
          inProgressCount: inProgress.length,
          avgScore,
          topScore,
          lastAttemptedAt: attempts[0]?.createdAt || null,
        };
      });

      return NextResponse.json({
        isAdmin: true,
        adminStats: {
          totalExams: allExams.length,
          totalAttempts: allAttempts.length,
          uniqueCandidates,
          overallAverageScore,
        },
        examAnalytics,
      });
    }

    // Query all attempts of this student user
    const attempts = await prisma.testAttempt.findMany({
      where: {
        userId: session.userId,
      },
      include: {
        examConfig: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const completedAttempts = attempts.filter(
      (a) => a.status === "EVALUATED" || a.status === "SUBMITTED"
    );

    const totalQuestionsSolved = completedAttempts.reduce((acc, curr) => acc + curr.attemptedCount, 0);
    const totalCorrect = completedAttempts.reduce((acc, curr) => acc + curr.correctCount, 0);
    const totalTime = completedAttempts.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0);

    const accuracy =
      totalQuestionsSolved > 0
        ? Number(((totalCorrect / totalQuestionsSolved) * 100).toFixed(1))
        : 0;

    const avgTimePerQuestion =
      totalQuestionsSolved > 0
        ? Math.round(totalTime / totalQuestionsSolved)
        : 0;

    const evaluatedAttempts = attempts.filter((a) => a.status === "EVALUATED");
    const bestScore =
      evaluatedAttempts.length > 0
        ? Math.max(...evaluatedAttempts.map((a) => a.finalScore))
        : 0;

    const recentTests = attempts.slice(0, 15).map((att) => {
      let isHeld = false;
      if (att.examConfig?.instructions) {
        try {
          const parsed = JSON.parse(att.examConfig.instructions);
          if (parsed.holdResults === true) {
            isHeld = true;
          }
        } catch (e) {}
      }

      const isUnstartedOrHold = att.status === "NOT_STARTED" || isHeld;

      return {
        id: att.id,
        examConfigId: att.examConfigId,
        title: formatCleanChapterTitle(att.examConfig?.title || "Mock Test"),
        mode: att.mode,
        status: att.status, // "EVALUATED" | "SUBMITTED" | "RUNNING" | "NOT_STARTED"
        isHeld,
        score: isUnstartedOrHold ? null : att.finalScore,
        totalMarks: att.examConfig?.totalMarks || 100,
        accuracy: isUnstartedOrHold ? null : att.accuracy,
        attempted: att.attemptedCount,
        totalQuestions: att.totalQuestions,
        timeSpentSeconds: att.timeSpentSeconds,
        startedAt: att.startedAt || att.createdAt,
        completedAt: att.completedAt || null,
        createdAt: att.createdAt,
      };
    });

    return NextResponse.json({
      stats: {
        testsAttempted: attempts.length,
        completedTests: completedAttempts.length,
        questionsSolved: totalQuestionsSolved,
        accuracy,
        avgTimePerQuestion,
        streakDays: attempts.length > 0 ? Math.min(attempts.length, 7) : 0,
        bestScore,
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
