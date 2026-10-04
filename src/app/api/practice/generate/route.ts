import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { safelyShuffleOptions } from "@/lib/exam/shuffling";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, topic, count = 10 } = body;

    const session = getSessionUser(req);
    let user = session?.userId
      ? await prisma.user.findUnique({ where: { id: session.userId } })
      : null;

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to start a practice session." },
        { status: 401 }
      );
    }

    // Find questions matching topic
    const where: any = { status: "APPROVED" };
    if (subject && subject !== "ALL") where.subject = subject;
    if (topic && topic !== "ALL") where.topic = topic;

    let questions = await prisma.question.findMany({
      where,
      include: { options: true },
      take: count,
    });

    if (questions.length === 0) {
      // Fallback to any questions
      questions = await prisma.question.findMany({
        where: { status: "APPROVED" },
        include: { options: true },
        take: count,
      });
    }

    // Find custom practice exam config
    let practiceConfig = await prisma.examConfig.findFirst({
      where: { mode: "PRACTICE" },
    });
    if (!practiceConfig) {
      practiceConfig = await prisma.examConfig.create({
        data: {
          code: `CUSTOM_PRACTICE_${Date.now()}`,
          title: `Targeted Practice: ${topic || "Mixed"}`,
          mode: "PRACTICE",
          totalQuestions: questions.length,
          totalMarks: questions.length * 2,
          totalDurationMinutes: Math.max(10, questions.length * 1.5),
          marksPerCorrect: 2.0,
          negativeMarks: 0.5,
        },
      });
    }

    // Create Test Attempt in PRACTICE mode
    const testAttempt = await prisma.testAttempt.create({
      data: {
        userId: user.id,
        examConfigId: practiceConfig.id,
        mode: "PRACTICE",
        status: "NOT_STARTED",
        totalQuestions: questions.length,
      },
    });

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const shuffledOptions = safelyShuffleOptions(
        q.options.map((opt) => ({
          stableId: opt.stableId,
          label: opt.label,
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        true
      );

      await prisma.testResponse.create({
        data: {
          testAttemptId: testAttempt.id,
          questionId: q.id,
          responseState: "NOT_VISITED",
          orderIndex: i + 1,
          shuffledOptionsJson: JSON.stringify(shuffledOptions),
        },
      });
    }

    return NextResponse.json({
      success: true,
      testAttemptId: testAttempt.id,
      topic,
      count: questions.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate targeted practice session" },
      { status: 500 }
    );
  }
}
