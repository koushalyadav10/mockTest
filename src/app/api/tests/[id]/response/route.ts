import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeNextResponseState, ResponseState } from "@/lib/exam/state-machine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      questionId,
      responseId,
      selectedOptionStableId,
      action, // "VISIT" | "SELECT_OPTION" | "CLEAR_RESPONSE" | "MARK_FOR_REVIEW" | "SAVE_AND_NEXT"
      timeSpentIncrementSeconds = 0,
    } = body;

    // Find the response record
    let responseRecord;
    if (responseId) {
      responseRecord = await prisma.testResponse.findUnique({
        where: { id: responseId },
      });
    } else if (questionId) {
      responseRecord = await prisma.testResponse.findFirst({
        where: {
          testAttemptId: params.id,
          questionId,
        },
      });
    }

    if (!responseRecord) {
      return NextResponse.json({ error: "Response record not found" }, { status: 404 });
    }

    const currentSelected =
      selectedOptionStableId !== undefined
        ? selectedOptionStableId
        : responseRecord.selectedOptionStableId;

    const nextState = computeNextResponseState({
      currentState: responseRecord.responseState as ResponseState,
      hasSelectedOption: Boolean(currentSelected),
      action: action || "SELECT_OPTION",
    });

    const now = new Date();
    const firstViewedAt = responseRecord.firstViewedAt || now;
    const lastViewedAt = now;
    const visitCount = action === "VISIT" ? responseRecord.visitCount + 1 : responseRecord.visitCount;
    const answeredAt = currentSelected ? (responseRecord.answeredAt || now) : null;

    // Update answer history if selected option changed
    let answerHistory: Array<{ answer: string | null; timestamp: string }> = [];
    if (responseRecord.answerHistoryJson) {
      try {
        answerHistory = JSON.parse(responseRecord.answerHistoryJson);
      } catch (e) {}
    }

    if (
      selectedOptionStableId !== undefined &&
      selectedOptionStableId !== responseRecord.selectedOptionStableId
    ) {
      answerHistory.push({
        answer: selectedOptionStableId,
        timestamp: now.toISOString(),
      });
    }

    const updated = await prisma.testResponse.update({
      where: { id: responseRecord.id },
      data: {
        selectedOptionStableId: currentSelected,
        responseState: nextState,
        timeSpentSeconds: responseRecord.timeSpentSeconds + (timeSpentIncrementSeconds || 0),
        firstViewedAt,
        lastViewedAt,
        visitCount,
        answeredAt,
        answerHistoryJson: JSON.stringify(answerHistory),
        responseVersion: { increment: 1 },
        syncStatus: "SYNCED",
      },
    });

    return NextResponse.json({
      success: true,
      responseId: updated.id,
      selectedOptionStableId: updated.selectedOptionStableId,
      responseState: updated.responseState,
      timeSpentSeconds: updated.timeSpentSeconds,
      visitCount: updated.visitCount,
      responseVersion: updated.responseVersion,
      syncStatus: updated.syncStatus,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to auto-save response" },
      { status: 500 }
    );
  }
}
