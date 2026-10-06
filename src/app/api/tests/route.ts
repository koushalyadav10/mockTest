import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { safelyShuffleQuestions, safelyShuffleOptions } from "@/lib/exam/shuffling";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      examConfigId,
      documentId,
      mode = "MOCK", // MOCK | PRACTICE
      subjectFilter,
      topicFilter,
      subtopicFilter,
      examFilter,
      shuffle = false,
      questionCountLimit,
    } = body;

    // Get current authenticated user
    const session = getSessionUser(req);
    let user = session?.userId
      ? await prisma.user.findUnique({ where: { id: session.userId } })
      : null;

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to start or take any test." },
        { status: 401 }
      );
    }

    // Get exam config
    let examConfig = examConfigId
      ? await prisma.examConfig.findUnique({
          where: { id: examConfigId },
          include: { sections: { orderBy: { order: "asc" } } },
        })
      : documentId
      ? (await prisma.examConfig.findFirst({
          where: { documentId },
          include: { sections: { orderBy: { order: "asc" } } },
        })) ||
        (await prisma.examConfig.findFirst({
          where: { code: "SSC_CHSL_TIER_1" },
          include: { sections: { orderBy: { order: "asc" } } },
        }))
      : await prisma.examConfig.findFirst({
          where: { code: "SSC_CHSL_TIER_1" },
          include: { sections: { orderBy: { order: "asc" } } },
        });

    if (!examConfig) {
      return NextResponse.json({ error: "Exam configuration not found" }, { status: 404 });
    }

    // Read stored filters from exam instructions if not explicitly passed in body
    let effectiveSubtopicFilter = subtopicFilter;
    let effectiveExamFilter = examFilter;
    let effectiveShuffle = shuffle;
    let effectiveMode = mode;

    if (examConfig.instructions) {
      try {
        const parsed = JSON.parse(examConfig.instructions);
        if (parsed.subtopicFilter && !effectiveSubtopicFilter) {
          effectiveSubtopicFilter = parsed.subtopicFilter;
        }
        if (parsed.examFilter && !effectiveExamFilter) {
          effectiveExamFilter = parsed.examFilter;
        }
        if (parsed.shuffle !== undefined && shuffle === false) {
          effectiveShuffle = parsed.shuffle;
        }
        if (parsed.instantFeedback && effectiveMode === "MOCK") {
          effectiveMode = "PRACTICE";
        }
      } catch (e) {}
    }

    // Query questions from Question Bank
    const whereClause: any = {};
    if (documentId) {
      whereClause.documentId = documentId;
    } else if (examConfig.documentId) {
      whereClause.documentId = examConfig.documentId;
    } else {
      whereClause.status = "APPROVED";
    }
    if (subjectFilter && subjectFilter !== "ALL") whereClause.subject = subjectFilter;
    if (topicFilter && topicFilter !== "ALL") whereClause.topic = topicFilter;
    if (effectiveSubtopicFilter && effectiveSubtopicFilter !== "ALL") {
      whereClause.subtopic = { contains: effectiveSubtopicFilter };
    }
    if (effectiveExamFilter && effectiveExamFilter !== "ALL") {
      whereClause.questionText = { contains: effectiveExamFilter };
    }

    let availableQuestions = await prisma.question.findMany({
      where: whereClause,
      include: {
        options: {
          orderBy: { label: "asc" },
        },
      },
      orderBy: { questionNumber: "asc" },
    });

    if (availableQuestions.length === 0 && !documentId && !examConfig.documentId) {
      // Fallback to all approved questions
      availableQuestions = await prisma.question.findMany({
        where: { status: "APPROVED" },
        include: {
          options: {
            orderBy: { label: "asc" },
          },
        },
        orderBy: { questionNumber: "asc" },
      });
    }

    // Determine target count: if filtered or document-linked, preserve all available filtered questions
    const hasFilter = Boolean(effectiveSubtopicFilter || effectiveExamFilter || documentId || examConfig.documentId);
    const targetCount = questionCountLimit || (hasFilter ? availableQuestions.length : Math.min(availableQuestions.length, examConfig.totalQuestions));
    const selectedQuestions = availableQuestions.slice(0, targetCount);

    // Honor explicit shuffle flag (e.g. from Chapter Hub mix mode), else adhere to sequential exam config
    const isDocumentOrSequentialExam = Boolean(documentId || examConfig.documentId || !examConfig.questionShuffle);
    const shouldShuffleQuestions = Boolean(effectiveShuffle) || (!isDocumentOrSequentialExam && examConfig.questionShuffle);
    const shouldShuffleOptions = Boolean(effectiveShuffle) || (!isDocumentOrSequentialExam && examConfig.optionShuffle);

    const orderedQuestions = shouldShuffleQuestions
      ? safelyShuffleQuestions(selectedQuestions, true)
      : [...selectedQuestions].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));

    // Create Test Attempt Record with deterministic question ordering
    const testAttempt = await prisma.testAttempt.create({
      data: {
        userId: user?.id,
        studentRollNo: user?.studentRollNo || `EF-${Date.now().toString().slice(-6)}`,
        examConfigId: examConfig.id,
        status: "NOT_STARTED",
        mode,
        totalQuestions: orderedQuestions.length,
        questionOrderJson: JSON.stringify(orderedQuestions.map((q) => q.id)),
      },
    });

    // Create Test Response records in a single batch (blazing fast, <30ms)
    const responseData = orderedQuestions.map((q, i) => {
      const sortedSourceOptions = [...q.options].sort((a, b) => (a.label || "").localeCompare(b.label || ""));
      const shuffledOptions = shouldShuffleOptions
        ? safelyShuffleOptions(
            sortedSourceOptions.map((opt) => ({
              stableId: opt.stableId,
              label: opt.label,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
            true
          )
        : sortedSourceOptions.map((opt) => ({
            stableId: opt.stableId,
            displayLabel: opt.label,
            text: opt.text,
            isCorrect: opt.isCorrect,
          }));

      const effectiveCorrectLabel = q.verifiedAnswer || q.sourceAnswer || q.aiSuggestedAnswer;
      let correctOpt = effectiveCorrectLabel
        ? q.options.find((o) => o.label.trim().toUpperCase() === effectiveCorrectLabel.trim().toUpperCase())
        : null;
      if (!correctOpt) {
        correctOpt = q.options.find((o) => o.isCorrect) || null;
      }

      return {
        testAttemptId: testAttempt.id,
        questionId: q.id,
        correctOptionStableId: correctOpt?.stableId || null,
        responseState: "NOT_VISITED",
        orderIndex: i + 1,
        shuffledOptionsJson: JSON.stringify(shuffledOptions),
        responseVersion: 1,
        syncStatus: "SYNCED",
      };
    });

    if (responseData.length > 0) {
      await prisma.testResponse.createMany({
        data: responseData,
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
