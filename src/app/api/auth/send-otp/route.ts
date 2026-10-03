import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAndSaveOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, purpose = "LOGIN" } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify user exists if purpose is LOGIN or RESET_PASSWORD
    if (purpose === "LOGIN" || purpose === "RESET_PASSWORD") {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (!user) {
        return NextResponse.json({ error: "No account found with this email address." }, { status: 404 });
      }
    }

    const { otp, expiresAt, cooldownRemainingSeconds } = await createAndSaveOtp(
      normalizedEmail,
      purpose as "SIGNUP" | "LOGIN" | "RESET_PASSWORD"
    );

    await sendOtpEmail(normalizedEmail, otp, purpose as "SIGNUP" | "LOGIN" | "RESET_PASSWORD");

    return NextResponse.json({
      success: true,
      message: `A new 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      expiresAt,
      cooldownRemainingSeconds,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate and dispatch OTP" },
      { status: 400 }
    );
  }
}
