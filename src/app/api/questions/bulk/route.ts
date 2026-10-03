import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      questionIds,
      action, // "APPROVE" | "REJECT" | "DELETE" | "UPDATE_DIFFICULTY" | "UPDATE_TOPIC" | "UPDATE_SUBJECT"
      payload,
    } = body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json(
        { error: "No question IDs provided" },
        { status: 400 }
      );
    }

    switch (action) {
      case "APPROVE": {
        const updated = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: {
            status: "APPROVED",
            requiresReview: false,
          },
        });
        return NextResponse.json({
          success: true,
          action,
          count: updated.count,
          message: `Successfully approved ${updated.count} questions.`,
        });
      }

      case "REJECT": {
        const updated = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: {
            status: "REJECTED",
          },
        });
        return NextResponse.json({
          success: true,
          action,
          count: updated.count,
          message: `Successfully rejected ${updated.count} questions.`,
        });
      }

      case "DELETE": {
        const deleted = await prisma.question.deleteMany({
          where: { id: { in: questionIds } },
        });
        return NextResponse.json({
          success: true,
          action,
          count: deleted.count,
          message: `Successfully deleted ${deleted.count} questions.`,
        });
      }

      case "UPDATE_DIFFICULTY": {
        if (!payload?.difficulty || !["EASY", "MEDIUM", "HARD"].includes(payload.difficulty)) {
          return NextResponse.json({ error: "Invalid difficulty value" }, { status: 400 });
        }
        const updated = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { difficulty: payload.difficulty },
        });
        return NextResponse.json({
          success: true,
          action,
          count: updated.count,
          message: `Updated difficulty to ${payload.difficulty} for ${updated.count} questions.`,
        });
      }

      case "UPDATE_SUBJECT": {
        if (!payload?.subject) {
          return NextResponse.json({ error: "Subject is required" }, { status: 400 });
        }
        const updated = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { subject: payload.subject },
        });
        return NextResponse.json({
          success: true,
          action,
          count: updated.count,
          message: `Updated subject for ${updated.count} questions.`,
        });
      }

      case "UPDATE_TOPIC": {
        if (!payload?.topic) {
          return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }
        const updated = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { topic: payload.topic },
        });
        return NextResponse.json({
          success: true,
          action,
          count: updated.count,
          message: `Updated topic to "${payload.topic}" for ${updated.count} questions.`,
        });
      }

      default:
        return NextResponse.json(
          { error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Bulk question action error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process bulk operation" },
      { status: 500 }
    );
  }
}
