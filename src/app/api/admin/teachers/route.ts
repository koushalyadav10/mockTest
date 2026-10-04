import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { sendEmail } from "@/lib/auth/email";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        department: true,
        createdAt: true,
        _count: {
          select: {
            uploadedDocuments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const invites = await prisma.teacherInvite.findMany({
      where: { acceptedAt: null },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      teachers,
      pendingInvites: invites,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load teachers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, errorResponse } = requireAuth(req, ["ADMIN"]);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { name, email, department = "General Examination", password } = body;

    if (!name || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Name and valid email are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.role === "TEACHER") {
        return NextResponse.json({ error: "A teacher with this email already exists." }, { status: 409 });
      }

      // Upgrade existing user to TEACHER
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: "TEACHER",
          department,
          status: "ACTIVE",
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user?.userId,
          userEmail: user?.email,
          action: "USER_ROLE_CHANGED",
          entity: "User",
          entityId: updated.id,
          details: `Promoted user ${updated.email} to TEACHER role in ${department}`,
        },
      }).catch(() => {});

      return NextResponse.json({
        success: true,
        message: `Account ${updated.email} has been updated to TEACHER role.`,
        teacher: updated,
      });
    }

    // Direct password or generated initial password
    const initialPassword = password || `Teacher@${crypto.randomInt(1000, 9999)}`;
    const passwordHash = hashPassword(initialPassword);

    const newTeacher = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "TEACHER",
        status: "ACTIVE",
        department,
        isEmailVerified: true,
        mustChangePassword: true,
      },
    });

    // Send invitation email
    await sendEmail({
      to: normalizedEmail,
      subject: "Welcome to ExamForge.AI - Faculty Account Provisioned",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2>Welcome to ExamForge.AI Faculty Portal</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>You have been provisioned as a <strong>Teacher / Faculty Member</strong> in department <strong>${department}</strong> by administration.</p>
          <p>Your login credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${normalizedEmail}</li>
            <li><strong>Temporary Password:</strong> <code style="background: #f1f5f9; padding: 2px 6px; font-weight: bold;">${initialPassword}</code></li>
          </ul>
          <p>Please log in at <a href="http://localhost:3000/login">http://localhost:3000/login</a> and change your password.</p>
        </div>
      `,
      text: `Hello ${name}, your ExamForge Teacher account is ready. Email: ${normalizedEmail}, Temporary Password: ${initialPassword}`,
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        userEmail: user?.email,
        action: "TEACHER_CREATED",
        entity: "User",
        entityId: newTeacher.id,
        details: `Created new teacher account for ${newTeacher.email} (${department})`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Teacher ${newTeacher.name} created successfully. Login credentials dispatched to ${newTeacher.email}.`,
      teacher: newTeacher,
      initialPassword, // returned for admin convenience in dev
    });
  } catch (error: any) {
    console.error("Create teacher error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create teacher account" },
      { status: 500 }
    );
  }
}
