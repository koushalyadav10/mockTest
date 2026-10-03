import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionCookie } from "@/lib/auth/session";
import { createAndSaveOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/auth/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    // If email is not yet verified, trigger OTP and require verification
    if (!user.isEmailVerified) {
      try {
        const { otp } = await createAndSaveOtp(normalizedEmail, "SIGNUP");
        await sendOtpEmail(normalizedEmail, otp, "SIGNUP");
      } catch (e) {
        // Cooldown might be active
      }
      return NextResponse.json({
        requiresOtp: true,
        email: normalizedEmail,
        message: "Your email address is not yet verified. A 6-digit OTP has been dispatched to your email.",
      });
    }

    // Role-based destination
    let redirectUrl = "/dashboard";
    if (user.role === "ADMIN") redirectUrl = "/admin";
    else if (user.role === "TEACHER") redirectUrl = "/teacher";

    // Create session cookie
    const cookieHeader = createSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "STUDENT" | "TEACHER" | "ADMIN",
      studentRollNo: user.studentRollNo,
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentRollNo: user.studentRollNo,
        isEmailVerified: user.isEmailVerified,
      },
      redirectUrl,
    });

    response.headers.set("Set-Cookie", cookieHeader);
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process login" },
      { status: 500 }
    );
  }
}
