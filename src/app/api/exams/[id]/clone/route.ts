import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// POST create a scheduled copy of an existing master exam
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const source = await prisma.examConfig.findUnique({
      where: { id: params.id },
      include: { sections: true },
    });

    if (!source) {
      return NextResponse.json({ error: "Source master exam not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      startDate,
      endDate,
      mode = "EXAM",
      totalDurationMinutes,
      marksPerCorrect,
      negativeMarks,
      holdResults = false,
      questionShuffle = true,
      optionShuffle = true,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Exam title is required for the scheduled copy." },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Start date and End date are required to schedule an exam window." },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    let computedStatus = "UPCOMING";
    if (now >= start && now <= end) {
      computedStatus = "LIVE";
    } else if (now > end) {
      computedStatus = "EXPIRED";
    }

    // Generate unique exam code
    const uniqueSuffix = Date.now().toString().slice(-6);
    const cleanBaseCode = source.code.replace(/_SCHED_\d+$/, "").slice(0, 30);
    const newCode = `${cleanBaseCode}_SCHED_${uniqueSuffix}`;

    // Inherit instructions and attach holdResults + sourceExamId
    let parsedInstructions: any = {};
    if (source.instructions) {
      try {
        parsedInstructions = JSON.parse(source.instructions);
      } catch (e) {}
    }
    parsedInstructions.holdResults = Boolean(holdResults);
    parsedInstructions.sourceExamId = source.id;
    parsedInstructions.isClonedInstance = true;

    const clonedExam = await prisma.examConfig.create({
      data: {
        code: newCode,
        title: title.trim(),
        description: source.description,
        category: source.category,
        mode: mode,
        status: "PUBLISHED",
        availability: "SCHEDULED",
        startDate: start,
        endDate: end,
        scheduledStatus: computedStatus,
        totalQuestions: source.totalQuestions,
        totalMarks: source.totalMarks,
        totalDurationMinutes: Number(totalDurationMinutes) || source.totalDurationMinutes,
        marksPerCorrect:
          marksPerCorrect !== undefined ? Number(marksPerCorrect) : source.marksPerCorrect,
        negativeMarks:
          negativeMarks !== undefined ? Number(negativeMarks) : source.negativeMarks,
        sectionalTiming: source.sectionalTiming,
        sectionLock: source.sectionLock,
        navigationRules: source.navigationRules,
        questionShuffle: Boolean(questionShuffle),
        optionShuffle: Boolean(optionShuffle),
        instructions: JSON.stringify(parsedInstructions),
        documentId: source.documentId,
        sections: {
          create: source.sections.map((sec) => ({
            name: sec.name,
            order: sec.order,
            questionCount: sec.questionCount,
            durationMinutes: sec.durationMinutes,
            marksPerCorrect: sec.marksPerCorrect,
            negativeMarks: sec.negativeMarks,
            allowBackNavigation: sec.allowBackNavigation,
          })),
        },
      },
      include: {
        sections: true,
      },
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "EXAM_CLONED_SCHEDULED",
        entity: "ExamConfig",
        entityId: clonedExam.id,
        details: `Created scheduled copy '${clonedExam.title}' (${clonedExam.code}) from master exam '${source.title}'`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Scheduled test copy '${clonedExam.title}' created successfully! Master test remains safe in Permanent Tests.`,
      exam: clonedExam,
    });
  } catch (error: any) {
    console.error("Error cloning exam:", error);
    return NextResponse.json(
      { error: error.message || "Failed to clone and schedule exam" },
      { status: 500 }
    );
  }
}
