import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const rawExams = await prisma.examConfig.findMany({
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { testAttempts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    const exams = rawExams.map((exam) => {
      let computedStatus = exam.scheduledStatus || "LIVE";
      if (exam.availability === "SCHEDULED") {
        if (exam.startDate && now < new Date(exam.startDate)) {
          computedStatus = "UPCOMING";
        } else if (exam.endDate && now > new Date(exam.endDate)) {
          computedStatus = "EXPIRED";
        } else {
          computedStatus = "LIVE";
        }
      } else {
        computedStatus = "LIVE";
      }

      return {
        ...exam,
        totalAttempts: exam._count?.testAttempts || 0,
        scheduledStatus: computedStatus,
      };
    });

    return NextResponse.json({ exams });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch exam configurations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      title,
      description,
      category = "SSC",
      mode = "TIER_1",
      totalQuestions = 100,
      totalMarks = 200,
      totalDurationMinutes = 60,
      marksPerCorrect = 2.0,
      negativeMarks = 0.5,
      sectionalTiming = false,
      sectionLock = false,
      navigationRules = "FREE",
      questionShuffle = true,
      optionShuffle = true,
      sections = [],
    } = body;

    if (!code || !title) {
      return NextResponse.json(
        { error: "Exam code and title are required" },
        { status: 400 }
      );
    }

    const examConfig = await prisma.examConfig.create({
      data: {
        code,
        title,
        description,
        category,
        mode,
        totalQuestions,
        totalMarks,
        totalDurationMinutes,
        marksPerCorrect,
        negativeMarks,
        sectionalTiming,
        sectionLock,
        navigationRules,
        questionShuffle,
        optionShuffle,
        sections: {
          create: sections.map((sec: any, idx: number) => ({
            name: sec.name,
            order: idx + 1,
            questionCount: sec.questionCount || 25,
            durationMinutes: sec.durationMinutes,
            marksPerCorrect: sec.marksPerCorrect,
            negativeMarks: sec.negativeMarks,
          })),
        },
      },
      include: {
        sections: true,
      },
    });

    return NextResponse.json({ success: true, exam: examConfig });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create exam configuration" },
      { status: 500 }
    );
  }
}
