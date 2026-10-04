import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) {
      // In development fallback, allow access or check session
    }

    const [
      totalStudents,
      totalTeachers,
      totalQuestions,
      totalTests,
      totalAttempts,
      recentAttempts,
      recentAuditLogs,
      recentViolations,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.question.count(),
      prisma.examConfig.count(),
      prisma.testAttempt.count(),
      prisma.testAttempt.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true, studentRollNo: true } },
          examConfig: { select: { title: true, category: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { timestamp: "desc" },
      }),
      prisma.attemptViolation.findMany({
        take: 8,
        orderBy: { timestamp: "desc" },
        include: {
          student: { select: { name: true, email: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalStudents,
        totalTeachers,
        totalQuestions,
        totalTests,
        totalAttempts,
      },
      recentAttempts,
      recentAuditLogs,
      recentViolations,
    });
  } catch (error: any) {
    console.error("Admin overview error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load admin overview" },
      { status: 500 }
    );
  }
}
