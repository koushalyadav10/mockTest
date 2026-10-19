import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { safelyShuffleQuestions, safelyShuffleOptions } from "@/lib/exam/shuffling";
import { getSessionUser } from "@/lib/auth/session";
import { getEffectiveDurationMinutes } from "@/lib/exam/timer";
import { sampleBlueprintQuestions } from "@/lib/exam/blueprintSampler";

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
      rangeFrom,
      rangeTo,
      durationMinutes,
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

    // Schedule Lockdown Enforcement: Prevent students from entering room or starting test before scheduled time
    const isStaff = user.role === "ADMIN" || user.role === "TEACHER";
    const now = new Date();

    if (examConfig.availability === "SCHEDULED" && !isStaff) {
      if (examConfig.startDate && new Date(examConfig.startDate) > now) {
        const opensAt = new Date(examConfig.startDate).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return NextResponse.json(
          {
            error: `Examination Hall is Locked. This scheduled test will officially open on ${opensAt}. Please wait until the start time.`,
            isLocked: true,
            opensAt,
            startDate: examConfig.startDate,
          },
          { status: 403 }
        );
      }

      if (examConfig.endDate && new Date(examConfig.endDate) < now) {
        return NextResponse.json(
          {
            error: "This scheduled examination has ended and is now closed.",
            isExpired: true,
          },
          { status: 403 }
        );
      }
    }

    // Read stored filters and range from exam instructions if not explicitly passed in body
    let effectiveSubtopicFilter = subtopicFilter;
    let effectiveExamFilter = examFilter;
    let effectiveShuffle = shuffle;
    let effectiveMode = mode;
    let effectiveRangeFrom = rangeFrom !== undefined && rangeFrom !== null ? Number(rangeFrom) : undefined;
    let effectiveRangeTo = rangeTo !== undefined && rangeTo !== null ? Number(rangeTo) : undefined;

    let isBlueprintExam = false;
    let blueprintParsed: any = null;

    if (examConfig.instructions) {
      try {
        const parsed = JSON.parse(examConfig.instructions);
        if (parsed.isBlueprint) {
          isBlueprintExam = true;
          blueprintParsed = parsed;
        }
        if (parsed.subtopicFilter && !effectiveSubtopicFilter) {
          effectiveSubtopicFilter = parsed.subtopicFilter;
        }
        if (parsed.examFilter && !effectiveExamFilter) {
          effectiveExamFilter = parsed.examFilter;
        }
        if (parsed.rangeFrom !== undefined && effectiveRangeFrom === undefined) {
          effectiveRangeFrom = Number(parsed.rangeFrom);
        }
        if (parsed.rangeTo !== undefined && effectiveRangeTo === undefined) {
          effectiveRangeTo = Number(parsed.rangeTo);
        }
        if (parsed.shuffle !== undefined && shuffle === false) {
          effectiveShuffle = parsed.shuffle;
        }
        if (parsed.instantFeedback && effectiveMode === "MOCK") {
          effectiveMode = "PRACTICE";
        }
      } catch (e) {}
    }

    let selectedQuestions: any[] = [];

    if (isBlueprintExam && blueprintParsed) {
      if (
        blueprintParsed.paperMode === "FIXED" &&
        Array.isArray(blueprintParsed.fixedQuestionIds) &&
        blueprintParsed.fixedQuestionIds.length > 0
      ) {
        // Load exact pre-locked questions
        const fixedQuestions = await prisma.question.findMany({
          where: { id: { in: blueprintParsed.fixedQuestionIds } },
          include: {
            options: {
              orderBy: { label: "asc" },
            },
          },
        });
        const qMap = new Map(fixedQuestions.map((q) => [q.id, q]));
        selectedQuestions = blueprintParsed.fixedQuestionIds
          .map((id: string) => qMap.get(id))
          .filter(Boolean);
      } else if (Array.isArray(blueprintParsed.allocations)) {
        // Dynamic fresh sampling per student attempt
        const sampleResult = await sampleBlueprintQuestions(
          blueprintParsed.allocations,
          blueprintParsed.orderingMode || "JUMBLED"
        );
        const sampledIds = sampleResult.questions.map((q) => q.id);
        const dynamicQuestions = await prisma.question.findMany({
          where: { id: { in: sampledIds } },
          include: {
            options: {
              orderBy: { label: "asc" },
            },
          },
        });
        const qMap = new Map(dynamicQuestions.map((q) => [q.id, q]));
        selectedQuestions = sampledIds.map((id) => qMap.get(id)).filter(Boolean);
      }
    } else {
      // Standard Question Bank Query
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

      // Apply Question Range Filter (e.g. Q.55 to Q.80)
      if (
        effectiveRangeFrom !== undefined &&
        effectiveRangeTo !== undefined &&
        effectiveRangeFrom >= 1 &&
        effectiveRangeTo >= effectiveRangeFrom
      ) {
        const fromIdx = Math.max(0, effectiveRangeFrom - 1);
        const toIdx = Math.min(availableQuestions.length, effectiveRangeTo);
        availableQuestions = availableQuestions.slice(fromIdx, toIdx);
      }

      // Determine target count: if filtered or document-linked, preserve all available filtered questions
      const hasFilter = Boolean(
        effectiveSubtopicFilter ||
        effectiveExamFilter ||
        effectiveRangeFrom !== undefined ||
        documentId ||
        examConfig.documentId
      );
      const targetCount = questionCountLimit || (hasFilter ? availableQuestions.length : Math.min(availableQuestions.length, examConfig.totalQuestions));
      selectedQuestions = availableQuestions.slice(0, targetCount);
    }

    // Honor explicit shuffle flag (e.g. from Chapter Hub mix mode), else adhere to examConfig settings
    const shouldShuffleQuestions =
      effectiveShuffle !== undefined
        ? Boolean(effectiveShuffle)
        : Boolean(examConfig.questionShuffle);
    const shouldShuffleOptions =
      effectiveShuffle !== undefined
        ? Boolean(effectiveShuffle)
        : Boolean(examConfig.optionShuffle);

    const orderedQuestions = shouldShuffleQuestions
      ? safelyShuffleQuestions(selectedQuestions, true)
      : isBlueprintExam
      ? selectedQuestions
      : [...selectedQuestions].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));

    const effectiveDurationMinutes = getEffectiveDurationMinutes(
      orderedQuestions.length,
      examConfig.totalDurationMinutes,
      examConfig.totalQuestions,
      durationMinutes
    );
    const attemptNow = new Date();
    const expiresAt = new Date(attemptNow.getTime() + effectiveDurationMinutes * 60 * 1000);

    // Create Test Attempt Record with deterministic question ordering
    const testAttempt = await prisma.testAttempt.create({
      data: {
        userId: user?.id,
        studentRollNo: user?.studentRollNo || `EF-${Date.now().toString().slice(-6)}`,
        examConfigId: examConfig.id,
        status: "NOT_STARTED",
        startedAt: attemptNow,
        expiresAt: expiresAt,
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
        ? q.options.find((o: any) => o.label.trim().toUpperCase() === effectiveCorrectLabel.trim().toUpperCase())
        : null;
      if (!correctOpt) {
        correctOpt = q.options.find((o: any) => o.isCorrect) || null;
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
      durationMinutes: effectiveDurationMinutes,
    });
  } catch (error: any) {
    console.error("Failed to create test attempt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create test attempt" },
      { status: 500 }
    );
  }
}
