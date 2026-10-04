import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const documentId = params.id;
    const document = await prisma.uploadedDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    // Find all test attempts associated with this document's published exam OR where questions belong to this document
    const publishedExamId = document.publishedExamId;

    const orConditions: any[] = [{ examConfig: { documentId } }];
    if (publishedExamId) {
      orConditions.push({ examConfigId: publishedExamId });
    }

    const attempts = await prisma.testAttempt.findMany({
      where: {
        OR: orConditions,
      },
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
            totalMarks: true,
            totalQuestions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const isCsvExport = req.nextUrl.searchParams.get("export") === "csv";

    // Format list
    const candidateResults = attempts.map((att, idx) => {
      const totalMarks = att.examConfig?.totalMarks || 200;
      const rawScore = att.finalScore || 0;
      const percentage = totalMarks > 0 ? ((rawScore / totalMarks) * 100).toFixed(1) : "0.0";
      const accuracy = att.accuracy ? `${att.accuracy.toFixed(1)}%` : "--";

      return {
        rank: idx + 1,
        attemptId: att.id,
        rollNo: att.studentRollNo || att.user?.studentRollNo || `EF-${att.id.slice(0, 6)}`,
        name: att.user?.name || "Candidate",
        email: att.user?.email || "candidate@examforge.ai",
        score: rawScore,
        totalMarks,
        percentage: `${percentage}%`,
        accuracy,
        status: att.status,
        submittedAt: att.completedAt ? att.completedAt.toISOString() : att.createdAt.toISOString(),
      };
    });

    if (isCsvExport) {
      // Build CSV
      const headers = ["Rank", "Roll No", "Candidate Name", "Email", "Score", "Total Marks", "Percentage", "Accuracy", "Status", "Submitted At"];
      const rows = candidateResults.map((r) => [
        r.rank,
        `"${r.rollNo}"`,
        `"${r.name}"`,
        `"${r.email}"`,
        r.score,
        r.totalMarks,
        `"${r.percentage}"`,
        `"${r.accuracy}"`,
        `"${r.status}"`,
        `"${r.submittedAt || '--'}"`,
      ]);

      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="Exam_Results_${document.fileName.replace(/[^a-zA-Z0-9]/g, "_")}.csv"`,
        },
      });
    }

    const scores = candidateResults.map((r) => r.score);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
    const topScore = scores.length > 0 ? Math.max(...scores) : 0;

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        fileName: document.fileName,
        isPublic: document.isPublic,
        publishedExamId: document.publishedExamId,
      },
      stats: {
        totalAttempts: candidateResults.length,
        averageScore: Number(avgScore),
        highestScore: topScore,
      },
      results: candidateResults,
    });
  } catch (error: any) {
    console.error("Fetch exam results error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch candidate results" },
      { status: 500 }
    );
  }
}
