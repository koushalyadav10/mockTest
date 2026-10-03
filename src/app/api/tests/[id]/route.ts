import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateRemainingSeconds } from "@/lib/exam/timer";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: params.id },
      include: {
        examConfig: {
          include: {
            sections: { orderBy: { order: "asc" } },
          },
        },
        responses: {
          include: {
            question: {
              include: { options: true },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!testAttempt) {
      return NextResponse.json({ error: "Test attempt not found" }, { status: 404 });
    }

    // Compute Authoritative Server Timer
    let remainingSeconds = testAttempt.examConfig.totalDurationMinutes * 60;
    let isExpired = false;

    if (testAttempt.startedAt && testAttempt.status === "RUNNING") {
      const timerCalc = calculateRemainingSeconds(
        testAttempt.startedAt.toISOString(),
        testAttempt.examConfig.totalDurationMinutes
      );
      remainingSeconds = timerCalc.remainingSeconds;
      isExpired = timerCalc.isExpired;
    }

    // Order responses strictly by persisted questionOrderJson if present, else by orderIndex
    let orderedResponses = [...testAttempt.responses];
    if (testAttempt.questionOrderJson) {
      try {
        const orderIds: string[] = JSON.parse(testAttempt.questionOrderJson);
        const map = new Map(testAttempt.responses.map((r) => [r.questionId, r]));
        const sorted = orderIds.map((qid) => map.get(qid)).filter(Boolean) as typeof testAttempt.responses;
        if (sorted.length === testAttempt.responses.length) {
          orderedResponses = sorted;
        }
      } catch (e) {}
    }

    const formattedQuestions = orderedResponses.map((resp, index) => {
      // Parse shuffled options
      let optionsList = resp.question.options.map((o) => ({
        stableId: o.stableId,
        displayLabel: o.label,
        text: o.text,
      }));

      if (resp.shuffledOptionsJson) {
        try {
          const parsed = JSON.parse(resp.shuffledOptionsJson);
          optionsList = parsed.map((p: any) => ({
            stableId: p.stableId,
            displayLabel: p.displayLabel,
            text: p.text,
          }));
        } catch (e) {}
      }

      // Authoritative 3-level answer resolution
      const effectiveCorrectLabel =
        resp.question.verifiedAnswer ||
        resp.question.sourceAnswer ||
        resp.question.aiSuggestedAnswer;
      let correctOpt = effectiveCorrectLabel
        ? resp.question.options.find(
            (o) => o.label.trim().toUpperCase() === effectiveCorrectLabel.trim().toUpperCase()
          )
        : null;
      if (!correctOpt) {
        correctOpt = resp.question.options.find((o) => o.isCorrect) || null;
      }
      const correctOptionStableId = resp.correctOptionStableId || correctOpt?.stableId || null;

      return {
        responseId: resp.id,
        orderIndex: resp.orderIndex,
        questionId: resp.questionId,
        questionNumber: index + 1,
        subject: resp.question.subject,
        topic: resp.question.topic,
        difficulty: resp.question.difficulty,
        questionText: resp.question.questionText,
        source: resp.question.source || "SOURCE_QUESTION",
        questionType: resp.question.questionType || "MCQ",
        hasVisualContent: resp.question.hasVisualContent,
        visualType: resp.question.visualType || "UNKNOWN",
        imageUrl: resp.question.imageUrl,
        diagramUrl: resp.question.diagramUrl,
        year: resp.question.year,
        exam: resp.question.exam,
        directionText: resp.question.directionText || null,
        options: optionsList,
        selectedOptionStableId: resp.selectedOptionStableId,
        responseState: resp.responseState,
        timeSpentSeconds: resp.timeSpentSeconds,
        // Conceal answers in active MOCK mode to prevent browser devtools cheating
        correctOptionStableId:
          testAttempt.mode === "PRACTICE" || testAttempt.status === "EVALUATED"
            ? correctOptionStableId
            : null,
        explanation:
          testAttempt.mode === "PRACTICE" || testAttempt.status === "EVALUATED"
            ? resp.question.explanation
            : null,
        responseVersion: resp.responseVersion || 1,
        syncStatus: resp.syncStatus || "SYNCED",
      };
    });

    return NextResponse.json({
      testAttempt: {
        id: testAttempt.id,
        status: testAttempt.status,
        mode: testAttempt.mode,
        startedAt: testAttempt.startedAt,
        expiresAt: testAttempt.expiresAt,
        completedAt: testAttempt.completedAt,
        totalQuestions: testAttempt.totalQuestions,
        currentSectionIndex: testAttempt.currentSectionIndex,
        remainingSeconds,
        isExpired,
      },
      examConfig: testAttempt.examConfig,
      questions: formattedQuestions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch test details" },
      { status: 500 }
    );
  }
}
