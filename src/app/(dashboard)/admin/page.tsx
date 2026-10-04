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
  ShieldCheck,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Mail,
  Send,
  X,
  Filter,
  FileText,
  Activity,
  Award,
  Download,
  BarChart2,
  Trophy,
  Eye,
  ExternalLink,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type AdminTab = "OVERVIEW" | "SUBMISSIONS" | "USERS" | "TEACHERS" | "AUDIT_LOGS";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("OVERVIEW");

  // Submissions & Scores Data
  const [submissionsData, setSubmissionsData] = useState<any>(null);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionExamFilter, setSubmissionExamFilter] = useState("ALL");
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState("ALL");
  const [submissionSearch, setSubmissionSearch] = useState("");

  // Overview Data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Users Data
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userStatusFilter, setUserStatusFilter] = useState("ALL");
  const [userActionLoadingId, setUserActionLoadingId] = useState<string | null>(null);

  // Teachers Data
  const [teachers, setTeachers] = useState<any[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [showInviteTeacherModal, setShowInviteTeacherModal] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherDept, setTeacherDept] = useState("Quantitative Aptitude & Mathematics");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [invitingTeacher, setInvitingTeacher] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);

  // Audit Logs Data
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);
  const [auditActionFilter, setAuditActionFilter] = useState("ALL");

  // Fetch Overview
  const fetchOverview = () => {
    setOverviewLoading(true);
    fetch("/api/admin/overview")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) setOverviewData(d);
      })
      .catch(console.error)
      .finally(() => setOverviewLoading(false));
  };

  // Fetch Users
  const fetchUsers = () => {
    setUsersLoading(true);
    const params = new URLSearchParams();
    if (userSearch) params.append("search", userSearch);
    if (userRoleFilter !== "ALL") params.append("role", userRoleFilter);
    if (userStatusFilter !== "ALL") params.append("status", userStatusFilter);

    fetch(`/api/admin/users?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d?.users) setUsers(d.users);
      })
      .catch(console.error)
      .finally(() => setUsersLoading(false));
  };

  // Fetch Teachers
  const fetchTeachers = () => {
    setTeachersLoading(true);
    fetch("/api/admin/teachers")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d?.teachers) setTeachers(d.teachers);
      })
      .catch(console.error)
      .finally(() => setTeachersLoading(false));
  };

  // Fetch Audit Logs
  const fetchAuditLogs = () => {
    setAuditLogsLoading(true);
    const params = new URLSearchParams();
    if (auditActionFilter !== "ALL") params.append("action", auditActionFilter);

    fetch(`/api/admin/audit-logs?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d?.logs) setAuditLogs(d.logs);
      })
      .catch(console.error)
      .finally(() => setAuditLogsLoading(false));
  };

  // Fetch Submissions & Candidate Scores
  const fetchSubmissions = (
    examId = submissionExamFilter,
    status = submissionStatusFilter,
    search = submissionSearch
  ) => {
    setSubmissionsLoading(true);
    const params = new URLSearchParams();
    if (examId && examId !== "ALL") params.append("examConfigId", examId);
    if (status && status !== "ALL") params.append("status", status);
    if (search) params.append("search", search);

    fetch(`/api/admin/submissions?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) setSubmissionsData(d);
      })
      .catch(console.error)
      .finally(() => setSubmissionsLoading(false));
  };

  // Handle URL query parameters (?tab=SUBMISSIONS&examId=...)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const tabParam = sp.get("tab") as AdminTab | null;
      const examParam = sp.get("examId");
      if (tabParam === "SUBMISSIONS") {
        setActiveTab("SUBMISSIONS");
      }
      if (examParam) {
        setSubmissionExamFilter(examParam);
      }
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (activeTab === "SUBMISSIONS") fetchSubmissions();
    if (activeTab === "USERS") fetchUsers();
    if (activeTab === "TEACHERS") fetchTeachers();
    if (activeTab === "AUDIT_LOGS") fetchAuditLogs();
  }, [
    activeTab,
    submissionExamFilter,
    submissionStatusFilter,
    userRoleFilter,
    userStatusFilter,
    auditActionFilter,
  ]);

  // Handle User Status Toggle (Suspend / Activate)
  const handleToggleUserStatus = async (user: any) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const confirmMsg =
      nextStatus === "SUSPENDED"
        ? `Are you sure you want to SUSPEND candidate ${user.name} (${user.email})? They will be locked out of examinations.`
        : `Activate candidate ${user.name} (${user.email})?`;

    if (!confirm(confirmMsg)) return;

    try {
      setUserActionLoadingId(user.id);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || "Failed to update user status");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setUserActionLoadingId(null);
    }
  };

  // Handle User Role Change
  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      setUserActionLoadingId(userId);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || "Failed to update role");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setUserActionLoadingId(null);
    }
  };

  // Handle Provisioning Teacher
  const handleProvisionTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !teacherEmail) {
      alert("Please provide both name and valid email.");
      return;
    }

    try {
      setInvitingTeacher(true);
      setInviteFeedback(null);
      const res = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teacherName.trim(),
          email: teacherEmail.trim(),
          department: teacherDept.trim(),
          password: teacherPassword.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteFeedback(data.message || `Teacher provisioned successfully!`);
        fetchTeachers();
        setTimeout(() => {
          setShowInviteTeacherModal(false);
          setTeacherName("");
          setTeacherEmail("");
          setTeacherPassword("");
          setInviteFeedback(null);
        }, 2200);
      } else {
        alert(data.error || "Failed to provision teacher account");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setInvitingTeacher(false);
    }
  };

  const stats = overviewData?.stats || {
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
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Platform Controller &bull; Full Strict RBAC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage student candidate accounts, faculty provisioning, live published papers, and proctoring audit trails
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

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "OVERVIEW"
              ? "border-blue-600 text-blue-700 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("SUBMISSIONS")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === "SUBMISSIONS"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Exam Results &amp; Scores</span>
          {submissionsData?.stats?.totalSubmissions !== undefined && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-mono font-bold">
              {submissionsData.stats.totalSubmissions}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("USERS")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "USERS"
              ? "border-blue-600 text-blue-700 bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Accounts</span>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
            {stats.totalStudents}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TEACHERS")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "TEACHERS"
              ? "border-purple-600 text-purple-700 bg-purple-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Faculty &amp; Teachers</span>
          <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full font-mono">
            {stats.totalTeachers}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("AUDIT_LOGS")}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === "AUDIT_LOGS"
              ? "border-slate-800 text-slate-900 bg-slate-100/70"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Security Audit Trail</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: SYSTEM OVERVIEW                                        */}
      {/* ============================================================= */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* STATS CARDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Total Students</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {stats.totalStudents}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">Registered Candidates</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Faculty Members</span>
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {stats.totalTeachers}
              </div>
              <div className="text-[11px] text-purple-700 font-medium">Provisioned Teachers</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Question Bank</span>
                <BookOpen className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {stats.totalQuestions}
              </div>
              <div className="text-[11px] text-teal-700 font-medium">Extracted &amp; Curated</div>
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

          {/* QUICK WORKSPACE ACTION TILES */}
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
                  Upload official SSC/UP Police question PDFs. 15-stage AI parser extracts formulas, Hindi, and key.
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
                  Construct mock exams with sectional timers, negative marking, and difficulty balance.
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
                <h3 className="font-bold text-slate-900 text-base">Question Bank &amp; Publish</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Approve questions, publish papers as live public tests, view scorecards, and email results.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-800 flex items-center gap-1 pt-4">
                Manage Question Bank &rarr;
              </span>
            </Link>
          </div>

          {/* REAL-TIME ATTEMPTS AUDIT & ANTI-CHEAT MONITORING */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Attempts (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Recent Candidate Test Sessions</h3>
                <span className="text-[11px] font-mono text-slate-400">Authoritative Server Logs</span>
              </div>

              <div className="divide-y divide-slate-100">
                {!overviewData?.recentAttempts || overviewData.recentAttempts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No mock test sessions recorded yet.
                  </div>
                ) : (
                  overviewData.recentAttempts.map((att: any) => (
                    <Link
                      key={att.id}
                      href={`/mock/${att.id}/result`}
                      className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors group"
                      title="Click to view detailed mock result"
                    >
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                          <span>{att.user?.name || "Student Candidate"}</span>
                          <span className="font-mono text-slate-400 text-[10px]">
                            ({att.studentRollNo || att.user?.studentRollNo || "EF-100179719"})
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
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
                    </Link>
                  ))
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Want full scores and candidate rankings?</span>
                <button
                  onClick={() => setActiveTab("SUBMISSIONS")}
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <span>View All Submissions &amp; Leaderboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
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
                {!overviewData?.recentViolations || overviewData.recentViolations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No focus violations logged yet. Test integrity intact.
                  </div>
                ) : (
                  overviewData.recentViolations.map((v: any) => (
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
      )}

      {/* ============================================================= */}
      {/* TAB 2: EXAM RESULTS & CANDIDATE SCORES (SUBMISSIONS)          */}
      {/* ============================================================= */}
      {activeTab === "SUBMISSIONS" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top High-Level Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Total Submissions</span>
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {submissionsData?.stats?.totalSubmissions ?? "..."}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                {submissionsData?.stats?.evaluatedCount ?? 0} Evaluated &amp; Scored
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Unique Candidates</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {submissionsData?.stats?.uniqueCandidates ?? "..."}
              </div>
              <div className="text-[11px] text-blue-600 font-medium">Distinct Test Takers</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Average Score</span>
                <BarChart2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 tabular-nums">
                {submissionsData?.stats?.averageScore ?? "--"}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Across all attempts</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Highest Score</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black font-mono text-amber-600 tabular-nums">
                {submissionsData?.stats?.topScore ?? "--"}
              </div>
              <div className="text-[11px] text-amber-700 font-medium">Top Leaderboard Mark</div>
            </div>
          </div>

          {/* Exam Summary Filter Pills (Horizontal Scrollable) */}
          {submissionsData?.exams && submissionsData.exams.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quick Filter by Exam / Paper
                </span>
                <span className="text-xs text-slate-400">
                  {submissionsData.exams.length} Configured Papers
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => setSubmissionExamFilter("ALL")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                    submissionExamFilter === "ALL"
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  All Exams ({submissionsData.stats?.totalSubmissions ?? 0})
                </button>

                {submissionsData.exams.map((ex: any) => (
                  <button
                    key={ex.id}
                    onClick={() => setSubmissionExamFilter(ex.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 ${
                      submissionExamFilter === ex.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span>{ex.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        submissionExamFilter === ex.id
                          ? "bg-blue-800 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {ex.totalAttempts} att.
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls Bar: Search, Status, CSV Export */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search candidate name, email, roll number..."
                  value={submissionSearch}
                  onChange={(e) => setSubmissionSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchSubmissions()}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchSubmissions()}
                className="text-xs"
              >
                Search
              </Button>
            </div>

            {/* Exam & Status Dropdowns + Export Button */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={submissionExamFilter}
                onChange={(e) => setSubmissionExamFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 max-w-[220px]"
              >
                <option value="ALL">All Exams</option>
                {submissionsData?.exams?.map((ex: any) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.totalAttempts})
                  </option>
                ))}
              </select>

              <select
                value={submissionStatusFilter}
                onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="EVALUATED">Evaluated / Submitted</option>
                <option value="RUNNING">In Progress (Running)</option>
              </select>

              {/* Download CSV Report */}
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams({ export: "csv" });
                  if (submissionExamFilter !== "ALL") params.append("examConfigId", submissionExamFilter);
                  if (submissionStatusFilter !== "ALL") params.append("status", submissionStatusFilter);
                  if (submissionSearch) params.append("search", submissionSearch);
                  window.open(`/api/admin/submissions?${params.toString()}`, "_blank");
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                title="Download candidate scores as CSV spreadsheet"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export CSV</span>
              </button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchSubmissions()}
                className="text-xs"
                disabled={submissionsLoading}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${submissionsLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Submissions List Container */}
          {submissionsLoading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              <div className="animate-spin w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
              Loading candidate examination scores and submissions...
            </div>
          ) : !submissionsData?.submissions || submissionsData.submissions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 space-y-2">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-600 text-sm">No exam submissions found</div>
              <div>Try changing your search query or exam filter.</div>
            </div>
          ) : (
            <>
              {/* MOBILE VIEW (Touch-Friendly Cards, Visible on Phones) */}
              <div className="block sm:hidden space-y-3">
                {submissionsData.submissions.map((sub: any) => {
                  const isTopRank = sub.rank <= 3;
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
                            {sub.rank === 1 ? "🥇 #1" : sub.rank === 2 ? "🥈 #2" : sub.rank === 3 ? "🥉 #3" : `#${sub.rank}`}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 text-sm leading-tight">
                              {sub.candidateName}
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
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-800">{sub.examTitle}</span>
                        <span className="text-[10px] font-mono text-slate-400 ml-1.5">
                          ({sub.examCategory})
                        </span>
                      </div>

                      {/* Score Highlight Box */}
                      <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                            Score Obtained
                          </div>
                          <div className="text-2xl font-black font-mono">
                            {sub.finalScore}{" "}
                            <span className="text-xs font-normal text-slate-400">
                              / {sub.totalMarks} Marks
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-emerald-400 font-mono">
                            {sub.percentage}%
                          </div>
                          <div className="text-[10px] text-slate-400">Percentage</div>
                        </div>
                      </div>

                      {/* 4-Item Performance Metrics Grid */}
                      <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">Accuracy</div>
                          <div className="font-bold font-mono text-slate-800">{sub.accuracy}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-emerald-600 font-medium">Correct</div>
                          <div className="font-bold font-mono text-emerald-700">+{sub.correctCount}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-rose-600 font-medium">Wrong</div>
                          <div className="font-bold font-mono text-rose-700">-{sub.incorrectCount}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium">Time</div>
                          <div className="font-bold font-mono text-slate-800">
                            {Math.floor(sub.timeSpentSeconds / 60)}m
                          </div>
                        </div>
                      </div>

                      {/* Action Button: View Full Mock Scorecard */}
                      <Link
                        href={`/mock/${sub.id}/result`}
                        className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Detailed Scorecard &amp; Solutions</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP VIEW (Dense High-Yield Table) */}
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
                        <th className="py-3 px-4 text-center">Time Spent</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissionsData.submissions.map((sub: any) => {
                        const medalBadge =
                          sub.rank === 1
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : sub.rank === 2
                            ? "bg-slate-200 text-slate-800 border-slate-300"
                            : sub.rank === 3
                            ? "bg-orange-100 text-orange-900 border-orange-200"
                            : "bg-slate-100 text-slate-700 border-slate-200";

                        return (
                          <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                            {/* Rank */}
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-black border font-mono inline-block ${medalBadge}`}
                              >
                                {sub.rank === 1 ? "🥇 1" : sub.rank === 2 ? "🥈 2" : sub.rank === 3 ? "🥉 3" : `#${sub.rank}`}
                              </span>
                            </td>

                            {/* Candidate */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{sub.candidateName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {sub.candidateRollNo} &bull; {sub.candidateEmail}
                              </div>
                            </td>

                            {/* Exam */}
                            <td className="py-3.5 px-4 max-w-[200px]">
                              <div className="font-semibold text-slate-800 truncate" title={sub.examTitle}>
                                {sub.examTitle}
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                                {sub.examCategory}
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

                            {/* Time Spent */}
                            <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-600">
                              {Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s
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

                            {/* Action */}
                            <td className="py-3.5 px-4 text-right">
                              <Link
                                href={`/mock/${sub.id}/result`}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all inline-flex items-center gap-1 group"
                                title="View detailed evaluation scorecard and answers"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Scorecard</span>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
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
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: CANDIDATE ACCOUNTS MANAGEMENT                          */}
      {/* ============================================================= */}
      {activeTab === "USERS" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name, email, roll number..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <Button variant="outline" size="sm" onClick={fetchUsers} className="text-xs">
                Search
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Student Only</option>
                <option value="TEACHER">Teacher Only</option>
                <option value="ADMIN">Admin Only</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              <Button variant="outline" size="sm" onClick={fetchUsers} className="text-xs">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              </Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Candidate / User</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Exams Taken</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-600 mb-2" />
                        Loading candidate roster...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        No users matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const isWorking = userActionLoadingId === u.id;
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                              <span>{u.email}</span>
                              {u.isEmailVerified && (
                                <span title="Email Verified">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-600">
                            {u.studentRollNo || "--"}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              disabled={isWorking}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                                u.role === "ADMIN"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : u.role === "TEACHER"
                                  ? "bg-teal-50 text-teal-700 border-teal-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              <option value="STUDENT">STUDENT</option>
                              <option value="TEACHER">TEACHER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                u.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {u.status || "ACTIVE"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">
                            {u._count?.testAttempts ?? 0}
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              isLoading={isWorking}
                              onClick={() => handleToggleUserStatus(u)}
                              className={`text-[11px] font-bold ${
                                u.status === "ACTIVE"
                                  ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                  : "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
                              }`}
                            >
                              {u.status === "ACTIVE" ? (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: FACULTY & TEACHERS MANAGEMENT                          */}
      {/* ============================================================= */}
      {activeTab === "TEACHERS" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Faculty Members &amp; Question Creators</h3>
              <p className="text-xs text-slate-500">
                Teachers can upload papers, edit question banks, and create mock tests. They cannot delete users.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowInviteTeacherModal(true)}
              className="bg-purple-700 hover:bg-purple-800 text-xs font-bold shadow-xs"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Provision New Faculty Account
            </Button>
          </div>

          {/* Teachers Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Department / Subject</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Papers Uploaded</th>
                    <th className="py-3 px-4">Provisioned On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachersLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-purple-600 mb-2" />
                        Loading faculty roster...
                      </td>
                    </tr>
                  ) : teachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                        No faculty accounts provisioned yet. Use the button above to add a teacher.
                      </td>
                    </tr>
                  ) : (
                    teachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{t.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{t.email}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {t.department || "General Examination"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              t.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">
                          {t._count?.uploadedDocuments ?? 0} Papers
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 4: AUDIT LOGS & ADMINISTRATIVE SECURITY TRAIL             */}
      {/* ============================================================= */}
      {activeTab === "AUDIT_LOGS" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Administrative Audit Trail</h3>
              <p className="text-xs text-slate-500">
                Immutable records of paper publications, candidate suspensions, teacher invitations, and logins.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Actions</option>
                <option value="TEST_PUBLISHED">TEST_PUBLISHED</option>
                <option value="TEST_UNPUBLISHED">TEST_UNPUBLISHED</option>
                <option value="RESULTS_EMAILED">RESULTS_EMAILED</option>
                <option value="TEACHER_CREATED">TEACHER_CREATED</option>
                <option value="USER_MODIFIED">USER_MODIFIED</option>
                <option value="USER_LOGIN">USER_LOGIN</option>
              </select>

              <Button variant="outline" size="sm" onClick={fetchAuditLogs} className="text-xs">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Administrator / User</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {auditLogsLoading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-slate-600 mb-2" />
                        Loading audit logs...
                      </td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                        No audit events recorded under this filter.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                              log.action.includes("PUBLISH")
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : log.action.includes("TEACHER")
                                ? "bg-purple-50 text-purple-800 border border-purple-200"
                                : log.action.includes("USER")
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {log.userEmail || "System / Automated"}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                          {log.entity || "--"}
                        </td>
                        <td className="py-3 px-4 text-slate-700 text-xs">
                          {log.details || "--"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: PROVISION NEW TEACHER / FACULTY                        */}
      {/* ============================================================= */}
      {showInviteTeacherModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Provision Faculty Account
                </h3>
              </div>
              <button
                onClick={() => setShowInviteTeacherModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Create an authenticated teacher account. Faculty members can upload question papers and build test blueprints, but cannot delete candidate accounts.
            </p>

            {inviteFeedback && (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{inviteFeedback}</span>
              </div>
            )}

            <form onSubmit={handleProvisionTeacher} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Prof. Rajesh Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="faculty@examforge.ai"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department / Subject
                </label>
                <select
                  value={teacherDept}
                  onChange={(e) => setTeacherDept(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                >
                  <option value="Quantitative Aptitude & Mathematics">Quantitative Aptitude &amp; Mathematics</option>
                  <option value="General Intelligence & Reasoning">General Intelligence &amp; Reasoning</option>
                  <option value="English Language & Comprehension">English Language &amp; Comprehension</option>
                  <option value="General Studies & Static GK">General Studies &amp; Static GK</option>
                  <option value="General Hindi & Law (UP Police)">General Hindi &amp; Law (UP Police)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Password (Optional)
                </label>
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Leave blank to auto-generate &amp; email"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  If left blank, a secure temporary password will be generated and emailed to the teacher.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInviteTeacherModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={invitingTeacher}
                  className="text-xs font-bold bg-purple-700 hover:bg-purple-800"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Provision Faculty
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
