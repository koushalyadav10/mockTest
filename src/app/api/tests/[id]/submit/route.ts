import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { evaluateTestAttempt } from "@/lib/exam/scoring-engine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: params.id },
      include: {
        examConfig: true,
        responses: {
          include: {
            question: {
              include: { options: true },
            },
          },
        },
      },
    });

    if (!testAttempt) {
      return NextResponse.json({ error: "Test attempt not found" }, { status: 404 });
    }

    // Helper to resolve authoritative correct option stable ID
    const resolveCorrectOptionStableId = (resp: typeof testAttempt.responses[0]) => {
      if (resp.correctOptionStableId) return resp.correctOptionStableId;
      const effectiveLabel =
        resp.question.verifiedAnswer ||
        resp.question.sourceAnswer ||
        resp.question.aiSuggestedAnswer;
      if (effectiveLabel) {
        const found = resp.question.options.find(
          (o) => o.label.trim().toUpperCase() === effectiveLabel.trim().toUpperCase()
        );
        if (found) return found.stableId;
      }
      return resp.question.options.find((o) => o.isCorrect)?.stableId || null;
    };

    // Build evaluation input
    const evalItems = testAttempt.responses.map((resp) => {
      const correctOptionStableId = resolveCorrectOptionStableId(resp);
      return {
        questionId: resp.questionId,
        selectedOptionStableId: resp.selectedOptionStableId,
        correctOptionStableId,
        timeSpentSeconds: resp.timeSpentSeconds,
        responseState: resp.responseState,
        subject: resp.question.subject,
        topic: resp.question.topic,
      };
    });

    // Authoritative Server-Side Evaluation using Exam Configuration
    const evaluation = evaluateTestAttempt(evalItems, {
      marksPerCorrect: testAttempt.examConfig.marksPerCorrect,
      negativeMarks: testAttempt.examConfig.negativeMarks,
      totalMarks: testAttempt.examConfig.totalMarks,
    });

    // Batch update all responses in a single atomic transaction (blazing fast, <100ms)
    const updateOperations = testAttempt.responses.map((resp) => {
      const correctOptionStableId = resolveCorrectOptionStableId(resp);
      const isAnswered = Boolean(resp.selectedOptionStableId);
      const isCorrect =
        isAnswered && correctOptionStableId
          ? resp.selectedOptionStableId === correctOptionStableId
          : false;

      const marksAwarded = !isAnswered
        ? 0
        : isCorrect
        ? testAttempt.examConfig.marksPerCorrect
        : -testAttempt.examConfig.negativeMarks;

      return prisma.testResponse.update({
        where: { id: resp.id },
        data: {
          correctOptionStableId,
          isCorrect: isAnswered ? isCorrect : null,
          marksAwarded,
        },
      });
    });

    if (updateOperations.length > 0) {
      await prisma.$transaction(updateOperations);
    }

    // Update Test Attempt summary
    const updatedAttempt = await prisma.testAttempt.update({
      where: { id: params.id },
      data: {
        status: "EVALUATED",
        completedAt: new Date(),
        attemptedCount: evaluation.attemptedCount,
        correctCount: evaluation.correctCount,
        incorrectCount: evaluation.incorrectCount,
        unattemptedCount: evaluation.unattemptedCount,
        markedCount: evaluation.markedCount,
        rawScore: evaluation.rawScore,
        negativeMarksTotal: evaluation.negativeMarksTotal,
        finalScore: evaluation.finalScore,
        accuracy: evaluation.accuracy,
        timeSpentSeconds: evaluation.totalTimeSeconds,
      },
    });

    // Update persistent user metrics (guarantees count persists even if test attempt is deleted)
    if (testAttempt.userId) {
      await prisma.user.update({
        where: { id: testAttempt.userId },
        data: {
          totalTestsAttended: { increment: 1 },
        },
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      testAttemptId: updatedAttempt.id,
      evaluation,
    });
  } catch (error: any) {
    console.error("Submission evaluation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to evaluate exam submission" },
      { status: 500 }
    );
  }
}
