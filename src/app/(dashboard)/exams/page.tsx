"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileCheck2,
  Clock,
  Target,
  PlusCircle,
  PlayCircle,
  Lock,
  ArrowRight,
  Search,
  Calendar,
  CheckCircle2,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ExamConfigItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  mode: string;
  totalQuestions: number;
  totalMarks: number;
  totalDurationMinutes: number;
  marksPerCorrect: number;
  negativeMarks: number;
  sectionalTiming: boolean;
  sectionLock: boolean;
  navigationRules: string;
  sections: { name: string; questionCount: number; durationMinutes?: number }[];
}

export default function ExamsCatalogPage() {
  const router = useRouter();
  const [exams, setExams] = useState<ExamConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingTestId, setCreatingTestId] = useState<string | null>(null);

  // Tabs inspired by Reference Screenshot 4
  const [activeTab, setActiveTab] = useState<"TODAY" | "ALL">("TODAY");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");

  useEffect(() => {
    fetch("/api/exams")
      .then((res) => res.json())
      .then((data) => {
        if (data.exams) setExams(data.exams);
      })
      .catch((err) => console.error("Error fetching exams:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleStartExam = async (examId: string) => {
    try {
      setCreatingTestId(examId);
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examConfigId: examId, mode: "MOCK" }),
      });
      const data = await res.json();
      if (data.testAttemptId) {
        router.push(`/mock/${data.testAttemptId}/instructions`);
      }
    } catch (e) {
      console.error("Failed to initiate test:", e);
    } finally {
      setCreatingTestId(null);
    }
  };

  const filteredExams = exams.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* 1. TOP THREE ANALYSIS TABS (Direct match to Reference Screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/analytics"
          className="p-4 rounded-xl bg-[#ffd6d6] hover:bg-[#ffc4c4] border border-rose-200 text-center font-bold text-slate-800 text-sm shadow-2xs transition-all flex items-center justify-center gap-2"
        >
          <BarChart2 className="w-4 h-4 text-rose-700" />
          <span>Area Wise Analysis</span>
        </Link>

        <Link
          href="/history"
          className="p-4 rounded-xl bg-[#c5f0ee] hover:bg-[#b0eae7] border border-teal-200 text-center font-bold text-slate-800 text-sm shadow-2xs transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-700" />
          <span>Cumulative Analysis</span>
        </Link>

        <Link
          href="/history"
          className="p-4 rounded-xl bg-[#ffeed0] hover:bg-[#ffe3b5] border border-amber-200 text-center font-bold text-slate-800 text-sm shadow-2xs transition-all flex items-center justify-center gap-2"
        >
          <Target className="w-4 h-4 text-amber-700" />
          <span>Test Specific Analysis</span>
        </Link>
      </div>

      {/* 2. SUB-FILTERS: Today's Test / All Test + Search & Sort (Screenshot 4) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("TODAY")}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "TODAY"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Today&apos;s Test
            </button>
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "ALL"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Tests
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Sort By Date:</span>
              <select
                value={sortOrder}
                onChange={(e: any) => setSortOrder(e.target.value)}
                className="py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none"
              >
                <option value="NEWEST">All Dates</option>
                <option value="OLDEST">Earliest</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. TEST LISTING TABLE (Matching Reference Screenshot 4 Table Structure) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#e9f2fa] text-slate-800 uppercase text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Test Name</th>
                <th className="py-3 px-4">Exam Details &amp; Timing</th>
                <th className="py-3 px-4 text-right">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExams.map((exam, idx) => (
                <tr key={exam.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 text-sm">{exam.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Pattern: {exam.category} &bull; {exam.totalQuestions} Questions &bull; {exam.totalMarks} Marks
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Live Window: Always Active (Server Clock)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{exam.totalDurationMinutes} Minutes Duration &bull; Negative: -{exam.negativeMarks}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleStartExam(exam.id)}
                      disabled={creatingTestId === exam.id}
                      className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>{creatingTestId === exam.id ? "Launching..." : "Start Test"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
