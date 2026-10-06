import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

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

    return NextResponse.json({
      success: true,
      message: `Official results for "${exam.title}" are now published and accessible to all students!`,
      exam: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to publish exam results" },
      { status: 500 }
    );
  }
}
