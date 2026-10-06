import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAuth(req, ["ADMIN", "TEACHER"]);
    if (errorResponse) return errorResponse;

    const violations = await prisma.attemptViolation.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
      include: {
        student: { select: { id: true, name: true, email: true, studentRollNo: true } },
        attempt: {
          select: {
            id: true,
            status: true,
            examConfig: { select: { title: true } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      violations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch violations" },
      { status: 500 }
    );
  }
}

// DELETE all violations (Admin Only)
export async function DELETE(req: NextRequest) {
  try {
    const { errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    await prisma.attemptViolation.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Proctoring violation logs cleared successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to clear violations" },
      { status: 500 }
    );
  }
}
