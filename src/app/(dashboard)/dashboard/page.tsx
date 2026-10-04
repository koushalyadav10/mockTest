"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileCheck2,
  BookOpen,
  Video,
  BarChart2,
  FileText,
  Mail,
  HelpCircle,
  User,
  Clock,
  PlayCircle,
  ArrowRight,
  Flame,
  CheckCircle2,
  ChevronRight,
  Zap,
} from "lucide-react";
import { OneClickMockModal } from "@/components/dashboard/OneClickMockModal";

interface TestCard {
  id: string;
  code: string;
  title: string;
  category: string;
  questions: number;
  marks: number;
  duration: number;
  difficulty: string;
  status: string;
  activeAttemptId?: string;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [availableTests, setAvailableTests] = useState<TestCard[]>([]);
  const [isOneClickModalOpen, setIsOneClickModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    testsAttempted: 0,
    averageScore: 0,
    accuracy: 0,
    bestScore: 0,
  });

  useEffect(() => {
    // Load current user profile
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          if (data.user.role === "ADMIN") {
            router.push("/admin");
            return;
          }
          if (data.user.role === "TEACHER") {
            router.push("/teacher");
            return;
          }
        }
      })
      .catch(() => {});

    // Load available tests and stats
    fetch("/api/exams")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.exams) {
          const mapped: TestCard[] = data.exams.map((e: any) => ({
            id: e.id,
            code: e.code,
            title: e.title,
            category: e.category,
            questions: e.totalQuestions,
            marks: e.totalMarks,
            duration: e.totalDurationMinutes,
            difficulty: e.difficulty || "MEDIUM",
            status: "LIVE",
          }));
          setAvailableTests(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load analytics stats
    fetch("/api/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.stats) {
          setStats({
            testsAttempted: data.stats.testsAttempted || 0,
            averageScore: data.stats.accuracy ? Math.round(data.stats.accuracy * 1.5) : 0,
            accuracy: data.stats.accuracy || 0,
            bestScore: data.stats.bestScore || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleStartTest = async (examConfigId: string) => {
    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examConfigId }),
      });
      const data = await res.json();
      if (data.testAttemptId) {
        router.push(`/mock/${data.testAttemptId}/test`);
      } else {
        router.push("/exams");
      }
    } catch (e) {
      router.push("/exams");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* 1. TOP BANNER: Performance Insights & Analytics Banner (Inspired by Screenshot 3) */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#ffe4bc] via-[#ffd699] to-[#fed38d] border border-amber-300/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/10 text-amber-900 text-xs font-bold">
              <span>National Testing Benchmarks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              AI-Based Analytics &amp; Score Diagnostics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-800" />
                <span>National Percentile</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-800" />
                <span>Cumulative Test Analysis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-800" />
                <span>Strength &amp; Weakness Matrix</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/analytics">
              <button
                type="button"
                className="bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>View Full Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CANDIDATE WELCOME & QUICK STATS (Prompt Section 5) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, {currentUser?.name || "Student"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Roll No: {currentUser?.studentRollNo || "EF-100179719"} &bull; Target: SSC CHSL / UPSI Tier-1
          </p>
        </div>

        <button
          onClick={() => setIsOneClickModalOpen(true)}
          className="bg-[#5a4bda] hover:bg-[#4838cc] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Launch 1-Click Mock</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tests Attempted</span>
          <span className="text-2xl font-mono font-black text-slate-900">{stats.testsAttempted}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Average Score</span>
          <span className="text-2xl font-mono font-black text-blue-600">{stats.averageScore} / 200</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Accuracy</span>
          <span className="text-2xl font-mono font-black text-emerald-600">{stats.accuracy}%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Best Score</span>
          <span className="text-2xl font-mono font-black text-amber-600">{stats.bestScore || "--"}</span>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD SPLIT: Content Cards (Left) & Quick Access (Right) inspired by Screenshot 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Center: Digital Learning Resources & Available Mock Tests (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Learning Resource Blocks (Screenshot 3 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/practice"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Digital Learning Resources</h3>
                  <p className="text-[11px] text-slate-500">Practice questions, formulas &amp; shortcuts</p>
                </div>
              </div>
              <div className="text-xs font-semibold text-teal-700 flex items-center gap-1 pt-2 border-t border-slate-100">
                <span>Access Materials</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href={currentUser?.role === "TEACHER" || currentUser?.role === "ADMIN" ? "/question-bank" : "/exams"}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {currentUser?.role === "TEACHER" || currentUser?.role === "ADMIN" ? "Curated Question Bank" : "Official CBT Mock Tests"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {currentUser?.role === "TEACHER" || currentUser?.role === "ADMIN" ? "10,000+ bilingual questions with KaTeX" : "Full-length timed mock tests with sectional timers"}
                  </p>
                </div>
              </div>
              <div className="text-xs font-semibold text-blue-700 flex items-center gap-1 pt-2 border-t border-slate-100">
                <span>{currentUser?.role === "TEACHER" || currentUser?.role === "ADMIN" ? "Browse Question Bank" : "Explore Mock Tests"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>

          {/* Available Mock Tests (Prompt Section 5) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Available Mock Tests</h3>
                <p className="text-xs text-slate-500">Real CBT blueprints with live timer countdown</p>
              </div>
              <Link href="/exams" className="text-xs font-bold text-teal-700 hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {availableTests.map((test) => (
                <div
                  key={test.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {test.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{test.title}</h4>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>{test.questions} Questions</span>
                      <span>&bull;</span>
                      <span>{test.marks} Marks</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {test.duration} Minutes
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartTest(test.id)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Start Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Utility Cards (4 Cols, matching Screenshot 3 right column) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Test Analytics Quick Card */}
          <Link
            href="/analytics"
            className="block p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider">Test Analytics</h4>
                <p className="text-xs text-slate-600 mt-1">Check national percentile &amp; accuracy</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Card 2: Prep Articles */}
          <Link
            href="/practice"
            className="block p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Prep Articles</h4>
                <p className="text-xs text-slate-600 mt-1">Previous year solved question papers</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Card 3: Inbox */}
          <Link
            href="/login"
            className="block p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 transition-all shadow-2xs group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Inbox &amp; Notifications</h4>
                <p className="text-xs text-slate-600 mt-1">Real-time OTP verification logs &amp; reminders</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Card 4: Help and Feedback */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider">Help and Feedback</h4>
                <p className="text-xs text-slate-600 mt-1">Connect with candidate support desk</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 5: Candidate Profile */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider">Candidate Profile</h4>
                <p className="text-xs text-slate-600 mt-1">{currentUser?.email || "student@examforge.ai"}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Mock Modal */}
      <OneClickMockModal
        isOpen={isOneClickModalOpen}
        onClose={() => setIsOneClickModalOpen(false)}
      />
    </div>
  );
}
