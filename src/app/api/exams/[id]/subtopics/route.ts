import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await prisma.examConfig.findUnique({
      where: { id: params.id },
      select: { id: true, documentId: true },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const whereClause: any = exam.documentId
      ? { documentId: exam.documentId }
      : { status: "APPROVED" };

    const distinctSubtopics = await prisma.question.findMany({
      where: {
        ...whereClause,
        subtopic: { not: null },
      },
      select: { subtopic: true },
      distinct: ["subtopic"],
      orderBy: { subtopic: "asc" },
    });

    const subtopics = distinctSubtopics
      .map((s) => s.subtopic)
      .filter((s): s is string => Boolean(s && s.trim().length > 0));

    return NextResponse.json({ subtopics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
