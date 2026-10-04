"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Inbox,
  X,
  BookOpen,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Mode: "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD"
  const [authMode, setAuthMode] = useState<"LOGIN" | "SIGNUP" | "FORGOT_PASSWORD">("LOGIN");
  // Login type: "PASSWORD" | "OTP"
  const [loginMethod, setLoginMethod] = useState<"PASSWORD" | "OTP">("PASSWORD");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("student@examforge.ai");
  const [password, setPassword] = useState("Student@123");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP Verification state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Live Dev Mailbox drawer state
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [recentEmails, setRecentEmails] = useState<any[]>([]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Fetch Dev Mailbox
  const fetchDevMailbox = async () => {
    try {
      const res = await fetch("/api/auth/dev-mailbox");
      const data = await res.json();
      if (data.latestEmails) setRecentEmails(data.latestEmails);
    } catch (e) {}
  };

  useEffect(() => {
    fetchDevMailbox();
  }, [isOtpStep]);

  // Handle Quick Demo Account Selection
  const selectDemoAccount = (role: "STUDENT" | "TEACHER" | "ADMIN") => {
    setAuthMode("LOGIN");
    setLoginMethod("PASSWORD");
    setIsOtpStep(false);
    setErrorMessage(null);
    if (role === "STUDENT") {
      setEmail("student@examforge.ai");
      setPassword("Student@123");
    } else if (role === "TEACHER") {
      setEmail("teacher@examforge.ai");
      setPassword("Teacher@123");
    } else if (role === "ADMIN") {
      setEmail("admin@examforge.ai");
      setPassword("Admin@123");
    }
  };

  // Handle OTP digit inputs
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    const updated = [...otpDigits];
    updated[index] = clean.slice(-1);
    setOtpDigits(updated);

    // Auto-advance to next box
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Submit Password Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (loginMethod === "OTP") {
        // Request OTP for login
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, purpose: "LOGIN" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send login OTP");

        setIsOtpStep(true);
        setCooldown(data.cooldownRemainingSeconds || 60);
        setSuccessMessage(`6-digit OTP dispatched to ${email}. Please verify.`);
        fetchDevMailbox();
        return;
      }

      // Password Login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.requiresOtp) {
        setIsOtpStep(true);
        setCooldown(60);
        setSuccessMessage(data.message || "Email unverified. OTP dispatched.");
        fetchDevMailbox();
        return;
      }

      setSuccessMessage("Authentication successful! Redirecting...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/dashboard");
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Submit Signup
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setIsOtpStep(true);
      setCooldown(data.resendCooldownSeconds || 60);
      setSuccessMessage(data.message || "Verification code sent to your email.");
      fetchDevMailbox();
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Submission
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the OTP code.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: fullOtp,
          purpose: authMode === "SIGNUP" ? "SIGNUP" : "LOGIN",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      setSuccessMessage("Account successfully verified! Loading dashboard...");
      setTimeout(() => {
        router.push(data.redirectUrl || "/dashboard");
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          purpose: authMode === "SIGNUP" ? "SIGNUP" : "LOGIN",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend OTP");

      setCooldown(data.cooldownRemainingSeconds || 60);
      setSuccessMessage("A fresh 6-digit code has been dispatched to your email.");
      fetchDevMailbox();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-3 sm:p-6 font-sans relative">
      {/* Main 2-Column Authentication Card inspired by Reference Screenshot 2 */}
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left Column: Teal/Cyan Brand Area (Exact Reference UX) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#a5e8e4] to-[#7bd8d2] p-8 sm:p-10 flex flex-col justify-between text-slate-800 relative overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/20 pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-white/25 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm">
                EF
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                ExamForge<span className="text-teal-900">.AI</span>
              </span>
            </Link>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug pt-4">
              Comprehensive hub for all your preparation needs
            </h2>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Experience authentic Computer-Based Test (CBT) environments for SSC, UP Police, UPSI, Railway &amp; Banking examinations.
            </p>
          </div>

          {/* Quick Pre-configured Selector for Testing (Only in LOGIN mode, strictly hidden in SIGNUP) */}
          {authMode === "LOGIN" && (
            <div className="relative z-10 pt-6 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Pre-configured Test Accounts:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => selectDemoAccount("STUDENT")}
                  className="px-2.5 py-1 rounded-md bg-white/80 hover:bg-white text-slate-900 text-xs font-semibold shadow-2xs border border-white/60 transition-all"
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => selectDemoAccount("TEACHER")}
                  className="px-2.5 py-1 rounded-md bg-white/80 hover:bg-white text-slate-900 text-xs font-semibold shadow-2xs border border-white/60 transition-all"
                >
                  👨‍🏫 Teacher
                </button>
                <button
                  type="button"
                  onClick={() => selectDemoAccount("ADMIN")}
                  className="px-2.5 py-1 rounded-md bg-white/80 hover:bg-white text-slate-900 text-xs font-semibold shadow-2xs border border-white/60 transition-all"
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          )}

          {/* Bottom Navigation Links */}
          <div className="relative z-10 pt-6 border-t border-teal-600/20 flex items-center justify-between text-xs font-medium text-slate-800">
            {authMode === "LOGIN" ? (
              <div>
                New User?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("SIGNUP");
                    setIsOtpStep(false);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-teal-950 underline hover:text-black"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("LOGIN");
                    setIsOtpStep(false);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-teal-950 underline hover:text-black"
                >
                  Login
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setAuthMode("FORGOT_PASSWORD");
                setIsOtpStep(false);
                setErrorMessage(null);
              }}
              className="text-slate-700 hover:text-black underline"
            >
              Forgot Password
            </button>
          </div>
        </div>

        {/* Right Column: Clean Form & OTP Verification */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          {/* Header Title */}
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isOtpStep
                ? "Enter Verification Code"
                : authMode === "SIGNUP"
                ? "Create Candidate Account"
                : authMode === "FORGOT_PASSWORD"
                ? "Reset Your Password"
                : "Candidate Login"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isOtpStep
                ? `Enter the 6-digit code sent to ${email}`
                : authMode === "SIGNUP"
                ? "Fill in your credentials to receive an authentication OTP"
                : "Login with your email and password or One-Time Password"}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. OTP INPUT STEP */}
          {isOtpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-teal-950">
                  <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verification Code Dispatched</span>
                </div>
                <p className="text-[12px] text-teal-800 leading-relaxed">
                  A 6-digit OTP has been sent to <strong>{email}</strong>. Please check your Gmail / Email inbox (also check the Spam or Updates folder).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Enter 6-Digit OTP Code
                </label>
                <div className="flex items-center justify-between gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-box-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className="w-12 h-14 text-center text-xl font-mono font-bold border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200/50 outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Resend Cooldown Counter (Reference Screenshot 2) */}
              <div className="flex items-center justify-between text-xs">
                {cooldown > 0 ? (
                  <span className="text-red-500 font-semibold font-mono">
                    Resend otp in {String(Math.floor(cooldown / 60)).padStart(2, "0")}:
                    {String(cooldown % 60).padStart(2, "0")}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-teal-600 font-bold hover:underline"
                  >
                    Resend OTP Code
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Change Email
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>Verify &amp; Continue</span>
              </button>
            </form>
          ) : authMode === "SIGNUP" ? (
            /* 2. SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>Send 6-Digit OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* 3. LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Method Switcher: Password vs OTP */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold mb-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod("PASSWORD")}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    loginMethod === "PASSWORD" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("OTP")}
                  className={`flex-1 py-1.5 rounded-md transition-all ${
                    loginMethod === "OTP" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                >
                  OTP Direct Login
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="candidate@examforge.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {loginMethod === "PASSWORD" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setAuthMode("FORGOT_PASSWORD")}
                      className="text-[11px] text-teal-600 hover:underline font-semibold"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-black hover:bg-slate-900 text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{loginMethod === "OTP" ? "Send Login OTP" : "Login"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
