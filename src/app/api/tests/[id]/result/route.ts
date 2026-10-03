import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { evaluateTestAttempt } from "@/lib/exam/scoring-engine";
import {
  analyzeTopicPerformance,
  computeKnowledgeSpeedMatrix,
} from "@/lib/exam/analytics-engine";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: params.id },
      include: {
        examConfig: true,
        user: true,
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

    const evaluation = evaluateTestAttempt(evalItems, {
      marksPerCorrect: testAttempt.examConfig.marksPerCorrect,
      negativeMarks: testAttempt.examConfig.negativeMarks,
      totalMarks: testAttempt.examConfig.totalMarks,
    });

    // Run Weak Topic Diagnosis with 2D time tracking
    const topicAnalysisInput = testAttempt.responses.map((r) => {
      const correctOptionStableId = resolveCorrectOptionStableId(r);
      const isAttempted = Boolean(r.selectedOptionStableId);
      const isCorrect =
        isAttempted && correctOptionStableId === r.selectedOptionStableId;
      return {
        subject: r.question.subject,
        topic: r.question.topic,
        isAttempted,
        isCorrect,
        timeSpentSeconds: r.timeSpentSeconds,
      };
    });
    const topicPerformance = analyzeTopicPerformance(topicAnalysisInput);
    const knowledgeSpeedMatrix = computeKnowledgeSpeedMatrix(topicPerformance);

    // Format Question Solutions with full metadata
    const questionsSolutions = testAttempt.responses.map((resp) => {
      const correctOptionStableId = resolveCorrectOptionStableId(resp);
      let optionsList = resp.question.options.map((o) => ({
        stableId: o.stableId,
        label: o.label,
        text: o.text,
        isCorrect: o.isCorrect,
      }));

      if (resp.shuffledOptionsJson) {
        try {
          const parsed = JSON.parse(resp.shuffledOptionsJson);
          optionsList = parsed.map((p: any) => ({
            stableId: p.stableId,
            label: p.displayLabel,
            text: p.text,
            isCorrect: p.isCorrect,
          }));
        } catch (e) {}
      }

      return {
        questionNumber: resp.orderIndex,
        subject: resp.question.subject,
        topic: resp.question.topic,
        questionText: resp.question.questionText,
        source: resp.question.source || "SOURCE_QUESTION",
        questionType: resp.question.questionType || "MCQ",
        hasVisualContent: resp.question.hasVisualContent,
        visualType: resp.question.visualType || "UNKNOWN",
        imageUrl: resp.question.imageUrl,
        diagramUrl: resp.question.diagramUrl,
        year: resp.question.year,
        exam: resp.question.exam,
        tags: resp.question.tags,
        options: optionsList,
        selectedOptionStableId: resp.selectedOptionStableId,
        correctOptionStableId,
        isCorrect: resp.isCorrect,
        timeSpentSeconds: resp.timeSpentSeconds,
        explanation: resp.question.explanation,
      };
    });

    return NextResponse.json({
      testAttempt: {
        id: testAttempt.id,
        examTitle: testAttempt.examConfig.title,
        category: testAttempt.examConfig.category,
        candidateName: testAttempt.user?.name || "Aditya Sharma",
        completedAt: testAttempt.completedAt || testAttempt.updatedAt,
        totalMarks: testAttempt.examConfig.totalMarks,
      },
      evaluation,
      topicPerformance,
      knowledgeSpeedMatrix,
      questions: questionsSolutions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch test result" },
      { status: 500 }
    );
  }
}
