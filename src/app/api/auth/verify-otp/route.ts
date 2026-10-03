import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOtpToken } from "@/lib/auth/otp";
import { createSessionCookie } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, purpose = "SIGNUP" } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP code are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify OTP against hashed database token
    const verification = await verifyOtpToken(
      normalizedEmail,
      otp.trim(),
      purpose as "SIGNUP" | "LOGIN" | "RESET_PASSWORD"
    );

    if (!verification.success) {
      return NextResponse.json({ error: verification.error || "Invalid OTP code." }, { status: 400 });
    }

    // OTP is valid! Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User record not found." }, { status: 404 });
    }

    // Mark email verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });

    // Determine role-based redirect
    let redirectUrl = "/dashboard";
    if (updatedUser.role === "ADMIN") redirectUrl = "/admin";
    else if (updatedUser.role === "TEACHER") redirectUrl = "/teacher";

    // Create session cookie
    const cookieHeader = createSessionCookie({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role as "STUDENT" | "TEACHER" | "ADMIN",
      studentRollNo: updatedUser.studentRollNo,
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful! Account verified.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        studentRollNo: updatedUser.studentRollNo,
        isEmailVerified: updatedUser.isEmailVerified,
      },
      redirectUrl,
    });

    response.headers.set("Set-Cookie", cookieHeader);
    return response;
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
