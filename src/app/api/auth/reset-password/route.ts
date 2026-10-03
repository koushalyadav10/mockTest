import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyOtpToken } from "@/lib/auth/otp";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword, confirmPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP, and new password are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify OTP
    const verification = await verifyOtpToken(normalizedEmail, otp.trim(), "RESET_PASSWORD");
    if (!verification.success) {
      return NextResponse.json({ error: verification.error || "Invalid OTP code." }, { status: 400 });
    }

    // Update password
    const passwordHash = hashPassword(newPassword);
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to reset password." },
      { status: 500 }
    );
  }
}
