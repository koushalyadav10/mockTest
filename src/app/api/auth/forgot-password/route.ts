import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAndSaveOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "No user found with this email." }, { status: 404 });
    }

    const { otp, expiresAt, cooldownRemainingSeconds } = await createAndSaveOtp(normalizedEmail, "RESET_PASSWORD");
    await sendOtpEmail(normalizedEmail, otp, "RESET_PASSWORD");

    return NextResponse.json({
      success: true,
      message: "Password reset OTP dispatched to your registered email.",
      email: normalizedEmail,
      expiresAt,
      cooldownRemainingSeconds,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to dispatch password reset OTP" },
      { status: 400 }
    );
  }
}
