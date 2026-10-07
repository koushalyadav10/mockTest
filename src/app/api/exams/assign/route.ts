import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const {
      examId,
      customTitle,
      subtopicFilter,
      examFilter,
      shuffle,
      instantFeedback,
      marksPerCorrect,
      negativeMarks,
      allotmentDays,
      holdResults = true,
      rangeFrom,
      rangeTo,
    } = body;

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

    const totalAvailable = await prisma.question.count({ where: whereClause });
    if (totalAvailable === 0) {
      return NextResponse.json(
        { error: "No questions match the selected filter criteria." },
        { status: 400 }
      );
    }

    let effectiveRangeFrom: number | undefined;
    let effectiveRangeTo: number | undefined;
    let questionCount = totalAvailable;

    const rawTitle = sourceExam.title.replace(/^SSC Maths \(Aditya Ranjan\) — Chapter \d+:\s*/i, "");
    const topicName = rawTitle.split("(")[0].trim();
    const filterParts: string[] = [];

    if (rangeFrom !== undefined && rangeTo !== undefined && rangeFrom !== null && rangeTo !== null) {
      effectiveRangeFrom = Math.max(1, Number(rangeFrom));
      effectiveRangeTo = Math.min(totalAvailable, Number(rangeTo));
      if (effectiveRangeTo >= effectiveRangeFrom) {
        questionCount = effectiveRangeTo - effectiveRangeFrom + 1;
        filterParts.push(`Q.${effectiveRangeFrom}-Q.${effectiveRangeTo}`);
      }
    }

    if (subtopicFilter && subtopicFilter !== "ALL") filterParts.push(subtopicFilter);
    if (examFilter && examFilter !== "ALL") filterParts.push(examFilter);
    if (shuffle) filterParts.push("Shuffled Mix");

    const filterTag = filterParts.length > 0 ? filterParts.join(" • ") : "Full Chapter Practice";

    let assignedTitle = "";
    if (customTitle && String(customTitle).trim()) {
      const clean = String(customTitle).trim();
      assignedTitle = clean.includes("[Assigned]") ? clean : `📢 [Assigned] ${clean}`;
    } else {
      assignedTitle = `📢 [Assigned] ${topicName} — ${filterTag}`;
    }
    const uniqueCode = `ASSIGNED_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Calculate schedule dates if allotment days specified
    const now = new Date();
    const isScheduled = Boolean(allotmentDays && allotmentDays > 0);
    const startDate = isScheduled ? now : null;
    const endDate = isScheduled ? new Date(now.getTime() + Number(allotmentDays) * 24 * 60 * 60 * 1000) : null;

    const effectiveMarksPerCorrect = marksPerCorrect !== undefined ? Number(marksPerCorrect) : (sourceExam.marksPerCorrect || 2.0);
    const effectiveNegativeMarks = negativeMarks !== undefined ? Number(negativeMarks) : (sourceExam.negativeMarks || 0.5);

    const newExam = await prisma.examConfig.create({
      data: {
        code: uniqueCode,
        title: assignedTitle,
        description: `Official practice test assigned by ${user?.name || "Admin"}. Topic: ${topicName} | Filters: ${filterTag}. Total Questions: ${questionCount}. ${
          isScheduled ? `Complete within ${allotmentDays} day(s).` : "Unlimited access."
        }`,
        category: "ASSIGNED",
        mode: "EXAM",
        status: "PUBLISHED",
        availability: isScheduled ? "SCHEDULED" : "ALWAYS",
        startDate,
        endDate,
        scheduledStatus: "LIVE",
        documentId: sourceExam.documentId,
        totalQuestions: questionCount,
        totalMarks: questionCount * effectiveMarksPerCorrect,
        totalDurationMinutes: Math.max(10, Math.ceil(questionCount * 1.0)),
        marksPerCorrect: effectiveMarksPerCorrect,
        negativeMarks: effectiveNegativeMarks,
        questionShuffle: Boolean(shuffle),
        optionShuffle: Boolean(shuffle),
        instructions: JSON.stringify({
          subtopicFilter: subtopicFilter !== "ALL" ? subtopicFilter : undefined,
          examFilter: examFilter !== "ALL" ? examFilter : undefined,
          rangeFrom: effectiveRangeFrom,
          rangeTo: effectiveRangeTo,
          shuffle: Boolean(shuffle),
          instantFeedback: false, // Students NEVER get instant answers during assigned CBT test
          holdResults: Boolean(holdResults),
          isAssigned: true,
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
