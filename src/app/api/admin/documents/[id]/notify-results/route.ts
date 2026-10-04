import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { sendEmail } from "@/lib/auth/email";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const documentId = params.id;
    const document = await prisma.uploadedDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const { customSubject, customMessage, targetEmail } = body;

    const publishedExamId = document.publishedExamId;

    const orConditions: any[] = [{ examConfig: { documentId } }];
    if (publishedExamId) {
      orConditions.push({ examConfigId: publishedExamId });
    }

    // Find all submitted attempts
    const attempts = await prisma.testAttempt.findMany({
      where: {
        status: "EVALUATED",
        OR: orConditions,
      },
      include: {
        user: true,
        examConfig: true,
      },
      orderBy: { completedAt: "desc" },
    });

    if (attempts.length === 0) {
      return NextResponse.json(
        { error: "No completed candidate test attempts found to notify." },
        { status: 400 }
      );
    }

    let sentCount = 0;

    // If targetEmail is specified, dispatch the most recent evaluated attempt to that candidate
    if (targetEmail && targetEmail.includes("@")) {
      const att = attempts[0];
      const candidateEmail = targetEmail.trim();
      const candidateName = att.user?.name || "Candidate";
      const totalMarks = att.examConfig?.totalMarks || 200;
      const finalScore = att.finalScore || 0;
      const percentage = totalMarks > 0 ? ((finalScore / totalMarks) * 100).toFixed(1) : "0.0";
      const rollNo = att.studentRollNo || att.user?.studentRollNo || "EF-100179719";

      const subject =
        customSubject ||
        `Official Examination Scorecard: ${att.examConfig?.title || document.fileName} - Roll No: ${rollNo}`;

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f6f8fa; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
    .content { padding: 28px; }
    .score-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .score-num { font-size: 36px; font-weight: 900; color: #15803d; font-family: monospace; }
    .meta-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    .meta-table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
    .meta-table td:first-child { font-weight: bold; color: #64748b; width: 40%; }
    .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px;">ExamForge.AI Examination Authority</h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Official Computer Based Test (CBT) Scorecard</p>
    </div>
    <div class="content">
      <p>Dear <strong>${candidateName}</strong>,</p>
      <p>${customMessage || "You have successfully completed the examination. Your official evaluated scorecard is published below:"}</p>
      
      <div class="score-box">
        <div style="font-size: 12px; text-transform: uppercase; font-weight: bold; color: #166534; letter-spacing: 1px;">Marks Secured</div>
        <div class="score-num">${finalScore} / ${totalMarks}</div>
        <div style="font-size: 13px; font-weight: 600; color: #15803d; margin-top: 4px;">Percentage: ${percentage}% &bull; Accuracy: ${att.accuracy ? att.accuracy.toFixed(1) + "%" : "--"}</div>
      </div>

      <table class="meta-table">
        <tr><td>Candidate Email:</td><td><strong>${candidateEmail}</strong></td></tr>
        <tr><td>Roll Number:</td><td><strong>${rollNo}</strong></td></tr>
        <tr><td>Examination:</td><td>${att.examConfig?.title || document.fileName}</td></tr>
        <tr><td>Correct Responses:</td><td>${att.correctCount || 0}</td></tr>
        <tr><td>Incorrect Responses:</td><td>${att.incorrectCount || 0}</td></tr>
        <tr><td>Unattempted:</td><td>${att.unattemptedCount || 0}</td></tr>
        <tr><td>Time Taken:</td><td>${Math.round((att.timeSpentSeconds || 0) / 60)} minutes</td></tr>
        <tr><td>Evaluation Status:</td><td><strong style="color: #15803d;">OFFICIALLY EVALUATED</strong></td></tr>
      </table>

      <div style="margin-top: 24px; text-align: center;">
        <a href="http://localhost:3000/mock/${att.id}/result" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">View Full Breakdown & Solution Key &rarr;</a>
      </div>
    </div>
    <div class="footer">
      ExamForge AI Assessment Engine &bull; This is an authentic computer-generated scorecard.
    </div>
  </div>
</body>
</html>
`;

      await sendEmail({
        to: candidateEmail,
        subject,
        html,
        text: `Dear ${candidateName}, your score for ${att.examConfig?.title || document.fileName} is ${finalScore} / ${totalMarks} (${percentage}%). View result at http://localhost:3000/mock/${att.id}/result`,
      });

      sentCount = 1;
    } else {
      for (const att of attempts) {
        const candidateEmail = att.user?.email;
        if (!candidateEmail || !candidateEmail.includes("@")) continue;

        // Skip sending to admin email automatically unless specifically targeted
        if (candidateEmail.toLowerCase() === user?.email?.toLowerCase() && attempts.length > 1) {
          continue;
        }

      const candidateName = att.user?.name || "Candidate";
      const totalMarks = att.examConfig?.totalMarks || 200;
      const finalScore = att.finalScore || 0;
      const percentage = totalMarks > 0 ? ((finalScore / totalMarks) * 100).toFixed(1) : "0.0";
      const rollNo = att.studentRollNo || att.user?.studentRollNo || "EF-100179719";

      const subject =
        customSubject ||
        `Official Examination Scorecard: ${att.examConfig?.title || document.fileName} - Roll No: ${rollNo}`;

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f6f8fa; margin: 0; padding: 20px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
    .content { padding: 28px; }
    .score-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .score-num { font-size: 36px; font-weight: 900; color: #15803d; font-family: monospace; }
    .meta-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    .meta-table td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
    .meta-table td:first-child { font-weight: bold; color: #64748b; width: 40%; }
    .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px;">ExamForge.AI Examination Authority</h2>
      <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Official Computer Based Test (CBT) Scorecard</p>
    </div>
    <div class="content">
      <p>Dear <strong>${candidateName}</strong>,</p>
      <p>${customMessage || "You have successfully completed the examination. Your official evaluated scorecard is published below:"}</p>
      
      <div class="score-box">
        <div style="font-size: 12px; text-transform: uppercase; font-weight: bold; color: #166534; letter-spacing: 1px;">Marks Secured</div>
        <div class="score-num">${finalScore} / ${totalMarks}</div>
        <div style="font-size: 13px; font-weight: 600; color: #15803d; margin-top: 4px;">Percentage: ${percentage}% &bull; Accuracy: ${att.accuracy ? att.accuracy.toFixed(1) + "%" : "--"}</div>
      </div>

      <table class="meta-table">
        <tr><td>Roll Number:</td><td><strong>${rollNo}</strong></td></tr>
        <tr><td>Examination:</td><td>${att.examConfig?.title || document.fileName}</td></tr>
        <tr><td>Correct Responses:</td><td>${att.correctCount || 0}</td></tr>
        <tr><td>Incorrect Responses:</td><td>${att.incorrectCount || 0}</td></tr>
        <tr><td>Unattempted:</td><td>${att.unattemptedCount || 0}</td></tr>
        <tr><td>Time Taken:</td><td>${Math.round((att.timeSpentSeconds || 0) / 60)} minutes</td></tr>
        <tr><td>Evaluation Status:</td><td><strong style="color: #15803d;">OFFICIALLY EVALUATED</strong></td></tr>
      </table>

      <div style="margin-top: 24px; text-align: center;">
        <a href="http://localhost:3000/mock/${att.id}/result" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">View Full Breakdown & Solution Key &rarr;</a>
      </div>
    </div>
    <div class="footer">
      ExamForge AI Assessment Engine &bull; This is an authentic computer-generated scorecard.
    </div>
  </div>
</body>
</html>
`;

      await sendEmail({
        to: candidateEmail,
        subject,
        html,
        text: `Dear ${candidateName}, your score for ${att.examConfig?.title || document.fileName} is ${finalScore} / ${totalMarks} (${percentage}%). View result at http://localhost:3000/mock/${att.id}/result`,
      });

      sentCount++;
    }
  }

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "RESULTS_EMAILED",
        entity: "UploadedDocument",
        entityId: document.id,
        details: `Dispatched official scorecard emails to ${sentCount} candidates for paper '${document.fileName}'`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Scorecards dispatched to ${sentCount} candidates successfully.`,
      dispatchedCount: sentCount,
    });
  } catch (error: any) {
    console.error("Notify results error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to dispatch result notifications" },
      { status: 500 }
    );
  }
}
