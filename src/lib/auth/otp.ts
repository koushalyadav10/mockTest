import crypto from "crypto";
import { prisma } from "../db";

const OTP_SECRET = process.env.AUTH_SECRET || "examforge-otp-secret-salt-key-2026";
const RESEND_COOLDOWN_SECONDS = 60;
const EXPIRATION_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function generate6DigitOtp(): string {
  // Cryptographically secure 6-digit number between 100000 and 999999
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

export function hashOtp(otp: string): string {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(otp.trim())
    .digest("hex");
}

export function verifyOtpHash(enteredOtp: string, storedHash: string): boolean {
  const enteredHash = hashOtp(enteredOtp);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(enteredHash, "hex"),
      Buffer.from(storedHash, "hex")
    );
  } catch (e) {
    return false;
  }
}

export async function createAndSaveOtp(email: string, type: "SIGNUP" | "LOGIN" | "RESET_PASSWORD" = "SIGNUP"): Promise<{
  otp: string;
  expiresAt: Date;
  cooldownRemainingSeconds: number;
}> {
  const normalizedEmail = email.trim().toLowerCase();

  // Check resend cooldown from the most recent OTP created for this email
  const recentOtp = await prisma.otpToken.findFirst({
    where: {
      email: normalizedEmail,
      type,
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentOtp) {
    const elapsedSeconds = Math.floor((Date.now() - recentOtp.createdAt.getTime()) / 1000);
    if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
      const waitTime = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
      throw new Error(`Please wait ${waitTime} seconds before requesting a new OTP.`);
    }
  }

  const otp = generate6DigitOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(Date.now() + EXPIRATION_MINUTES * 60 * 1000);

  // Invalidate any previously unused OTPs for this email and type
  await prisma.otpToken.updateMany({
    where: {
      email: normalizedEmail,
      type,
      usedAt: null,
    },
    data: {
      usedAt: new Date(0), // marked as expired/invalidated
    },
  });

  await prisma.otpToken.create({
    data: {
      email: normalizedEmail,
      otpHash,
      type,
      expiresAt,
      attempts: 0,
    },
  });

  return {
    otp,
    expiresAt,
    cooldownRemainingSeconds: RESEND_COOLDOWN_SECONDS,
  };
}

export async function verifyOtpToken(
  email: string,
  enteredOtp: string,
  type: "SIGNUP" | "LOGIN" | "RESET_PASSWORD" = "SIGNUP"
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const tokenRecord = await prisma.otpToken.findFirst({
    where: {
      email: normalizedEmail,
      type,
      usedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!tokenRecord) {
    return { success: false, error: "No active OTP found. Please request a new code." };
  }

  // Check expiration
  if (new Date() > tokenRecord.expiresAt) {
    return { success: false, error: "OTP has expired. Please request a new code." };
  }

  // Check maximum attempts
  if (tokenRecord.attempts >= MAX_ATTEMPTS) {
    // Invalidate
    await prisma.otpToken.update({
      where: { id: tokenRecord.id },
      data: { usedAt: new Date(0) },
    });
    return { success: false, error: "Maximum verification attempts exceeded. Please request a new code." };
  }

  // Verify hash
  const isValid = verifyOtpHash(enteredOtp, tokenRecord.otpHash);

  if (!isValid) {
    // Increment attempts
    await prisma.otpToken.update({
      where: { id: tokenRecord.id },
      data: { attempts: { increment: 1 } },
    });
    const remaining = MAX_ATTEMPTS - (tokenRecord.attempts + 1);
    return {
      success: false,
      error: `Invalid OTP code. ${remaining > 0 ? `${remaining} attempts remaining.` : "Please request a new code."}`,
    };
  }

  // Mark as verified & used
  await prisma.otpToken.update({
    where: { id: tokenRecord.id },
    data: { usedAt: new Date() },
  });

  return { success: true };
}
