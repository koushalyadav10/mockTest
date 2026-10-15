"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  FileCheck2,
  ArrowRight,
  Search,
  Calendar,
  Filter,
  RefreshCw,
  Mail,
  Eye,
  Trash2,
  Award,
  Users,
  BarChart2,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldAlert,
  Clock,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

function formatDateTime(d?: string | Date | null) {
  if (!d) return "--";
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return "--";
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return "--";
  }
}

function formatDateOnly(d?: string | Date | null) {
  if (!d) return "--";
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return "--";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return "--";
  }
}

function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export default function HistoryPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Admin View Mode vs Personal View Mode
  const [adminMode, setAdminMode] = useState(true);

  // Submissions Data for Admin View
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [examsList, setExamsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [examFilter, setExamFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD
  const [dateRange, setDateRange] = useState<"all" | "today" | "yesterday" | "week" | "month">("all");

  // Performance Modal State
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [candidateHistory, setCandidateHistory] = useState<any | null>(null);
  const [loadingCandidateHistory, setLoadingCandidateHistory] = useState(false);

  // Email Scorecard State
  const [emailingAttemptId, setEmailingAttemptId] = useState<string | null>(null);
  const [emailFeedback, setEmailFeedback] = useState<{ id: string; msg: string; isError?: boolean } | null>(null);

  // Delete Attempt State
  const [attemptToDelete, setAttemptToDelete] = useState<any | null>(null);
  const [deleteScope, setDeleteScope] = useState<"both" | "admin">("both");
  const [isDeleting, setIsDeleting] = useState(false);

  // Student Personal Tests
  const [personalTests, setPersonalTests] = useState<any[]>([]);

  // 1. Fetch Current User
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          const isStaff = data.user.role === "ADMIN" || data.user.role === "TEACHER";
          setAdminMode(isStaff);
        }
      })
      .catch(console.error)
      .finally(() => setAuthLoading(false));
  }, []);

  // 2. Fetch Submissions (Admin View)
  const fetchAdminSubmissions = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (examFilter !== "ALL") params.append("examConfigId", examFilter);
    if (statusFilter !== "ALL") params.append("status", statusFilter);
    if (searchQuery) params.append("search", searchQuery);
    if (dateFilter) {
      params.append("date", dateFilter);
    } else if (dateRange !== "all") {
      params.append("dateRange", dateRange);
    }
    params.append("limit", "50");

    fetch(`/api/admin/submissions?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setSubmissions(data.submissions || []);
          setStats(data.stats || null);
          setExamsList(data.exams || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // 3. Fetch Personal Tests (Student View)
  const fetchPersonalTests = () => {
    setLoading(true);
    fetch("/api/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.recentTests) {
          setPersonalTests(data.recentTests);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!authLoading) {
      if (adminMode && (currentUser?.role === "ADMIN" || currentUser?.role === "TEACHER")) {
        fetchAdminSubmissions();
      } else {
        fetchPersonalTests();
      }
    }
  }, [authLoading, adminMode, examFilter, statusFilter, dateFilter, dateRange]);

  // Handle Candidate Overall Performance Modal
  const openCandidatePerformance = (candidateId: string, candidateName: string) => {
    setSelectedCandidate({ id: candidateId, name: candidateName });
    setLoadingCandidateHistory(true);
    fetch(`/api/admin/submissions?candidateId=${candidateId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success) {
          setCandidateHistory(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingCandidateHistory(false));
  };

  // Handle Email Scorecard Dispatch
  const handleEmailScorecard = async (attempt: any) => {
    const candidateName = attempt.candidateName || "Candidate";
    const email = attempt.candidateEmail;
    if (!email || !email.includes("@")) {
      alert("This candidate does not have a valid email on record.");
      return;
    }

    if (!confirm(`Send official CBT Scorecard email to ${candidateName} (${email})?`)) {
      return;
    }

    try {
      setEmailingAttemptId(attempt.id);
      setEmailFeedback(null);
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: attempt.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailFeedback({
          id: attempt.id,
          msg: `Scorecard dispatched to ${email}!`,
        });
      } else {
        setEmailFeedback({
          id: attempt.id,
          msg: data.error || "Failed to send scorecard email.",
          isError: true,
        });
      }
    } catch (e: any) {
      setEmailFeedback({
        id: attempt.id,
        msg: e.message || "Failed to dispatch email.",
        isError: true,
      });
    } finally {
      setEmailingAttemptId(null);
    }
  };

  // Handle Delete Attempt
  const handleDeleteAttempt = async () => {
    if (!attemptToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(
        `/api/admin/submissions?attemptId=${attemptToDelete.id}&scope=${deleteScope}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== attemptToDelete.id));
        setAttemptToDelete(null);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to delete attempt.");
      }
    } catch (e: any) {
      alert("Error deleting attempt: " + e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isStaff = currentUser?.role === "ADMIN" || currentUser?.role === "TEACHER";

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Examination Attempt History</span>
              {isStaff && adminMode && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Admin Live Console (Last 50)
                </span>
              )}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isStaff && adminMode
              ? "Live logs of candidate mock exams, scheduled tests, and practice drills across all dates"
              : "Review past mock tests, score trends, and answer keys"}
          </p>
        </div>

        {/* Staff Mode Toggle */}
        {isStaff && (
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setAdminMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                adminMode
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>All Candidates (Admin)</span>
            </button>
            <button
              onClick={() => setAdminMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                !adminMode
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>My Personal History</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ADMIN CONSOLE VIEW (When Admin/Staff is active)                */}
      {/* ============================================================== */}
      {isStaff && adminMode ? (
        <div className="space-y-6">
          {/* Top Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Total Recent Records</span>
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                {stats?.totalSubmissions ?? submissions.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                {stats?.evaluatedCount ?? 0} Evaluated &amp; Scored
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Unique Candidates</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                {stats?.uniqueCandidates ?? "..."}
              </div>
              <div className="text-[11px] text-blue-600 font-medium">Distinct Test Takers</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Average Score</span>
                <BarChart2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                {stats?.averageScore ?? "--"}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Across displayed tests</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Highest Score</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-600">
                {stats?.topScore ?? "--"}
              </div>
              <div className="text-[11px] text-amber-700 font-medium">Leaderboard Benchmark</div>
            </div>
          </div>

          {/* Controls Bar: Calendar Back-Date, Quick Ranges, Search, Status */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            {/* Row 1: Calendar Date Picker & Quick Range Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              {/* Quick Date Range Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  Date:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter("");
                    setDateRange("all");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                    !dateFilter && dateRange === "all"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  All Recent (50)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter("");
                    setDateRange("today");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                    !dateFilter && dateRange === "today"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter("");
                    setDateRange("yesterday");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                    !dateFilter && dateRange === "yesterday"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100"
                  }`}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter("");
                    setDateRange("week");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                    !dateFilter && dateRange === "week"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter("");
                    setDateRange("month");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                    !dateFilter && dateRange === "month"
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                  }`}
                >
                  Last 30 Days
                </button>
              </div>

              {/* Specific Back-Date Calendar Picker */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-[11px] font-bold text-slate-600">Pick Back Date:</span>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setDateRange("all");
                    }}
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    title="Select a specific date to view historical exam attempts"
                  />
                  {dateFilter && (
                    <button
                      type="button"
                      onClick={() => setDateFilter("")}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Clear date filter"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Search, Status, Exam Filters, Manual Refresh */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search candidate name, email, roll number, or exam..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchAdminSubmissions()}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchAdminSubmissions()}
                  className="text-xs"
                >
                  Search
                </Button>
              </div>

              {/* Status and Refresh */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="EVALUATED">Evaluated / Submitted</option>
                  <option value="RUNNING">In Progress (Running)</option>
                </select>

                <select
                  value={examFilter}
                  onChange={(e) => setExamFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[200px]"
                >
                  <option value="ALL">All Exams</option>
                  {examsList.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.title}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => fetchAdminSubmissions()}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                  title="Reload test attempts"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Submissions List Container */}
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              <div className="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
              Loading candidate examination attempt history...
            </div>
          ) : submissions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 space-y-2">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-base">No examination records found</div>
              <p>
                {dateFilter
                  ? `No test attempts recorded on ${formatDateOnly(dateFilter)}.`
                  : "Try adjusting your search query, status, or date range."}
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE CARDS (Visible on phones) */}
              <div className="block sm:hidden space-y-3">
                {submissions.map((sub) => {
                  const medalBadge =
                    sub.rank === 1
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : sub.rank === 2
                      ? "bg-slate-200 text-slate-800 border-slate-300"
                      : sub.rank === 3
                      ? "bg-orange-100 text-orange-900 border-orange-200"
                      : "bg-slate-100 text-slate-700 border-slate-200";

                  return (
                    <div
                      key={sub.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                    >
                      {/* Top Row: Rank, Candidate Name, Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-black border font-mono ${medalBadge}`}
                          >
                            #{sub.rank}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                              <span>{sub.candidateName}</span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                              Roll: {sub.candidateRollNo} &bull; {sub.candidateEmail}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                            sub.status === "EVALUATED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : sub.status === "SUBMITTED"
                              ? "bg-teal-50 text-teal-700 border-teal-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      {/* Exam Title Tag */}
                      <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="font-bold">{sub.examTitle}</span>
                        <span className="text-[10px] font-mono text-slate-400 ml-1.5">
                          ({sub.examCategory})
                        </span>
                      </div>

                      {/* Timing Telemetry */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col gap-1 text-[11px] font-mono text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-sans">Started (Khola):</span>
                          <span className="font-bold">{formatDateTime(sub.startedAt)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-sans">Submitted (Band):</span>
                          <span className="font-bold">
                            {sub.completedAt ? formatDateTime(sub.completedAt) : "In Progress"}
                          </span>
                        </div>
                      </div>

                      {/* Score Highlight Box */}
                      <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Score
                          </div>
                          <div className="text-2xl font-black font-mono">
                            {sub.finalScore}{" "}
                            <span className="text-xs font-normal text-slate-400">
                              / {sub.totalMarks}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-400 font-mono">
                            {sub.percentage}%
                          </div>
                          <div className="text-[10px] text-slate-400">{sub.accuracy}% Acc</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={`/mock/${sub.id}/result`}
                          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Scorecard</span>
                        </Link>
                        {sub.candidateId && (
                          <button
                            type="button"
                            onClick={() => openCandidatePerformance(sub.candidateId, sub.candidateName)}
                            className="py-2 px-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold"
                            title="Candidate Overall Performance"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEmailScorecard(sub)}
                          disabled={emailingAttemptId === sub.id}
                          className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold"
                          title="Email Scorecard to Candidate"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">Rank</th>
                        <th className="py-3 px-4">Candidate Information</th>
                        <th className="py-3 px-4">Exam / Paper</th>
                        <th className="py-3 px-4 text-center">Score / Marks</th>
                        <th className="py-3 px-4 text-center">Accuracy</th>
                        <th className="py-3 px-4 text-center">Breakdown (C / W / U)</th>
                        <th className="py-3 px-4 text-center">Timing &amp; Date</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub) => {
                        const medalBadge =
                          sub.rank === 1
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : sub.rank === 2
                            ? "bg-slate-200 text-slate-800 border-slate-300"
                            : sub.rank === 3
                            ? "bg-orange-100 text-orange-900 border-orange-200"
                            : "bg-slate-100 text-slate-700 border-slate-200";

                        return (
                          <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Rank */}
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-black border font-mono inline-block ${medalBadge}`}
                              >
                                #{sub.rank}
                              </span>
                            </td>

                            {/* Candidate */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{sub.candidateName}</span>
                                    {sub.candidateTargetExam && (
                                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                        {sub.candidateTargetExam}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-mono">
                                    Roll: {sub.candidateRollNo} &bull; {sub.candidateEmail}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Exam */}
                            <td className="py-3.5 px-4 max-w-[220px]">
                              <div className="font-semibold text-slate-800 truncate" title={sub.examTitle}>
                                {sub.examTitle}
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {sub.examCategory} &bull; {sub.mode}
                              </span>
                            </td>

                            {/* Score */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="font-black text-slate-900 font-mono text-sm">
                                {sub.finalScore}{" "}
                                <span className="text-[11px] font-normal text-slate-400">
                                  / {sub.totalMarks}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                {sub.percentage}%
                              </span>
                            </td>

                            {/* Accuracy */}
                            <td className="py-3.5 px-4 text-center">
                              <span className="font-bold font-mono text-slate-800">
                                {sub.accuracy}%
                              </span>
                            </td>

                            {/* Breakdown */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="font-mono text-xs flex items-center justify-center gap-1.5">
                                <span className="text-emerald-700 font-bold" title="Correct">
                                  +{sub.correctCount}
                                </span>
                                <span className="text-slate-300">/</span>
                                <span className="text-rose-600 font-bold" title="Incorrect">
                                  -{sub.incorrectCount}
                                </span>
                                <span className="text-slate-300">/</span>
                                <span className="text-slate-400" title="Unattempted">
                                  {sub.unattemptedCount}
                                </span>
                              </div>
                            </td>

                            {/* Timing & Date */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="font-bold font-mono text-slate-900 text-xs">
                                ⏱️ {formatDuration(sub.timeSpentSeconds)}
                              </div>
                              <div className="text-[10px] font-mono text-slate-500 flex flex-col items-center gap-0.5 mt-1">
                                <span title="Start Date & Time">
                                  <span className="text-slate-400 font-sans">In:</span> {formatDateTime(sub.startedAt)}
                                </span>
                                <span title="Submit Date & Time">
                                  <span className="text-slate-400 font-sans">Out:</span>{" "}
                                  {sub.completedAt ? formatDateTime(sub.completedAt) : "In Progress"}
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                                  sub.status === "EVALUATED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : sub.status === "SUBMITTED"
                                    ? "bg-teal-50 text-teal-700 border-teal-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                }`}
                              >
                                {sub.status}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                {/* Scorecard */}
                                <Link
                                  href={`/mock/${sub.id}/result`}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all inline-flex items-center gap-1"
                                  title="View complete evaluation scorecard & solutions"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Scorecard</span>
                                </Link>

                                {/* Candidate Overall Performance */}
                                {sub.candidateId && (
                                  <button
                                    type="button"
                                    onClick={() => openCandidatePerformance(sub.candidateId, sub.candidateName)}
                                    className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all inline-flex items-center gap-1"
                                    title="View candidate's overall performance history & statistics"
                                  >
                                    <BarChart2 className="w-3.5 h-3.5" />
                                    <span>Profile</span>
                                  </button>
                                )}

                                {/* Email Scorecard */}
                                <button
                                  type="button"
                                  onClick={() => handleEmailScorecard(sub)}
                                  disabled={emailingAttemptId === sub.id}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all inline-flex items-center gap-1"
                                  title="Dispatch official CBT Scorecard to candidate email"
                                >
                                  <Mail className={`w-3.5 h-3.5 ${emailingAttemptId === sub.id ? "animate-spin" : ""}`} />
                                  <span>Email</span>
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAttemptToDelete(sub);
                                    setDeleteScope("both");
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
                                  title="Delete Scorecard / Attempt"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Email Dispatch Feedback Toast */}
                              {emailFeedback && emailFeedback.id === sub.id && (
                                <div
                                  className={`text-[10px] font-bold mt-1 text-right ${
                                    emailFeedback.isError ? "text-rose-600" : "text-emerald-600"
                                  }`}
                                >
                                  {emailFeedback.msg}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Candidate Overall Performance Modal */}
          {selectedCandidate && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-base">
                    <BarChart2 className="w-5 h-5" />
                    <h3>Candidate Overall Performance &amp; History</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCandidate(null);
                      setCandidateHistory(null);
                    }}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loadingCandidateHistory ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    <div className="animate-spin w-7 h-7 border-3 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
                    Fetching candidate performance metrics...
                  </div>
                ) : candidateHistory ? (
                  <div className="space-y-4">
                    {/* Candidate Profile Details */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          {candidateHistory.candidate.name}
                        </h4>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">
                          Roll: {candidateHistory.candidate.studentRollNo || "N/A"} &bull;{" "}
                          {candidateHistory.candidate.email}
                        </div>
                        <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                          {candidateHistory.candidate.targetExam && (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                              🎯 {candidateHistory.candidate.targetExam}
                            </span>
                          )}
                          {candidateHistory.candidate.city && (
                            <span className="text-[11px] text-slate-500">
                              📍 {candidateHistory.candidate.city}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="flex items-center gap-3">
                        <div className="text-center px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Tests</div>
                          <div className="text-lg font-black font-mono text-slate-900">
                            {candidateHistory.stats.totalAttempts}
                          </div>
                        </div>
                        <div className="text-center px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Score</div>
                          <div className="text-lg font-black font-mono text-indigo-600">
                            {candidateHistory.stats.averageScore}
                          </div>
                        </div>
                        <div className="text-center px-3 py-1.5 bg-white rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Highest</div>
                          <div className="text-lg font-black font-mono text-amber-600">
                            {candidateHistory.stats.highestScore}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Test History List */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        All Tests Taken by {candidateHistory.candidate.name} ({candidateHistory.attempts.length})
                      </div>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                        {candidateHistory.attempts.map((att: any) => (
                          <div
                            key={att.id}
                            className="p-3 flex items-center justify-between text-xs hover:bg-slate-50"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{att.examTitle}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {formatDateTime(att.completedAt || att.startedAt)} &bull; {att.category}
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <div>
                                <div className="font-black font-mono text-slate-900">
                                  {att.finalScore} / {att.totalMarks}
                                </div>
                                <div className="text-[10px] text-emerald-600 font-bold">
                                  {att.accuracy}% Accuracy
                                </div>
                              </div>
                              <Link
                                href={`/mock/${att.id}/result`}
                                className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px]"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Delete Attempt Modal */}
          {attemptToDelete && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                    <Trash2 className="w-5 h-5" />
                    <h3>Delete Scorecard / Attempt</h3>
                  </div>
                  <button
                    onClick={() => setAttemptToDelete(null)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <p>
                    Are you sure you want to delete the test attempt of{" "}
                    <strong>{attemptToDelete.candidateName}</strong> for exam{" "}
                    <strong>{attemptToDelete.examTitle}</strong>?
                  </p>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-start gap-2 p-3 rounded-xl border border-rose-200 bg-rose-50/50 cursor-pointer">
                      <input
                        type="radio"
                        name="deleteScope"
                        checked={deleteScope === "both"}
                        onChange={() => setDeleteScope("both")}
                        className="mt-0.5 text-rose-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Delete Permanently</div>
                        <div className="text-slate-500 text-[11px]">
                          Removes candidate scorecard completely from the platform database.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAttemptToDelete(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDeleteAttempt}
                    disabled={isDeleting}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ============================================================== */
        /* STUDENT PERSONAL ATTEMPT HISTORY VIEW                          */
        /* ============================================================== */
        <div>
          {personalTests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No test history available</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                All your scheduled exams, submitted mock tests, and practice drills will be logged here with complete question-by-question solutions.
              </p>
              <div className="pt-2">
                <Link href="/exams">
                  <Button variant="primary" size="md">
                    Take a Mock Exam
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {personalTests.map((t) => {
                const isUnstarted = t.status === "NOT_STARTED";
                const isRunning = t.status === "RUNNING";
                const isHeld = Boolean(t.isHeld);
                const isEvaluated = t.status === "EVALUATED" && !isHeld;
                const dateStr = formatDateTime(t.completedAt || t.startedAt || t.createdAt);

                return (
                  <div
                    key={t.id}
                    className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                          {t.mode}
                        </span>
                        {isEvaluated && (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ✅ Evaluated
                          </span>
                        )}
                        {isRunning && (
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            ⏱️ In Progress
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Attempted: {t.attempted}/{t.totalQuestions} questions &bull; Completed: {dateStr}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-base font-mono font-bold text-slate-900">
                          {t.score} / {t.totalMarks}
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold font-mono">
                          {t.accuracy}% Accuracy
                        </div>
                      </div>

                      <Link href={`/mock/${t.id}/result`}>
                        <Button variant="outline" size="sm" className="font-semibold">
                          View Solutions &rarr;
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
