import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { sampleBlueprintQuestions, ChapterAllocation } from "@/lib/exam/blueprintSampler";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionUser(req);
    if (session && session.role !== "ADMIN" && session.role !== "TEACHER") {
      return NextResponse.json({ error: "Access denied. Admin or Teacher role required." }, { status: 403 });
    }

    const body = await req.json();
    const { allocations = [], orderingMode = "JUMBLED" } = body;

    if (!Array.isArray(allocations) || allocations.length === 0) {
      return NextResponse.json({ error: "At least one chapter with question quota is required." }, { status: 400 });
    }

    const result = await sampleBlueprintQuestions(allocations as ChapterAllocation[], orderingMode);

    return NextResponse.json({
      success: true,
      totalQuestions: result.questions.length,
      subjectBreakdown: result.subjectBreakdown,
      questions: result.questions,
    });
  } catch (error: any) {
    console.error("Blueprint preview error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate preview" }, { status: 500 });
  }
}
