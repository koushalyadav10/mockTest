import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const examConfigId = searchParams.get("examConfigId");
    const search = searchParams.get("search")?.trim().toLowerCase();
    const status = searchParams.get("status") || "ALL";
    const isCsvExport = searchParams.get("export") === "csv";

    // Build where clause
    const where: any = {};
    if (examConfigId && examConfigId !== "ALL") {
      where.examConfigId = examConfigId;
    }
    if (status !== "ALL") {
      if (status === "EVALUATED") {
        where.status = { in: ["EVALUATED", "SUBMITTED"] };
      } else {
        where.status = status;
      }
    }

    // Fetch all active exam configs for dropdown filter & stats
    const allExams = await prisma.examConfig.findMany({
      select: {
        id: true,
        title: true,
        code: true,
        category: true,
        totalMarks: true,
        totalQuestions: true,
        totalDurationMinutes: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch attempts
    const attempts = await prisma.testAttempt.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentRollNo: true,
          },
        },
        examConfig: {
          select: {
            id: true,
            title: true,
            code: true,
            category: true,
            totalMarks: true,
            totalQuestions: true,
            totalDurationMinutes: true,
          },
        },
      },
      orderBy: [
        { finalScore: "desc" },
        { timeSpentSeconds: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Compute ranks per exam
    const examScoresMap = new Map<string, typeof attempts>();
    for (const att of attempts) {
      const eId = att.examConfigId;
      if (!examScoresMap.has(eId)) {
        examScoresMap.set(eId, []);
      }
      examScoresMap.get(eId)!.push(att);
    }

    const rankMap = new Map<string, number>();
    examScoresMap.forEach((attList) => {
      // Sort completed attempts first by finalScore descending, then timeSpent ascending
      const sorted = [...attList].sort((a, b) => {
        if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
        return a.timeSpentSeconds - b.timeSpentSeconds;
      });
      sorted.forEach((a, index) => {
        rankMap.set(a.id, index + 1);
      });
    });

    // Filter by search query in memory
    const formattedSubmissions = attempts
      .map((att) => {
        const candidateName = att.user?.name || "Candidate (Unregistered)";
        const candidateEmail = att.user?.email || "N/A";
        const candidateRollNo = att.user?.studentRollNo || att.studentRollNo || "N/A";
        const totalMarks = att.examConfig?.totalMarks || 200;
        const finalScore = Number(att.finalScore.toFixed(2));
        const percentage = totalMarks > 0 ? Number(((finalScore / totalMarks) * 100).toFixed(1)) : 0;
        const rank = rankMap.get(att.id) || 1;

        return {
          id: att.id,
          candidateName,
          candidateEmail,
          candidateRollNo,
          examId: att.examConfigId,
          examTitle: att.examConfig?.title || "Mock Test",
          examCategory: att.examConfig?.category || "SSC",
          status: att.status,
          mode: att.mode,
          finalScore,
          rawScore: Number(att.rawScore.toFixed(2)),
          negativeMarks: Number(att.negativeMarksTotal.toFixed(2)),
          totalMarks,
          percentage,
          accuracy: Number(att.accuracy.toFixed(1)),
          totalQuestions: att.totalQuestions,
          attemptedCount: att.attemptedCount,
          correctCount: att.correctCount,
          incorrectCount: att.incorrectCount,
          unattemptedCount: att.unattemptedCount,
          timeSpentSeconds: att.timeSpentSeconds,
          startedAt: att.startedAt || att.createdAt,
          completedAt: att.completedAt,
          rank,
          violationCount: att.violationCount,
          resultUrl: `/mock/${att.id}/result`,
        };
      })
      .filter((sub) => {
        if (!search) return true;
        return (
          sub.candidateName.toLowerCase().includes(search) ||
          sub.candidateEmail.toLowerCase().includes(search) ||
          sub.candidateRollNo.toLowerCase().includes(search) ||
          sub.examTitle.toLowerCase().includes(search)
        );
      });

    // If CSV export requested, return CSV file
    if (isCsvExport) {
      const csvHeader = [
        "Rank",
        "Candidate Name",
        "Roll No",
        "Email",
        "Exam Title",
        "Category",
        "Status",
        "Score Obtained",
        "Total Marks",
        "Percentage (%)",
        "Accuracy (%)",
        "Attempted",
        "Correct",
        "Incorrect",
        "Unattempted",
        "Time Taken (mins)",
        "Submitted At",
      ].join(",");

      const csvRows = formattedSubmissions.map((s) => {
        const timeMins = Math.round(s.timeSpentSeconds / 60);
        const submittedDate = s.completedAt
          ? new Date(s.completedAt).toISOString()
          : "In Progress";

        return [
          s.rank,
          `"${s.candidateName.replace(/"/g, '""')}"`,
          `"${s.candidateRollNo.replace(/"/g, '""')}"`,
          `"${s.candidateEmail.replace(/"/g, '""')}"`,
          `"${s.examTitle.replace(/"/g, '""')}"`,
          `"${s.examCategory}"`,
          s.status,
          s.finalScore,
          s.totalMarks,
          `${s.percentage}%`,
          `${s.accuracy}%`,
          s.attemptedCount,
          s.correctCount,
          s.incorrectCount,
          s.unattemptedCount,
          timeMins,
          `"${submittedDate}"`,
        ].join(",");
      });

      const csvContent = [csvHeader, ...csvRows].join("\n");
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="exam_candidates_scores_${Date.now()}.csv"`,
        },
      });
    }

    // Compute aggregated per-exam summary statistics
    const examsSummary = allExams.map((exam) => {
      const examAttempts = attempts.filter((a) => a.examConfigId === exam.id);
      const evaluated = examAttempts.filter((a) => a.status === "EVALUATED" || a.status === "SUBMITTED");
      const totalScore = evaluated.reduce((sum, a) => sum + a.finalScore, 0);
      const avgScore = evaluated.length > 0 ? Number((totalScore / evaluated.length).toFixed(1)) : 0;
      const topScore = evaluated.length > 0 ? Math.max(...evaluated.map((a) => a.finalScore)) : 0;

      return {
        id: exam.id,
        title: exam.title,
        code: exam.code,
        category: exam.category,
        totalMarks: exam.totalMarks,
        totalQuestions: exam.totalQuestions,
        totalDurationMinutes: exam.totalDurationMinutes,
        totalAttempts: examAttempts.length,
        evaluatedCount: evaluated.length,
        avgScore,
        topScore,
      };
    });

    // High level summary stats
    const evaluatedTotal = formattedSubmissions.filter(
      (s) => s.status === "EVALUATED" || s.status === "SUBMITTED"
    );
    const overallAvgScore =
      evaluatedTotal.length > 0
        ? Number(
            (
              evaluatedTotal.reduce((sum, s) => sum + s.finalScore, 0) /
              evaluatedTotal.length
            ).toFixed(1)
          )
        : 0;

    const highestScore =
      evaluatedTotal.length > 0
        ? Math.max(...evaluatedTotal.map((s) => s.finalScore))
        : 0;

    const uniqueCandidatesCount = new Set(
      formattedSubmissions.map((s) => s.candidateEmail)
    ).size;

    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions: formattedSubmissions.length,
        evaluatedCount: evaluatedTotal.length,
        uniqueCandidates: uniqueCandidatesCount,
        averageScore: overallAvgScore,
        topScore: highestScore,
      },
      exams: examsSummary,
      submissions: formattedSubmissions,
    });
  } catch (error: any) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch exam candidate submissions" },
      { status: 500 }
    );
  }
}

// DELETE submission/test attempt (Admin Only)
export async function DELETE(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const attemptId = searchParams.get("attemptId");
    const scope = searchParams.get("scope") || "both"; // "both" or "admin"

    if (!attemptId) {
      return NextResponse.json({ error: "Attempt ID is required" }, { status: 400 });
    }

    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        user: { select: { name: true, email: true } },
        examConfig: { select: { title: true } },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Test attempt not found" }, { status: 404 });
    }

    // Delete TestAttempt (cascades to TestResponse and AttemptViolation)
    await prisma.testAttempt.delete({
      where: { id: attemptId },
    });

    // Record in audit log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "ATTEMPT_DELETED",
        entity: "TestAttempt",
        entityId: attemptId,
        details: `Deleted score/attempt of candidate '${attempt.user?.name || attempt.studentRollNo}' for exam '${attempt.examConfig?.title}' (${scope === "both" ? "Deleted for Both" : "Deleted for Admin"})`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Scorecard for ${attempt.user?.name || "candidate"} deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete submission" },
      { status: 500 }
    );
  }
}

