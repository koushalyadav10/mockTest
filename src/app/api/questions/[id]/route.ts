import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        options: true,
        document: true,
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ question });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch question" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      questionText,
      subject,
      topic,
      difficulty,
      explanation,
      options,
      status,
      requiresReview,
    } = body;

    const data: any = {};
    if (questionText !== undefined) data.questionText = questionText;
    if (subject !== undefined) data.subject = subject;
    if (topic !== undefined) data.topic = topic;
    if (difficulty !== undefined) data.difficulty = difficulty;
    if (explanation !== undefined) data.explanation = explanation;
    if (status !== undefined) data.status = status;
    if (requiresReview !== undefined) data.requiresReview = requiresReview;

    // Update Question
    const updated = await prisma.question.update({
      where: { id: params.id },
      data,
    });

    // Update options if provided
    if (options && Array.isArray(options)) {
      for (const opt of options) {
        if (opt.id) {
          await prisma.questionOption.update({
            where: { id: opt.id },
            data: {
              text: opt.text,
              label: opt.label,
              isCorrect: Boolean(opt.isCorrect),
            },
          });
        }
      }
    }

    const fullQuestion = await prisma.question.findUnique({
      where: { id: params.id },
      include: { options: true },
    });

    return NextResponse.json({ success: true, question: fullQuestion });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.question.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete question" },
      { status: 500 }
    );
  }
}
