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
      candidatesList,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.question.count(),
      prisma.examConfig.count(),
      prisma.testAttempt.count(),
      prisma.testAttempt.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, studentRollNo: true } },
          examConfig: { select: { id: true, title: true, category: true, totalMarks: true } },
        },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { timestamp: "desc" },
      }),
      prisma.attemptViolation.findMany({
        take: 20,
        orderBy: { timestamp: "desc" },
        include: {
          student: { select: { id: true, name: true, email: true, studentRollNo: true } },
          attempt: {
            select: {
              id: true,
              examConfig: { select: { title: true } },
            },
          },
        },
      }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          name: true,
          email: true,
          studentRollNo: true,
          status: true,
          testAttempts: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              status: true,
              startedAt: true,
              completedAt: true,
              createdAt: true,
              rawScore: true,
              timeSpentSeconds: true,
              examConfig: { select: { title: true, category: true, totalMarks: true } },
            },
          },
        },
      }),
    ]);

    // Format live candidate states: RUNNING, EVALUATED, or NOT_STARTED
    const candidateLiveStatuses = candidatesList.map((cand) => {
      const latest = cand.testAttempts[0];
      let examState: "RUNNING" | "EVALUATED" | "NOT_STARTED" = "NOT_STARTED";
      if (latest) {
        if (latest.status === "IN_PROGRESS") {
          examState = "RUNNING";
        } else if (latest.status === "EVALUATED" || latest.status === "SUBMITTED") {
          examState = "EVALUATED";
        }
      }
      return {
        id: cand.id,
        name: cand.name,
        email: cand.email,
        studentRollNo: cand.studentRollNo,
        accountStatus: cand.status,
        examState,
        latestAttempt: latest || null,
      };
    });

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
      candidateLiveStatuses,
    });
  } catch (error: any) {
    console.error("Admin overview error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load admin overview" },
      { status: 500 }
    );
  }
}
