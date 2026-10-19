import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";
import { sampleBlueprintQuestions, ChapterAllocation } from "@/lib/exam/blueprintSampler";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (session && session.role !== "ADMIN" && session.role !== "TEACHER") {
      return NextResponse.json({ error: "Access denied. Admin or Teacher role required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category = "CUSTOM",
      allocations = [],
      selectionMode = "RANDOM", // default per-chapter selection fallback
      orderingMode = "JUMBLED", // "JUMBLED" (mixed across subjects) | "SECTIONAL" (grouped by subject)
      paperMode = "FIXED", // "FIXED" (lock sample once) | "DYNAMIC" (sample fresh per student attempt)
      durationMinutes,
      marksPerCorrect = 2.0,
      negativeMarks = 0.50,
      mode = "MOCK", // "MOCK" | "PRACTICE"
      difficulty = "MEDIUM",
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Test title is required." }, { status: 400 });
    }

    if (!Array.isArray(allocations) || allocations.length === 0) {
      return NextResponse.json({ error: "Please select at least one chapter with question quota." }, { status: 400 });
    }

    // Filter valid allocations
    const validAllocations: ChapterAllocation[] = allocations
      .filter((a: any) => Number(a.quota) > 0)
      .map((a: any) => ({
        id: a.id,
        documentId: a.documentId || null,
        chapterId: a.chapterId || null,
        subject: a.subject,
        title: a.title,
        quota: Number(a.quota),
        selectionMode: a.selectionMode || selectionMode || "RANDOM",
      }));

    if (validAllocations.length === 0) {
      return NextResponse.json({ error: "Total question quota must be greater than 0." }, { status: 400 });
    }

    // Sample questions
    const sampleResult = await sampleBlueprintQuestions(validAllocations, orderingMode);
    const totalQuestions = sampleResult.questions.length;

    if (totalQuestions === 0) {
      return NextResponse.json({ error: "Could not find any questions matching the selected chapters." }, { status: 400 });
    }

    const calculatedMarks = totalQuestions * Number(marksPerCorrect);
    const effectiveDuration = durationMinutes ? Number(durationMinutes) : Math.max(15, Math.ceil(totalQuestions * 1.2));
    const uniqueExamCode = `BLUEPRINT_MOCK_${Date.now()}`;

    // Prepare instructions metadata
    const instructionsPayload = {
      isBlueprint: true,
      blueprintType: "MULTI_SUBJECT_CROSS_MIXED",
      paperMode, // "FIXED" or "DYNAMIC"
      orderingMode, // "JUMBLED" or "SECTIONAL"
      allocations: validAllocations,
      subjectBreakdown: sampleResult.subjectBreakdown,
      fixedQuestionIds: paperMode === "FIXED" ? sampleResult.questions.map((q) => q.id) : undefined,
      instantFeedback: mode === "PRACTICE",
    };

    // Prepare sections
    let sectionsToCreate: any[] = [];
    if (orderingMode === "SECTIONAL") {
      let orderIdx = 1;
      for (const [subj, data] of Object.entries(sampleResult.subjectBreakdown)) {
        sectionsToCreate.push({
          name: subj,
          order: orderIdx++,
          questionCount: data.total,
          marksPerCorrect: Number(marksPerCorrect),
          negativeMarks: Number(negativeMarks),
          allowBackNavigation: true,
        });
      }
    } else {
      sectionsToCreate.push({
        name: "Mixed Multi-Subject Section",
        order: 1,
        questionCount: totalQuestions,
        marksPerCorrect: Number(marksPerCorrect),
        negativeMarks: Number(negativeMarks),
        allowBackNavigation: true,
      });
    }

    // Create ExamConfig
    const examConfig = await prisma.examConfig.create({
      data: {
        code: uniqueExamCode,
        title: title.trim(),
        description: description || `Custom Multi-Chapter Mixed Mock test covering ${Object.keys(sampleResult.subjectBreakdown).join(", ")}. Total ${totalQuestions} questions.`,
        category,
        mode: mode === "PRACTICE" ? "PRACTICE" : "TIER_1",
        totalQuestions,
        totalMarks: calculatedMarks,
        totalDurationMinutes: effectiveDuration,
        marksPerCorrect: Number(marksPerCorrect),
        negativeMarks: Number(negativeMarks),
        sectionalTiming: orderingMode === "SECTIONAL",
        sectionLock: false,
        allowBackNavigation: true,
        difficulty,
        languages: "en,hi",
        instructions: JSON.stringify(instructionsPayload),
        availability: "ALWAYS",
        scheduledStatus: "LIVE",
        status: "PUBLISHED",
        sections: {
          create: sectionsToCreate,
        },
      },
      include: {
        sections: true,
      },
    });

    // Create Admin Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session?.userId || null,
        userEmail: session?.email || "admin@examforge.ai",
        action: "CREATE_BLUEPRINT_TEST",
        entity: "ExamConfig",
        entityId: examConfig.id,
        details: JSON.stringify({
          title: examConfig.title,
          totalQuestions,
          paperMode,
          orderingMode,
          subjects: Object.keys(sampleResult.subjectBreakdown),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Multi-subject mixed mock test created and published successfully!",
      examConfig: {
        id: examConfig.id,
        code: examConfig.code,
        title: examConfig.title,
        totalQuestions: examConfig.totalQuestions,
        totalMarks: examConfig.totalMarks,
        totalDurationMinutes: examConfig.totalDurationMinutes,
        paperMode,
        orderingMode,
        subjectBreakdown: sampleResult.subjectBreakdown,
      },
    });
  } catch (error: any) {
    console.error("Blueprint test creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create mixed mock test" }, { status: 500 });
  }
}
