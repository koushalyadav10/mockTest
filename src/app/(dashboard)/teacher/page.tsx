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
} from "lucide-react";

export default function TeacherDashboardPage() {
  const [stats, setStats] = useState({
    totalQuestions: 15,
    approvedQuestions: 15,
    testsCreated: 6,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1 border border-purple-200">
            <span>Faculty &bull; Teacher Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Teacher Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create question sets, upload papers for OCR extraction, build mock tests, and review student performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/upload">
            <button className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              <span>Upload Questions (OCR)</span>
            </button>
          </Link>
          <Link href="/admin/test-builder">
            <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              <span>Create New Test</span>
            </button>
          </Link>
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
              Curate, edit, and tag questions by exam, subject, topic, and difficulty.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 pt-4 flex items-center gap-1">
            Manage Question Bank &rarr;
          </span>
        </Link>
      </div>

      {/* Student Analytics & Review */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Performance Monitoring</h3>
            <p className="text-xs text-slate-500">Live test attempts and score distributions</p>
          </div>
          <Link href="/analytics" className="text-xs font-bold text-teal-700 hover:underline">
            View Analytics &rarr;
          </Link>
        </div>

        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2">
          <BarChart3 className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-600 font-medium">
            Student performance metrics update automatically as mock tests are submitted.
          </p>
        </div>
      </div>
    </div>
  );
}
