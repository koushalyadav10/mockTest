"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  BookOpen,
  FileCheck2,
  PlayCircle,
  Upload,
  PlusCircle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Search,
  Settings,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = () => {
    fetch("/api/admin/overview")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) setData(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const stats = data?.stats || {
    totalStudents: 1,
    totalTeachers: 1,
    totalQuestions: 15,
    totalTests: 6,
    totalAttempts: 1,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* 1. ADMIN HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1 border border-purple-200">
            <span>Platform Controller &bull; Full RBAC Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage question banks, automated OCR ingestion pipelines, exam blueprints, and proctoring audit trails
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/upload">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:border-slate-400 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-teal-600" />
              <span>Upload PDF / OCR</span>
            </button>
          </Link>

          <Link href="/admin/test-builder">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-teal-400" />
              <span>Test Builder</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS GRID (Requirement 33) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.totalStudents}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Active Candidates</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Teachers</span>
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.totalTeachers}
          </div>
          <div className="text-[11px] text-purple-700 font-medium">Faculty &amp; Creators</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Question Bank</span>
            <BookOpen className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.totalQuestions}
          </div>
          <div className="text-[11px] text-teal-700 font-medium">Curated Items</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Exams &amp; Tests</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.totalTests}
          </div>
          <div className="text-[11px] text-amber-800 font-medium">Live Blueprints</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Attempts</span>
            <PlayCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.totalAttempts}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Submissions Scored</div>
        </div>
      </div>

      {/* 3. QUICK WORKSPACE ACTION TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/upload"
          className="p-5 rounded-2xl border border-teal-200 bg-teal-50/50 hover:bg-teal-50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-3 shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Multi-Stage OCR Ingestion</h3>
            <p className="text-xs text-slate-600 mt-1">
              Upload PDF or scan images. 15-stage AI pipeline parses formulas, Devanagari Hindi, and options.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 flex items-center gap-1 pt-4">
            Open OCR Reviewer &rarr;
          </span>
        </Link>

        <Link
          href="/admin/test-builder"
          className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Test Builder &amp; Randomizer</h3>
            <p className="text-xs text-slate-600 mt-1">
              Construct multi-section mock exams with sectional timers, negative marking, and difficulty balance.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-800 flex items-center gap-1 pt-4">
            Build New Mock Test &rarr;
          </span>
        </Link>

        <Link
          href="/question-bank"
          className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Question Bank Curation</h3>
            <p className="text-xs text-slate-600 mt-1">
              Approve, edit, filter, or reject draft questions. Trace source page and original documents.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-800 flex items-center gap-1 pt-4">
            Manage Question Bank &rarr;
          </span>
        </Link>
      </div>

      {/* 4. REAL-TIME ATTEMPTS AUDIT & ANTI-CHEAT MONITORING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Attempts (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Recent Candidate Test Sessions</h3>
            <span className="text-[11px] font-mono text-slate-400">Authoritative Server Logs</span>
          </div>

          <div className="divide-y divide-slate-100">
            {(!data?.recentAttempts || data.recentAttempts.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No mock test sessions recorded yet.
              </div>
            ) : (
              data.recentAttempts.map((att: any) => (
                <div key={att.id} className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-900">
                      {att.user?.name || "Student Candidate"}{" "}
                      <span className="font-mono text-slate-400 text-[10px]">
                        ({att.studentRollNo || att.user?.studentRollNo || "EF-100179719"})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {att.examConfig?.title} &bull; Mode: {att.mode}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                        att.status === "EVALUATED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {att.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {new Date(att.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Anti-Cheat Violations & Security Audits (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-slate-900 text-sm">Focus Warnings &amp; Violations</h3>
            </div>
            <span className="text-[11px] font-mono text-red-600 font-bold">Anti-Cheat</span>
          </div>

          <div className="divide-y divide-slate-100">
            {(!data?.recentViolations || data.recentViolations.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No focus violations logged yet. Test integrity intact.
              </div>
            ) : (
              data.recentViolations.map((v: any) => (
                <div key={v.id} className="p-4 flex items-center justify-between gap-3 text-xs bg-red-50/30">
                  <div>
                    <div className="font-bold text-red-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>{v.type} (Violation #{v.count})</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      {v.student?.name || "Candidate"} &bull; Q.{v.questionNumber || "--"} &bull; {v.sectionName || "General"}
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 text-right">
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
