import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { sendEmail } from "@/lib/auth/email";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const exam = await prisma.examConfig.findUnique({
      where: { id: params.id },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam configuration not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { emailAll = false, customSubject, customMessage } = body;

    let parsedInstructions: any = {};
    if (exam.instructions) {
      try {
        parsedInstructions = JSON.parse(exam.instructions);
      } catch (e) {}
    }

    parsedInstructions.holdResults = false;
    parsedInstructions.resultsPublishedAt = new Date().toISOString();
    parsedInstructions.publishedBy = user?.name || "Admin";

    const updated = await prisma.examConfig.update({
      where: { id: params.id },
      data: {
        instructions: JSON.stringify(parsedInstructions),
      },
    });

    let emailedCount = 0;

    // If batch email to all candidates is requested
    if (emailAll) {
      const attempts = await prisma.testAttempt.findMany({
        where: {
          examConfigId: params.id,
          status: { in: ["EVALUATED", "SUBMITTED"] },
        },
        include: {
          user: { select: { id: true, name: true, email: true, studentRollNo: true } },
        },
        orderBy: { finalScore: "desc" },
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://15.207.89.195:3000";

      for (let i = 0; i < attempts.length; i++) {
        const att = attempts[i];
        const candidateEmail = att.user?.email;
        if (!candidateEmail || !candidateEmail.includes("@")) continue;

        const candidateName = att.user?.name || "Candidate";
        const totalMarks = exam.totalMarks || 200;
        const finalScore = Number(att.finalScore.toFixed(2));
        const percentage = totalMarks > 0 ? ((finalScore / totalMarks) * 100).toFixed(1) : "0.0";
        const rollNo = att.studentRollNo || att.user?.studentRollNo || "EF-Candidate";
        const rank = i + 1;
        const resultUrl = `${baseUrl}/mock/${att.id}/result`;

        const subject =
          customSubject ||
          `Official CBT Scorecard: ${exam.title} - Roll No: ${rollNo}`;

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f6f8fa; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
    .header { background: #0f172a; color: #ffffff; padding: 26px; text-align: center; }
    .content { padding: 28px; }
    .score-box { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 22px; text-align: center; margin: 22px 0; }
    .score-num { font-size: 38px; font-weight: 900; color: #15803d; font-family: monospace; letter-spacing: -1px; }
    .stats-grid { display: flex; justify-content: space-around; margin-top: 14px; padding-top: 12px; border-top: 1px solid #dcfce7; text-align: center; }
    .stat-item { flex: 1; }
    .stat-label { font-size: 10px; color: #166534; font-weight: bold; text-transform: uppercase; }
    .stat-val { font-size: 15px; font-weight: 800; font-family: monospace; color: #14532d; }
    .meta-table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 13px; }
    .meta-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
    .meta-table td:first-child { font-weight: bold; color: #64748b; width: 38%; }
    .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 13px; margin-top: 20px; }
    .footer { background: #f8fafc; padding: 18px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px; letter-spacing: -0.5px;">ExamForge.AI Examination Authority</h2>
      <p style="margin: 5px 0 0; font-size: 12px; color: #94a3b8;">Official Computer Based Test (CBT) Scorecard</p>
    </div>
    <div class="content">
      <p style="font-size: 15px; margin-top: 0;">Dear <strong>${candidateName}</strong>,</p>
      <p style="font-size: 13px; line-height: 1.6; color: #475569;">
        ${customMessage || `The official results for <strong>${exam.title}</strong> have been published. Your verified scorecard is ready below:`}
      </p>
      
      <div class="score-box">
        <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #166534; letter-spacing: 1px;">Marks Secured</div>
        <div class="score-num">${finalScore} <span style="font-size: 18px; font-weight: normal; color: #64748b;">/ ${totalMarks}</span></div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Percentage</div>
            <div class="stat-val">${percentage}%</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Accuracy</div>
            <div class="stat-val">${att.accuracy ? att.accuracy.toFixed(1) + "%" : "--"}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Merit Rank</div>
            <div class="stat-val">#${rank}</div>
          </div>
        </div>
      </div>

      <table class="meta-table">
        <tr>
          <td>Candidate Name</td>
          <td><strong>${candidateName}</strong></td>
        </tr>
        <tr>
          <td>Roll Number</td>
          <td><strong style="font-family: monospace;">${rollNo}</strong></td>
        </tr>
        <tr>
          <td>Examination Paper</td>
          <td>${exam.title}</td>
        </tr>
        <tr>
          <td>Correct / Wrong</td>
          <td><span style="color: #16a34a; font-weight: bold;">+${att.correctCount} Correct</span> / <span style="color: #dc2626; font-weight: bold;">-${att.incorrectCount} Wrong</span></td>
        </tr>
        <tr>
          <td>Unattempted</td>
          <td>${att.unattemptedCount} Questions</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${resultUrl}" class="btn" target="_blank">View Detailed Solutions &amp; Analysis &rarr;</a>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0;">This is an authoritative computer-generated scorecard issued by ExamForge AI.</p>
      <p style="margin: 4px 0 0;">Strict CBT Proctoring &amp; TCS-standard evaluation verified.</p>
    </div>
  </div>
</body>
</html>
        `;

        await sendEmail({
          to: candidateEmail,
          subject,
          html,
          text: `Scorecard for ${exam.title}: Score ${finalScore}/${totalMarks} (${percentage}%). View at ${resultUrl}`,
        }).catch((e) => console.error("Batch email error for", candidateEmail, e));

        emailedCount++;
      }

      // Record in audit log
      await prisma.auditLog.create({
        data: {
          userId: user?.userId,
          userEmail: user?.email,
          action: "RESULTS_PUBLISHED_AND_EMAILED",
          entity: "ExamConfig",
          entityId: params.id,
          details: `Published results and emailed scorecards to ${emailedCount} candidates for '${exam.title}'`,
        },
      }).catch(() => {});
    } else {
      // Record in audit log
      await prisma.auditLog.create({
        data: {
          userId: user?.userId,
          userEmail: user?.email,
          action: "RESULTS_PUBLISHED",
          entity: "ExamConfig",
          entityId: params.id,
          details: `Published results on platform for exam '${exam.title}'`,
        },
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: emailAll
        ? `Results published and scorecards emailed to ${emailedCount} candidates successfully!`
        : `Official results for "${exam.title}" are now published and accessible to all students!`,
      emailedCount,
      exam: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to publish exam results" },
      { status: 500 }
    );
  }
}
