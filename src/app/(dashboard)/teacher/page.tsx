"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Upload,
  PlusCircle,
  BarChart3,
  Clock,
  ArrowRight,
  FileCheck2,
  FileText,
  CheckCircle2,
  PlayCircle,
  Eye,
  RefreshCw,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TeacherDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalTests: 0,
    totalAttempts: 0,
    uploadedPapers: 0,
  });
  const [documents, setDocuments] = useState<any[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/overview").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/documents").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([overview, docsData]) => {
        if (overview?.stats) {
          setStats({
            totalQuestions: overview.stats.totalQuestions || 0,
            totalTests: overview.stats.totalTests || 0,
            totalAttempts: overview.stats.totalAttempts || 0,
            uploadedPapers: docsData?.documents?.length || 0,
          });
        }
        if (docsData?.documents) {
          setDocuments(docsData.documents.slice(0, 4));
        }
        if (overview?.recentAttempts) {
          setRecentAttempts(overview.recentAttempts.slice(0, 5));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1 border border-purple-200">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            <span>Faculty &bull; Teacher Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Teacher Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create question sets, upload papers for OCR extraction, build mock tests, and review candidate performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/upload">
            <button className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              <span>Upload Paper (OCR)</span>
            </button>
          </Link>
          <Link href="/admin/test-builder">
            <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-teal-400" />
              <span>Create New Test</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Real Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Curated Questions</span>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.totalQuestions}
          </div>
          <div className="text-[11px] text-purple-700 font-medium">In Question Bank</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Uploaded Papers</span>
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.uploadedPapers}
          </div>
          <div className="text-[11px] text-teal-700 font-medium">Processed PDF/Images</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Exam Blueprints</span>
            <FileCheck2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.totalTests}
          </div>
          <div className="text-[11px] text-blue-700 font-medium">Active Mock Tests</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Student Attempts</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
            {stats.totalAttempts}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">Submissions Scored</div>
        </div>
      </div>

      {/* 3 Main Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/upload"
          className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Upload &amp; Extract Questions</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload PDF or image files. Review parsed question text, LaTeX equations, options, and explanations.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 pt-4 flex items-center gap-1">
            Open Upload Center &rarr;
          </span>
        </Link>

        <Link
          href="/admin/test-builder"
          className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Test Builder</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Assemble mock tests with custom sections, sectional timing, marks per question, and negative marking.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 pt-4 flex items-center gap-1">
            Launch Test Builder &rarr;
          </span>
        </Link>

        <Link
          href="/question-bank"
          className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Question Bank</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curate, edit, and tag questions by exam, subject, topic, and difficulty. Inspect candidate results.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 pt-4 flex items-center gap-1">
            Manage Question Bank &rarr;
          </span>
        </Link>
      </div>

      {/* Two-Column Grid: Uploaded Papers & Recent Student Test Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uploaded Papers */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Uploaded Papers</h3>
              <p className="text-[11px] text-slate-500">Official papers undergoing OCR extraction &amp; curation</p>
            </div>
            <Link href="/question-bank" className="text-xs font-bold text-purple-700 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading papers...</div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No papers uploaded yet. Click Upload Paper above.
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 line-clamp-1">{doc.fileName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {doc.questionCount} Questions &bull; {doc.pageCount} Pages
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.isPublic ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Live Public
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Draft
                      </span>
                    )}
                    <Link href={`/question-bank`}>
                      <button className="p-1.5 text-slate-500 hover:text-purple-700 rounded-lg hover:bg-purple-50">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Student Attempts */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Student Performance Monitoring</h3>
              <p className="text-[11px] text-slate-500">Live test submissions and score distributions</p>
            </div>
            <Link href="/analytics" className="text-xs font-bold text-teal-700 hover:underline">
              Student Performance Analytics &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading submissions...</div>
            ) : recentAttempts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No mock test submissions recorded yet.
              </div>
            ) : (
              recentAttempts.map((att) => (
                <Link
                  key={att.id}
                  href={`/mock/${att.id}/result`}
                  className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors group"
                >
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {att.user?.name || "Student Candidate"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {att.examConfig?.title || "Mock Exam"} &bull; {att.user?.studentRollNo || "EF-100179719"}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {att.status}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {new Date(att.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
