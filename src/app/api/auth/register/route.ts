import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createAndSaveOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword, role = "STUDENT" } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Candidate name is required." }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing && existing.isEmailVerified) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const rollNo = `EF-${Date.now().toString().slice(-6)}`;

    // Create or update unverified user
    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: name.trim(),
            passwordHash,
            role: role === "ADMIN" || role === "TEACHER" ? role : "STUDENT",
          },
        })
      : await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: name.trim(),
            passwordHash,
            role: role === "ADMIN" || role === "TEACHER" ? role : "STUDENT",
            studentRollNo: rollNo,
            isEmailVerified: false,
          },
        });

    // Generate real 6-digit OTP
    const { otp, expiresAt, cooldownRemainingSeconds } = await createAndSaveOtp(normalizedEmail, "SIGNUP");

    // Send actual email via configured email service
    await sendOtpEmail(normalizedEmail, otp, "SIGNUP");

    return NextResponse.json({
      success: true,
      message: "Registration initiated. A 6-digit OTP verification code has been dispatched to your email.",
      email: normalizedEmail,
      userId: user.id,
      expiresAt,
      resendCooldownSeconds: cooldownRemainingSeconds,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process registration" },
      { status: 500 }
    );
  }
}
