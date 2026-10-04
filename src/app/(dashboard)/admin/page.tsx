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
} from "lucide-react";
import { Button } from "@/components/ui/Button";

type AdminTab = "OVERVIEW" | "USERS" | "TEACHERS" | "AUDIT_LOGS";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("OVERVIEW");

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

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (activeTab === "USERS") fetchUsers();
    if (activeTab === "TEACHERS") fetchTeachers();
    if (activeTab === "AUDIT_LOGS") fetchAuditLogs();
  }, [activeTab, userRoleFilter, userStatusFilter, auditActionFilter]);

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
