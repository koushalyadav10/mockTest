import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const actionFilter = req.nextUrl.searchParams.get("action");
    const limit = Math.min(100, Math.max(10, parseInt(req.nextUrl.searchParams.get("limit") || "50", 10)));

    const where: any = {};
    if (actionFilter && actionFilter !== "ALL") {
      where.action = actionFilter;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

// DELETE clear all audit logs history (Admin Only)
export async function DELETE(req: NextRequest) {
  try {
    const { errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    await prisma.auditLog.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Administrative audit trail history cleared successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to clear audit trail" },
      { status: 500 }
    );
  }
}

