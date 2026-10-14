"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Award,
  Users,
  FileText,
  ArrowRight,
  Search,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-16 text-center text-xs text-slate-500">
        <div className="animate-spin w-7 h-7 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
        Loading analytics telemetry...
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ADMIN & TEACHER VIEW: Platform Exam-Wise Candidate Participation
  // --------------------------------------------------------------------------
  if (stats?.isAdmin) {
    const adminStats = stats.adminStats || {
      totalExams: 0,
      totalAttempts: 0,
      uniqueCandidates: 0,
      overallAverageScore: 0,
    };

    const examAnalytics: any[] = stats.examAnalytics || [];
    const filteredExams = examAnalytics.filter(
      (e) =>
        e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 font-sans">
        <div className="pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1 border border-indigo-200">
              <BarChart3 className="w-3.5 h-3.5" /> Platform Examination Telemetry
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Exam Participation &amp; Performance Analytics
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Live tracking of candidate volume, test attempts, and score benchmarks per examination
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin?tab=SUBMISSIONS">
              <Button variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
                <Users className="w-4 h-4 mr-1.5" />
                View All Submissions
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Top KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Total Exams</span>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {adminStats.totalExams}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Configured in database</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Total Attempts</span>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-600">
              {adminStats.totalAttempts}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across all examinations</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Unique Candidates</span>
              <Users className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
              {adminStats.uniqueCandidates}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Registered students tested</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Platform Avg Score</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {adminStats.overallAverageScore}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Marks benchmark</div>
          </div>
        </div>

        {/* Exam-wise Candidate Participation Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>कौन सा टेस्ट कितने उम्मीदवारों ने दिया</span>
                <span className="text-xs font-normal text-slate-400">(Candidate Participation by Exam)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of candidates attempting each exam, evaluation rate, and average score
              </p>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search exam paper..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {filteredExams.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No examination found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200/80">
                    <tr>
                      <th className="py-3 px-4">Exam Paper</th>
                      <th className="py-3 px-4 text-center">Candidates Attempted</th>
                      <th className="py-3 px-4 text-center">Status Breakdown</th>
                      <th className="py-3 px-4 text-center">Average Score</th>
                      <th className="py-3 px-4 text-center">Top Score</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="font-bold text-slate-900 leading-snug">{exam.title}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-600">
                              {exam.category}
                            </span>
                            <span>&bull;</span>
                            <span>{exam.totalQuestions} Questions</span>
                            <span>&bull;</span>
                            <span>{exam.totalMarks} Marks</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 font-bold font-mono px-2.5 py-1 rounded-full text-xs ${
                              exam.candidateCount > 0
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <Users className="w-3.5 h-3.5" />
                            {exam.candidateCount} {exam.candidateCount === 1 ? "Candidate" : "Candidates"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {exam.candidateCount > 0 ? (
                            <div className="flex items-center justify-center gap-1 text-[11px] font-mono">
                              <span className="text-emerald-700 font-bold" title="Evaluated">
                                {exam.evaluatedCount} Evaluated
                              </span>
                              {exam.inProgressCount > 0 && (
                                <>
                                  <span className="text-slate-300">&bull;</span>
                                  <span className="text-amber-600 font-bold" title="In Progress">
                                    {exam.inProgressCount} Ongoing
                                  </span>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">No attempts</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {exam.avgScore !== null ? (
                            <div className="font-mono font-bold text-slate-900">
                              {exam.avgScore}{" "}
                              <span className="text-[10px] text-slate-400 font-normal">
                                / {exam.totalMarks}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono">--</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {exam.topScore !== null ? (
                            <span className="font-mono font-bold text-emerald-600">
                              {exam.topScore}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">--</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link href={`/admin?tab=SUBMISSIONS&examId=${exam.id}`}>
                            <Button variant="outline" size="sm" className="text-xs font-semibold">
                              Submissions &rarr;
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100">
                {filteredExams.map((exam) => (
                  <div key={exam.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{exam.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {exam.category} &bull; {exam.totalQuestions} Qs &bull; {exam.totalMarks} Marks
                        </div>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          exam.candidateCount > 0
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {exam.candidateCount} Students
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Average Score</span>
                        <span className="font-mono font-bold text-slate-800">
                          {exam.avgScore !== null ? `${exam.avgScore} / ${exam.totalMarks}` : "--"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Top Score</span>
                        <span className="font-mono font-bold text-emerald-600">
                          {exam.topScore !== null ? exam.topScore : "--"}
                        </span>
                      </div>
                    </div>

                    <Link href={`/admin?tab=SUBMISSIONS&examId=${exam.id}`} className="block">
                      <Button variant="outline" size="sm" className="w-full text-xs font-bold justify-center">
                        View Candidate Submissions &rarr;
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STUDENT VIEW: Personal Mastery & Attempt Stats
  // --------------------------------------------------------------------------
  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 font-sans">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Performance Analytics &amp; Mastery
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical trends, attempt accuracy rates, and time allocation across mock exams
        </p>
      </div>

      {stats?.stats?.testsAttempted === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No Analytics Data Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Complete at least one CBT mock exam or practice session to build your personal mastery profile.
          </p>
          <div className="pt-2">
            <Link href="/exams">
              <Button variant="primary" size="md">
                Start a Mock Test
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Total Mock Exams</span>
              <span className="text-3xl font-bold font-mono text-slate-900">
                {stats?.stats?.testsAttempted || 0}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Questions Attempted</span>
              <span className="text-3xl font-bold font-mono text-blue-600">
                {stats?.stats?.questionsSolved || 0}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Average Accuracy</span>
              <span className="text-3xl font-bold font-mono text-emerald-600">
                {stats?.stats?.accuracy || 0}%
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Average Time / Question</span>
              <span className="text-3xl font-bold font-mono text-slate-800">
                {stats?.stats?.avgTimePerQuestion || 0}s
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

