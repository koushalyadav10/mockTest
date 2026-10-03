import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      type = "FOCUS_LOSS",
      sectionName,
      questionNumber,
      violationCount,
    } = body;

    const session = getSessionUser(req);

    // Record violation in DB
    const violation = await prisma.attemptViolation.create({
      data: {
        attemptId: params.id,
        studentId: session?.userId || null,
        type,
        count: violationCount || 1,
        sectionName: sectionName || null,
        questionNumber: questionNumber || null,
      },
    });

    // Update attempt violation count
    await prisma.testAttempt.update({
      where: { id: params.id },
      data: {
        violationCount: { increment: 1 },
      },
    });

    // Log in audit log
    await prisma.auditLog.create({
      data: {
        userId: session?.userId || null,
        userEmail: session?.email || null,
        action: "PROCTORING_VIOLATION",
        entity: "TestAttempt",
        entityId: params.id,
        details: JSON.stringify({ type, count: violationCount, sectionName, questionNumber }),
      },
    });

    return NextResponse.json({
      success: true,
      violationId: violation.id,
      recordedAt: violation.timestamp,
    });
  } catch (error: any) {
    console.error("Violation logging error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record violation" },
      { status: 500 }
    );
  }
}
