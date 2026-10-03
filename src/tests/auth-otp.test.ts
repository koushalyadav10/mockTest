import { describe, it, expect, beforeEach } from "vitest";
import { signJwt, verifyJwt } from "../lib/auth/jwt";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import { generate6DigitOtp, hashOtp, verifyOtpHash } from "../lib/auth/otp";

describe("Real Authentication & Cryptographic OTP Engine", () => {
  it("generates a genuine 6-digit numeric OTP", () => {
    for (let i = 0; i < 20; i++) {
      const otp = generate6DigitOtp();
      expect(otp).toMatch(/^\d{6}$/);
      const val = parseInt(otp, 10);
      expect(val).toBeGreaterThanOrEqual(100000);
      expect(val).toBeLessThanOrEqual(999999);
    }
  });

  it("hashes OTP with salt and verifies hash correctly", () => {
    const otp = "849201";
    const hash = hashOtp(otp);
    expect(hash).toBeDefined();
    expect(hash.length).toBe(64); // SHA-256 hex string
    expect(hash).not.toBe(otp); // Never stores plain OTP

    // Verify correct OTP matches
    expect(verifyOtpHash("849201", hash)).toBe(true);

    // Verify incorrect OTP fails
    expect(verifyOtpHash("849202", hash)).toBe(false);
    expect(verifyOtpHash("123456", hash)).toBe(false);
  });

  it("hashes password with salt and verifies password using scrypt", () => {
    const password = "StudentSecurePassword@2026";
    const hash = hashPassword(password);
    expect(hash).toContain(":");

    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("WrongPassword", hash)).toBe(false);
  });

  it("signs and verifies JWT with payload and expiration", () => {
    const payload = {
      userId: "usr_10291",
      email: "aspirant@examforge.ai",
      name: "Rohan Verma",
      role: "STUDENT" as const,
      studentRollNo: "EF-10291",
    };

    const token = signJwt(payload, 3600);
    expect(token).toBeDefined();
    expect(token.split(".").length).toBe(3);

    const verified = verifyJwt(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe("usr_10291");
    expect(verified?.email).toBe("aspirant@examforge.ai");
    expect(verified?.role).toBe("STUDENT");
    expect(verified?.studentRollNo).toBe("EF-10291");

    // Invalid signature token
    const tampered = token.slice(0, -5) + "abcde";
    expect(verifyJwt(tampered)).toBeNull();
  });
});
