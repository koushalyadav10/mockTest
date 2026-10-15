import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { sendEmail } from "@/lib/auth/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const examConfigId = searchParams.get("examConfigId");
    const search = searchParams.get("search")?.trim().toLowerCase();
    const status = searchParams.get("status") || "ALL";
    const date = searchParams.get("date")?.trim(); // e.g. "2026-10-15"
    const dateRange = searchParams.get("dateRange") || "all"; // "today" | "yesterday" | "week" | "month" | "all"
    const sort = searchParams.get("sort") || "recent"; // "recent" | "score"
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(200, Math.max(1, parseInt(limitParam, 10))) : 50;
    const isCsvExport = searchParams.get("export") === "csv";
    const candidateId = searchParams.get("candidateId");

    // If requesting a specific candidate's complete performance history
    if (candidateId) {
      const candidate = await prisma.user.findUnique({
        where: { id: candidateId },
        select: {
          id: true,
          name: true,
          email: true,
          studentRollNo: true,
          avatarUrl: true,
          city: true,
          gender: true,
          academicClass: true,
          board: true,
          targetExam: true,
          totalTestsAttended: true,
          highestScore: true,
          starsEarned: true,
          createdAt: true,
        },
      });

      if (!candidate) {
        return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
      }

      const candidateAttempts = await prisma.testAttempt.findMany({
        where: { userId: candidateId },
        include: {
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
        orderBy: { createdAt: "desc" },
      });

      const evaluated = candidateAttempts.filter((a) => a.status === "EVALUATED" || a.status === "SUBMITTED");
      const avgScore = evaluated.length > 0
        ? Number((evaluated.reduce((sum, a) => sum + a.finalScore, 0) / evaluated.length).toFixed(1))
        : 0;
      const avgAccuracy = evaluated.length > 0
        ? Number((evaluated.reduce((sum, a) => sum + a.accuracy, 0) / evaluated.length).toFixed(1))
        : 0;

      return NextResponse.json({
        success: true,
        candidate,
        stats: {
          totalAttempts: candidateAttempts.length,
          evaluatedCount: evaluated.length,
          averageScore: avgScore,
          averageAccuracy: avgAccuracy,
          highestScore: candidate.highestScore,
        },
        attempts: candidateAttempts.map((a) => ({
          id: a.id,
          examTitle: a.examConfig?.title || "Examination",
          category: a.examConfig?.category || "SSC",
          status: a.status,
          finalScore: Number(a.finalScore.toFixed(2)),
          totalMarks: a.examConfig?.totalMarks || 200,
          accuracy: Number(a.accuracy.toFixed(1)),
          correctCount: a.correctCount,
          incorrectCount: a.incorrectCount,
          unattemptedCount: a.unattemptedCount,
          timeSpentSeconds: a.timeSpentSeconds,
          startedAt: a.startedAt || a.createdAt,
          completedAt: a.completedAt,
        })),
      });
    }

    // Build where clause
    const where: any = {};
    if (examConfigId && examConfigId !== "ALL") {
      where.examConfigId = examConfigId;
    }
    if (status !== "ALL") {
      if (status === "EVALUATED") {
        where.status = { in: ["EVALUATED", "SUBMITTED"] };
      } else if (status === "RUNNING") {
        where.status = { in: ["RUNNING", "IN_PROGRESS", "INSTRUCTIONS"] };
      } else {
        where.status = status;
      }
    }

    // Date Filtering (Calendar back-date or dateRange)
    const now = new Date();
    if (date) {
      // Exact calendar date filter (YYYY-MM-DD)
      const dayStart = new Date(`${date}T00:00:00.000Z`);
      const dayEnd = new Date(`${date}T23:59:59.999Z`);
      where.createdAt = {
        gte: dayStart,
        lte: dayEnd,
      };
    } else if (dateRange === "today") {
      const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
      where.createdAt = { gte: todayStart };
    } else if (dateRange === "yesterday") {
      const yStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 0, 0, 0));
      const yEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 23, 59, 59, 999));
      where.createdAt = { gte: yStart, lte: yEnd };
    } else if (dateRange === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: weekAgo };
    } else if (dateRange === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: monthAgo };
    }

    // Fetch active exams for filter
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

    // Primary sorting: recent (default) or score (leaderboard)
    const orderByClause: any[] = sort === "score"
      ? [{ finalScore: "desc" }, { timeSpentSeconds: "asc" }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];

    // Fetch attempts (limited to limit, e.g. 50 recent)
    const attempts = await prisma.testAttempt.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentRollNo: true,
            avatarUrl: true,
            city: true,
            academicClass: true,
            targetExam: true,
            totalTestsAttended: true,
            highestScore: true,
            starsEarned: true,
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
      orderBy: orderByClause,
      take: isCsvExport ? undefined : limit,
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
      const sorted = [...attList].sort((a, b) => {
        if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
        return a.timeSpentSeconds - b.timeSpentSeconds;
      });
      sorted.forEach((a, index) => {
        rankMap.set(a.id, index + 1);
      });
    });

    // Map formatted submissions
    const formattedSubmissions = attempts
      .map((att) => {
        const candidateId = att.user?.id || null;
        const candidateName = att.user?.name || "Candidate (Unregistered)";
        const candidateEmail = att.user?.email || "N/A";
        const candidateRollNo = att.user?.studentRollNo || att.studentRollNo || "N/A";
        const candidateAvatar = att.user?.avatarUrl || null;
        const candidateTargetExam = att.user?.targetExam || null;
        const candidateClass = att.user?.academicClass || null;
        const candidateCity = att.user?.city || null;
        const totalMarks = att.examConfig?.totalMarks || 200;
        const finalScore = Number(att.finalScore.toFixed(2));
        const percentage = totalMarks > 0 ? Number(((finalScore / totalMarks) * 100).toFixed(1)) : 0;
        const rank = rankMap.get(att.id) || 1;

        return {
          id: att.id,
          candidateId,
          candidateName,
          candidateEmail,
          candidateRollNo,
          candidateAvatar,
          candidateTargetExam,
          candidateClass,
          candidateCity,
          candidateTotalTests: att.user?.totalTestsAttended ?? 0,
          candidateHighestScore: att.user?.highestScore ?? 0,
          candidateStars: att.user?.starsEarned ?? 0,
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
          startedAt: (att.startedAt || att.createdAt).toISOString(),
          completedAt: att.completedAt ? att.completedAt.toISOString() : null,
          createdAt: att.createdAt.toISOString(),
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
          "Content-Disposition": `attachment; filename="exam_history_scores_${Date.now()}.csv"`,
        },
      });
    }

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
      exams: allExams.map((exam) => {
        const examAttempts = attempts.filter((a) => a.examConfigId === exam.id);
        return {
          id: exam.id,
          title: exam.title,
          code: exam.code,
          category: exam.category,
          totalMarks: exam.totalMarks,
          totalQuestions: exam.totalQuestions,
          totalDurationMinutes: exam.totalDurationMinutes,
          totalAttempts: examAttempts.length,
        };
      }),
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

// POST: Email Official Scorecard to Candidate (Admin / Teacher Only)
export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { attemptId, customSubject, customMessage } = body;

    if (!attemptId) {
      return NextResponse.json({ error: "Attempt ID is required" }, { status: 400 });
    }

    const attempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        user: true,
        examConfig: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Test attempt not found" }, { status: 404 });
    }

    const candidateEmail = attempt.user?.email;
    if (!candidateEmail || !candidateEmail.includes("@")) {
      return NextResponse.json(
        { error: "Candidate does not have a valid email address on record." },
        { status: 400 }
      );
    }

    const candidateName = attempt.user?.name || "Candidate";
    const rollNo = attempt.studentRollNo || attempt.user?.studentRollNo || "EF-Candidate";
    const examTitle = attempt.examConfig?.title || "Examination";
    const totalMarks = attempt.examConfig?.totalMarks || 200;
    const finalScore = Number(attempt.finalScore.toFixed(2));
    const percentage = totalMarks > 0 ? Number(((finalScore / totalMarks) * 100).toFixed(1)) : 0;
    const accuracy = Number(attempt.accuracy.toFixed(1));
    const mins = Math.round(attempt.timeSpentSeconds / 60);

    const baseUrl = process.env.NEXTAUTH_URL || "http://13.235.234.124";
    const resultUrl = `${baseUrl}/mock/${attempt.id}/result`;

    const subject =
      customSubject ||
      `Official Scorecard: ${examTitle} — Roll No: ${rollNo}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #94a3b8; font-size: 13px; font-mono; }
    .content { padding: 28px 24px; }
    .candidate-box { background: #f1f5f9; border-radius: 12px; padding: 14px 18px; margin-bottom: 22px; display: flex; justify-content: space-between; }
    .score-banner { background: #047857; color: white; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 22px; }
    .score-val { font-size: 38px; font-weight: 900; line-height: 1; margin-bottom: 4px; font-family: monospace; }
    .metrics-grid { display: table; width: 100%; border-collapse: separate; border-spacing: 8px; margin-bottom: 24px; }
    .metric-cell { display: table-cell; width: 25%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 8px; text-align: center; }
    .metric-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 4px; }
    .metric-val { font-size: 18px; font-weight: 800; font-family: monospace; }
    .cta-btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; }
    .footer { text-align: center; padding: 20px 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>ExamForge AI &bull; Examination Board</h1>
      <p>OFFICIAL COMPUTER BASED TEST (CBT) SCORECARD</p>
    </div>
    <div class="content">
      <div class="candidate-box">
        <div>
          <strong style="font-size: 15px; color: #0f172a;">${candidateName}</strong><br>
          <span style="font-size: 12px; color: #64748b; font-family: monospace;">Roll: ${rollNo}</span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 12px; color: #64748b;">Exam:</span><br>
          <strong style="font-size: 13px; color: #0f172a;">${examTitle}</strong>
        </div>
      </div>

      ${customMessage ? `<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; color: #1e3a8a;">${customMessage}</div>` : ""}

      <div class="score-banner">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin-bottom: 4px;">Score Achieved</div>
        <div class="score-val">${finalScore} <span style="font-size: 18px; font-weight: normal; opacity: 0.85;">/ ${totalMarks}</span></div>
        <div style="font-size: 14px; font-weight: 700;">Percentage: ${percentage}% &bull; Status: Qualified</div>
      </div>

      <div class="metrics-grid">
        <div class="metric-cell">
          <div class="metric-title">Accuracy</div>
          <div class="metric-val" style="color: #0f172a;">${accuracy}%</div>
        </div>
        <div class="metric-cell">
          <div class="metric-title">Correct</div>
          <div class="metric-val" style="color: #047857;">+${attempt.correctCount}</div>
        </div>
        <div class="metric-cell">
          <div class="metric-title">Incorrect</div>
          <div class="metric-val" style="color: #dc2626;">-${attempt.incorrectCount}</div>
        </div>
        <div class="metric-cell">
          <div class="metric-title">Duration</div>
          <div class="metric-val" style="color: #0f172a;">${mins}m</div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 10px;">
        <a href="${resultUrl}" class="cta-btn">View Detailed Solutions &amp; Question Review &rarr;</a>
      </div>
    </div>
    <div class="footer">
      This is an automated verified electronic report issued by ExamForge AI.<br>
      Examination Session ID: <code>${attempt.id}</code>
    </div>
  </div>
</body>
</html>
    `;

    const emailResult = await sendEmail({
      to: candidateEmail,
      subject,
      html,
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "ATTEMPT_SCORECARD_EMAILED",
        entity: "TestAttempt",
        entityId: attemptId,
        details: `Official Scorecard emailed to '${candidateName}' (${candidateEmail}) for '${examTitle}' (Score: ${finalScore}/${totalMarks}). Provider: ${emailResult.provider}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Official Scorecard dispatched successfully to candidate (${candidateEmail})!`,
      emailResult,
    });
  } catch (error: any) {
    console.error("Error emailing scorecard:", error);
    return NextResponse.json(
      { error: error.message || "Failed to email scorecard to candidate" },
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
