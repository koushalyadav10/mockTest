import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    const body = await req.json();

    const {
      title,
      code,
      description,
      category = "SSC",
      totalQuestions = 100,
      totalMarks = 200,
      totalDurationMinutes = 60,
      marksPerCorrect = 2.0,
      negativeMarks = 0.50,
      sectionalTiming = false,
      sectionLock = false,
      allowBackNavigation = true,
      difficulty = "MEDIUM",
      languages = "en,hi",
      instructions,
      availability = "ALWAYS",
      startDate,
      endDate,
      sections = [],
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Test title is required." }, { status: 400 });
    }

    const uniqueCode = code || `CUSTOM_TEST_${Date.now()}`;

    // Create ExamConfig with sections
    const examConfig = await prisma.examConfig.create({
      data: {
        code: uniqueCode,
        title: title.trim(),
        description: description || null,
        category,
        mode: "TIER_1",
        totalQuestions: Number(totalQuestions),
        totalMarks: Number(totalMarks),
        totalDurationMinutes: Number(totalDurationMinutes),
        marksPerCorrect: Number(marksPerCorrect),
        negativeMarks: Number(negativeMarks),
        sectionalTiming: Boolean(sectionalTiming),
        sectionLock: Boolean(sectionLock),
        allowBackNavigation: Boolean(allowBackNavigation),
        difficulty,
        languages,
        instructions: instructions || "Standard CBT Mock Test Instructions.",
        availability,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: "PUBLISHED",
        sections: {
          create: sections.map((sec: any, idx: number) => ({
            name: sec.name,
            order: idx + 1,
            questionCount: Number(sec.questionCount) || 25,
            durationMinutes: sec.durationMinutes ? Number(sec.durationMinutes) : null,
            marksPerCorrect: sec.marksPerCorrect ? Number(sec.marksPerCorrect) : null,
            negativeMarks: sec.negativeMarks ? Number(sec.negativeMarks) : null,
            allowBackNavigation: sec.allowBackNavigation !== undefined ? Boolean(sec.allowBackNavigation) : true,
          })),
        },
      },
      include: {
        sections: true,
      },
    });

    // Log admin audit
    await prisma.auditLog.create({
      data: {
        userId: session?.userId || null,
        userEmail: session?.email || "admin@examforge.ai",
        action: "CREATE_TEST",
        entity: "ExamConfig",
        entityId: examConfig.id,
        details: JSON.stringify({ title, code: uniqueCode, totalQuestions, totalMarks }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test created and published successfully!",
      examConfig,
    });
  } catch (error: any) {
    console.error("Test creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create mock test" },
      { status: 500 }
    );
  }
}
