import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const search = req.nextUrl.searchParams.get("search") || "";
    const roleFilter = req.nextUrl.searchParams.get("role");
    const statusFilter = req.nextUrl.searchParams.get("status");

    const where: any = {};
    if (roleFilter && roleFilter !== "ALL") where.role = roleFilter;
    if (statusFilter && statusFilter !== "ALL") where.status = statusFilter;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { studentRollNo: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        department: true,
        studentRollNo: true,
        isEmailVerified: true,
        createdAt: true,
        _count: {
          select: {
            testAttempts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { user: adminUser, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { userId, status, role, department } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const dataToUpdate: any = {};
    if (status && ["ACTIVE", "SUSPENDED", "DEACTIVATED"].includes(status)) {
      dataToUpdate.status = status;
    }
    if (role && ["STUDENT", "TEACHER", "ADMIN"].includes(role)) {
      dataToUpdate.role = role;
    }
    if (department !== undefined) {
      dataToUpdate.department = department;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    // Record in Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminUser?.userId,
        userEmail: adminUser?.email,
        action: "USER_MODIFIED",
        entity: "User",
        entityId: updated.id,
        details: `Updated user ${updated.email}: status=${updated.status}, role=${updated.role}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `User ${updated.email} updated successfully.`,
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
