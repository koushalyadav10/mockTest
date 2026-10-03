import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { safelyShuffleQuestions, safelyShuffleOptions } from "@/lib/exam/shuffling";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      examConfigId,
      documentId,
      mode = "MOCK", // MOCK | PRACTICE
      subjectFilter,
      topicFilter,
      questionCountLimit,
    } = body;

    // Get user
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

    // Get exam config
    let examConfig = examConfigId
      ? await prisma.examConfig.findUnique({
          where: { id: examConfigId },
          include: { sections: { orderBy: { order: "asc" } } },
        })
      : await prisma.examConfig.findFirst({
          where: { code: "SSC_CHSL_TIER_1" },
          include: { sections: { orderBy: { order: "asc" } } },
        });

    if (!examConfig) {
      return NextResponse.json({ error: "Exam configuration not found" }, { status: 404 });
    }

    // Query questions from Question Bank
    const whereClause: any = {};
    if (documentId) {
      whereClause.documentId = documentId;
    } else {
      whereClause.status = "APPROVED";
    }
    if (subjectFilter && subjectFilter !== "ALL") whereClause.subject = subjectFilter;
    if (topicFilter && topicFilter !== "ALL") whereClause.topic = topicFilter;

    let availableQuestions = await prisma.question.findMany({
      where: whereClause,
      include: { options: true },
      orderBy: { questionNumber: "asc" },
    });

    if (availableQuestions.length === 0 && !documentId) {
      // Fallback to all approved questions
      availableQuestions = await prisma.question.findMany({
        where: { status: "APPROVED" },
        include: { options: true },
        orderBy: { questionNumber: "asc" },
      });
    }

    // Limit questions count if specified or from exam config
    const targetCount = questionCountLimit || Math.min(availableQuestions.length, examConfig.totalQuestions);
    const selectedQuestions = availableQuestions.slice(0, targetCount);

    // Apply safe question shuffle if configured
    const orderedQuestions = safelyShuffleQuestions(
      selectedQuestions,
      examConfig.questionShuffle
    );

    // Create Test Attempt Record with deterministic question ordering
    const testAttempt = await prisma.testAttempt.create({
      data: {
        userId: user.id,
        examConfigId: examConfig.id,
        status: "NOT_STARTED",
        mode,
        totalQuestions: orderedQuestions.length,
        questionOrderJson: JSON.stringify(orderedQuestions.map((q) => q.id)),
      },
    });

    // Create Test Response records with safe option shuffle & stable correct option ID
    for (let i = 0; i < orderedQuestions.length; i++) {
      const q = orderedQuestions[i];

      // Safely shuffle options for this specific test attempt
      const shuffledOptions = safelyShuffleOptions(
        q.options.map((opt) => ({
          stableId: opt.stableId,
          label: opt.label,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        examConfig.optionShuffle
      );

      // Determine correct option according to 3-level answer hierarchy
      const effectiveCorrectLabel = q.verifiedAnswer || q.sourceAnswer || q.aiSuggestedAnswer;
      let correctOpt = effectiveCorrectLabel
        ? q.options.find((o) => o.label.trim().toUpperCase() === effectiveCorrectLabel.trim().toUpperCase())
        : null;
      if (!correctOpt) {
        correctOpt = q.options.find((o) => o.isCorrect) || null;
      }

      await prisma.testResponse.create({
        data: {
          testAttemptId: testAttempt.id,
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
      testAttemptId: testAttempt.id,
      mode,
      totalQuestions: orderedQuestions.length,
    });
  } catch (error: any) {
    console.error("Failed to create test attempt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create test attempt" },
      { status: 500 }
    );
  }
}
