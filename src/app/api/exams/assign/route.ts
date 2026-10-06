import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { examId, subtopicFilter, examFilter, shuffle, instantFeedback } = body;

    const sourceExam = await prisma.examConfig.findUnique({
      where: { id: examId },
    });

    if (!sourceExam) {
      return NextResponse.json({ error: "Source exam not found" }, { status: 404 });
    }

    // Count matching questions
    const whereClause: any = {};
    if (sourceExam.documentId) {
      whereClause.documentId = sourceExam.documentId;
    } else {
      whereClause.status = "APPROVED";
    }
    if (subtopicFilter && subtopicFilter !== "ALL") {
      whereClause.subtopic = { contains: subtopicFilter };
    }
    if (examFilter && examFilter !== "ALL") {
      whereClause.questionText = { contains: examFilter };
    }

    const questionCount = await prisma.question.count({ where: whereClause });
    if (questionCount === 0) {
      return NextResponse.json(
        { error: "No questions match the selected filter criteria." },
        { status: 400 }
      );
    }

    const rawTitle = sourceExam.title.replace(/^SSC Maths \(Aditya Ranjan\) — Chapter \d+:\s*/i, "");
    const topicName = rawTitle.split("(")[0].trim();
    const filterParts: string[] = [];
    if (subtopicFilter && subtopicFilter !== "ALL") filterParts.push(subtopicFilter);
    if (examFilter && examFilter !== "ALL") filterParts.push(examFilter);
    if (shuffle) filterParts.push("Shuffled Mix");

    const filterTag = filterParts.length > 0 ? filterParts.join(" • ") : "Full Chapter Practice";

    const assignedTitle = `📢 [Assigned] ${topicName} — ${filterTag}`;
    const uniqueCode = `ASSIGNED_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newExam = await prisma.examConfig.create({
      data: {
        code: uniqueCode,
        title: assignedTitle,
        description: `Official practice test assigned by ${user?.name || "Admin"}. Topic: ${topicName} | Filters: ${filterTag}. Total Questions: ${questionCount}.`,
        category: sourceExam.category || "SSC",
        mode: instantFeedback ? "PRACTICE" : "MOCK",
        status: "PUBLISHED",
        availability: "ALWAYS",
        documentId: sourceExam.documentId,
        totalQuestions: questionCount,
        totalMarks: questionCount * (sourceExam.marksPerCorrect || 2.0),
        totalDurationMinutes: Math.max(10, Math.ceil(questionCount * 1.2)),
        marksPerCorrect: sourceExam.marksPerCorrect || 2.0,
        negativeMarks: sourceExam.negativeMarks || 0.5,
        questionShuffle: Boolean(shuffle),
        optionShuffle: Boolean(shuffle),
        instructions: JSON.stringify({
          subtopicFilter: subtopicFilter !== "ALL" ? subtopicFilter : undefined,
          examFilter: examFilter !== "ALL" ? examFilter : undefined,
          shuffle: Boolean(shuffle),
          instantFeedback: Boolean(instantFeedback),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      exam: newExam,
      questionCount,
      message: `Test "${assignedTitle}" has been successfully assigned and made available to all students!`,
    });
  } catch (error: any) {
    console.error("Failed to assign test:", error);
    return NextResponse.json(
      { error: error.message || "Failed to assign test for candidates" },
      { status: 500 }
    );
  }
}
