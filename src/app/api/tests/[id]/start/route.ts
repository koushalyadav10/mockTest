import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: params.id },
      include: { examConfig: true },
    });

    if (!testAttempt) {
      return NextResponse.json({ error: "Test attempt not found" }, { status: 404 });
    }

    const now = new Date();
    const durationMinutes = testAttempt.examConfig.totalDurationMinutes;
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    const updated = await prisma.testAttempt.update({
      where: { id: params.id },
      data: {
        status: "RUNNING",
        startedAt: testAttempt.startedAt || now,
        expiresAt: testAttempt.expiresAt || expiresAt,
      },
    });

    const remainingSeconds = Math.max(
      0,
      Math.floor((updated.expiresAt!.getTime() - Date.now()) / 1000)
    );

    return NextResponse.json({
      success: true,
      status: updated.status,
      startedAt: updated.startedAt,
      expiresAt: updated.expiresAt,
      remainingSeconds,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to start test" },
      { status: 500 }
    );
  }
}
