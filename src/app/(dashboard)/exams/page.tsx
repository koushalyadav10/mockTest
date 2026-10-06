"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  Target,
  PlusCircle,
  PlayCircle,
  Lock,
  Search,
  Calendar,
  CheckCircle2,
  BarChart2,
  SlidersHorizontal,
  Globe,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  X,
  Save,
  Check,
  ChevronRight,
  Trash2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCleanChapterTitle, isAssignedExam, getExamSubject } from "@/lib/exam/tag-parser";

const SUBJECTS = [
  {
    id: "MATHS",
    name: "Mathematics",
    hindiName: "गणित",
    icon: "📐",
    active: true,
    countBadge: "30 Chapters • 6,486 Qs",
  },
  {
    id: "REASONING",
    name: "Reasoning",
    hindiName: "तर्कशक्ति",
    icon: "🧠",
    active: false,
    countBadge: "Coming Soon",
  },
  {
    id: "ENGLISH",
    name: "English Language",
    hindiName: "अंग्रेजी",
    icon: "📖",
    active: false,
    countBadge: "Coming Soon",
  },
  {
    id: "GK_GS",
    name: "GK & GS",
    hindiName: "सामान्य ज्ञान",
    icon: "🌍",
    active: true,
    countBadge: "Live Available",
  },
  {
    id: "HINDI",
    name: "General Hindi",
    hindiName: "सामान्य हिंदी",
    icon: "🇮🇳",
    active: false,
    countBadge: "Coming Soon",
  },
];

interface ExamConfigItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  mode: string; // "MOCK" | "EXAM" | "TIER_1" | "PRACTICE"
  status: string; // "PUBLISHED" | "DRAFT"
  availability: string; // "ALWAYS" | "SCHEDULED"
  startDate?: string | null;
  endDate?: string | null;
  scheduledStatus: string; // "UPCOMING" | "LIVE" | "EXPIRED"
  totalQuestions: number;
  totalMarks: number;
  totalDurationMinutes: number;
  marksPerCorrect: number;
  negativeMarks: number;
  sectionalTiming: boolean;
  sectionLock: boolean;
  navigationRules: string;
  totalAttempts?: number;
  sections?: { name: string; questionCount: number; durationMinutes?: number }[];
}

function ExamsCatalogContent() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [exams, setExams] = useState<ExamConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject");
  const [selectedSubject, setSelectedSubject] = useState<string>("MATHS");

  useEffect(() => {
    if (subjectParam) {
      const up = subjectParam.toUpperCase();
      if (["GK_GS", "GK", "GS", "GENERAL_AWARENESS"].includes(up)) setSelectedSubject("GK_GS");
      else if (["MATHS", "MATHEMATICS", "QUANT"].includes(up)) setSelectedSubject("MATHS");
      else if (["REASONING"].includes(up)) setSelectedSubject("REASONING");
      else if (["ENGLISH"].includes(up)) setSelectedSubject("ENGLISH");
      else if (["HINDI"].includes(up)) setSelectedSubject("HINDI");
    }
  }, [subjectParam]);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<"ALL" | "LIVE" | "ASSIGNED" | "UPCOMING" | "EXPIRED" | "DRAFT">("LIVE");
  const [modeFilter, setModeFilter] = useState<"ALL" | "MOCK" | "EXAM">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "DURATION">("NEWEST");

  // Admin Scheduling & Edit Modal
  const [editingExam, setEditingExam] = useState<ExamConfigItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("SSC");
  const [editMode, setEditMode] = useState<"MOCK" | "EXAM">("MOCK");
  const [editStatus, setEditStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [editAvailability, setEditAvailability] = useState<"ALWAYS" | "SCHEDULED">("ALWAYS");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editDuration, setEditDuration] = useState(60);
  const [editMarksPerCorrect, setEditMarksPerCorrect] = useState(2.0);
  const [editNegativeMarks, setEditNegativeMarks] = useState(0.5);
  const [isSavingExam, setIsSavingExam] = useState(false);
  const [editFeedback, setEditFeedback] = useState<string | null>(null);

  // Load Current User
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Fetch Exams List
  const fetchExams = () => {
    setLoading(true);
    fetch("/api/exams")
      .then((res) => res.json())
      .then((data) => {
        if (data.exams) setExams(data.exams);
      })
      .catch((err) => console.error("Error fetching exams:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const isAdminOrTeacher = currentUser?.role === "ADMIN" || currentUser?.role === "TEACHER";

  // Quick 1-Click Toggle Public / Draft status
  const handleTogglePublish = async (exam: ExamConfigItem) => {
    const nextStatus = exam.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/exams/${exam.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setExams((prev) =>
          prev.map((e) => (e.id === exam.id ? { ...e, status: nextStatus } : e))
        );
      } else {
        alert(data.error || "Failed to update exam status");
      }
    } catch (e: any) {
      alert("Error toggling status: " + e.message);
    }
  };

  // Permanent Delete Exam (Admin Only)
  const handleDeleteExam = async (exam: ExamConfigItem) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${formatCleanChapterTitle(exam.title)}"? This will delete all candidate submissions and cannot be undone.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/exams/${exam.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setExams((prev) => prev.filter((e) => e.id !== exam.id));
      } else {
        alert(data.error || "Failed to delete exam");
      }
    } catch (e: any) {
      alert("Error deleting exam: " + e.message);
    }
  };

  // Open Edit & Schedule Modal
  const handleOpenEditModal = (exam: ExamConfigItem) => {
    setEditingExam(exam);
    setEditTitle(exam.title);
    setEditCategory(exam.category || "SSC");
    setEditMode(exam.mode === "EXAM" ? "EXAM" : "MOCK");
    setEditStatus(exam.status === "DRAFT" ? "DRAFT" : "PUBLISHED");
    setEditAvailability(exam.availability === "SCHEDULED" ? "SCHEDULED" : "ALWAYS");

    // Format ISO string to datetime-local (YYYY-MM-DDTHH:mm)
    if (exam.startDate) {
      try {
        setEditStartDate(new Date(exam.startDate).toISOString().slice(0, 16));
      } catch (e) {
        setEditStartDate("");
      }
    } else {
      setEditStartDate("");
    }

    if (exam.endDate) {
      try {
        setEditEndDate(new Date(exam.endDate).toISOString().slice(0, 16));
      } catch (e) {
        setEditEndDate("");
      }
    } else {
      setEditEndDate("");
    }

    setEditDuration(exam.totalDurationMinutes || 60);
    setEditMarksPerCorrect(exam.marksPerCorrect ?? 2.0);
    setEditNegativeMarks(exam.negativeMarks ?? 0.5);
    setEditFeedback(null);
  };

  // Quick Schedule Presets Helper
  const applyPresetDays = (days: number) => {
    const now = new Date();
    const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    setEditAvailability("SCHEDULED");
    setEditStartDate(now.toISOString().slice(0, 16));
    setEditEndDate(end.toISOString().slice(0, 16));
  };

  // Save Schedule Changes
  const handleSaveExamSettings = async () => {
    if (!editingExam) return;
    try {
      setIsSavingExam(true);
      setEditFeedback(null);

      const payload: any = {
        title: editTitle.trim(),
        category: editCategory,
        mode: editMode,
        status: editStatus,
        availability: editAvailability,
        totalDurationMinutes: Number(editDuration),
        marksPerCorrect: Number(editMarksPerCorrect),
        negativeMarks: Number(editNegativeMarks),
      };

      if (editAvailability === "SCHEDULED") {
        if (!editStartDate || !editEndDate) {
          alert("Please specify both Start Date and End Date for scheduled time-based exam.");
          setIsSavingExam(false);
          return;
        }
        payload.startDate = new Date(editStartDate).toISOString();
        payload.endDate = new Date(editEndDate).toISOString();
      } else {
        payload.startDate = null;
        payload.endDate = null;
      }

      const res = await fetch(`/api/exams/${editingExam.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setEditFeedback("Exam settings and schedule saved successfully!");
        fetchExams();
        setTimeout(() => setEditingExam(null), 1200);
      } else {
        alert(data.error || "Failed to update exam");
      }
    } catch (e: any) {
      alert("Error saving exam: " + e.message);
    } finally {
      setIsSavingExam(false);
    }
  };

  // Filtered and Sorted Exams
  const filteredExams = exams
    .filter((e) => {
      const isAssigned = isAssignedExam(e);

      // Subject Module filter
      if (selectedSubject) {
        const examSub = getExamSubject(e);
        if (examSub !== selectedSubject) return false;
      }

      // Role filter: Students only see published exams
      if (!isAdminOrTeacher && e.status === "DRAFT") return false;

      // Status & Category Tab filter
      if (activeTab === "LIVE") {
        // Only published & live exams!
        if (e.status !== "PUBLISHED") return false;
        if (e.scheduledStatus !== "LIVE") return false;
        // In Live Now, students see strictly the permanent chapters!
        if (!isAdminOrTeacher && isAssigned) return false;
      } else if (activeTab === "ASSIGNED") {
        // Assigned CBT tests only!
        if (!isAssigned) return false;
        if (!isAdminOrTeacher && e.status !== "PUBLISHED") return false;
      } else if (activeTab === "UPCOMING") {
        if (e.scheduledStatus !== "UPCOMING") return false;
        if (!isAdminOrTeacher && e.status !== "PUBLISHED") return false;
      } else if (activeTab === "EXPIRED") {
        if (e.scheduledStatus !== "EXPIRED") return false;
        if (!isAdminOrTeacher && e.status !== "PUBLISHED") return false;
      } else if (activeTab === "DRAFT") {
        if (e.status !== "DRAFT") return false;
      } else if (activeTab === "ALL") {
        if (!isAdminOrTeacher && e.status !== "PUBLISHED") return false;
      }

      // Mode filter
      if (modeFilter === "MOCK") {
        if (e.mode === "EXAM" || isAssigned) return false;
      } else if (modeFilter === "EXAM") {
        if (e.mode !== "EXAM" && !isAssigned) return false;
      }

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        return (
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "DURATION") {
        return b.totalDurationMinutes - a.totalDurationMinutes;
      }
      return 0; // default order from API
    });

  // Calculate accurate live counts
  const liveCount = exams.filter(
    (e) => e.scheduledStatus === "LIVE" && e.status === "PUBLISHED" && (!isAdminOrTeacher ? !isAssignedExam(e) : true)
  ).length;
  const chaptersCount = exams.filter((e) => !isAssignedExam(e) && e.status === "PUBLISHED").length;
  const assignedAllCount = exams.filter((e) => isAssignedExam(e)).length;
  const assignedPublishedCount = exams.filter((e) => isAssignedExam(e) && e.status === "PUBLISHED").length;
  const upcomingCount = exams.filter(
    (e) => e.scheduledStatus === "UPCOMING" && (isAdminOrTeacher || e.status === "PUBLISHED")
  ).length;
  const draftCount = exams.filter((e) => e.status === "DRAFT").length;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans">
      {/* 0. SUBJECT CURRICULUM SELECTION CARDS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>📚 Subject Curriculum Modules</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Select a subject to view topic chapter tests</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
          {SUBJECTS.map((sub) => {
            const isSelected = selectedSubject === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubject(sub.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/50"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs"
                }`}
              >
                <div className="text-xl sm:text-2xl mb-1">{sub.icon}</div>
                <div className={`font-bold text-xs sm:text-sm tracking-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                  {sub.name}
                </div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  {sub.hindiName}
                </div>
                <div className="mt-2.5">
                  {(() => {
                    const subCount = exams.filter(
                      (e) => getExamSubject(e) === sub.id && (isAdminOrTeacher || e.status === "PUBLISHED")
                    ).length;
                    const badgeText =
                      sub.id === "MATHS"
                        ? "30 Chapters • 6,486 Qs"
                        : subCount > 0
                        ? `${subCount} Tests Available`
                        : sub.countBadge;
                    const isAvailable = sub.active || subCount > 0;

                    return (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isAvailable
                            ? isSelected
                              ? "bg-amber-400 text-slate-950 font-bold"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isSelected
                            ? "bg-slate-800 text-slate-300 border border-slate-700"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {badgeText}
                      </span>
                    );
                  })()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. TOP THREE ANALYSIS TABS (Matching Reference Screenshot 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        <Link
          href="/analytics"
          className="p-3.5 sm:p-4 rounded-xl bg-[#ffd6d6] hover:bg-[#ffc4c4] border border-rose-200 text-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <BarChart2 className="w-4 h-4 text-rose-700 shrink-0" />
          <span>Area Wise Analysis</span>
        </Link>

        <Link
          href="/history"
          className="p-3.5 sm:p-4 rounded-xl bg-[#c5f0ee] hover:bg-[#b0eae7] border border-teal-200 text-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span>Cumulative Analysis</span>
        </Link>

        <Link
          href="/history"
          className="p-3.5 sm:p-4 rounded-xl bg-[#ffeed0] hover:bg-[#ffe3b5] border border-amber-200 text-center font-bold text-slate-800 text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Target className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Test Specific Analysis</span>
        </Link>
      </div>

      {/* Admin Privilege Banner */}
      {isAdminOrTeacher && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">Administrator &amp; Faculty Control Center</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage live status, public visibility, time-based windows (days/dates), and mode (Mock vs Official Exam).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/question-bank">
              <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-white text-xs">
                Question Bank
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="primary" size="sm" className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700">
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                Upload &amp; Extract Paper
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 2. SUB-FILTERS & TABS (Screenshot 4 + Advanced Schedulers) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 touch-pan-x w-full sm:w-auto">
            {isAdminOrTeacher && (
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === "ALL"
                    ? "bg-[#5a4bda] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Tests ({exams.length})
              </button>
            )}

            <button
              onClick={() => setActiveTab("LIVE")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "LIVE"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Permanent Chapters ({chaptersCount})</span>
            </button>

            <button
              onClick={() => setActiveTab("ASSIGNED")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "ASSIGNED"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200/60"
              }`}
            >
              <span>🎯</span>
              <span>
                Assigned CBT Tests ({isAdminOrTeacher ? assignedAllCount : assignedPublishedCount})
              </span>
            </button>

            <button
              onClick={() => setActiveTab("UPCOMING")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === "UPCOMING"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60"
              }`}
            >
              Upcoming ({upcomingCount})
            </button>

            {isAdminOrTeacher && (
              <button
                onClick={() => setActiveTab("DRAFT")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                  activeTab === "DRAFT"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Private Drafts ({draftCount})</span>
              </button>
            )}
          </div>

          {/* Mode Pill Filter: MOCK vs OFFICIAL EXAM */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 self-start sm:self-auto">
            <button
              onClick={() => setModeFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                modeFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-bold" : "hover:text-slate-900"
              }`}
            >
              All Modes
            </button>
            <button
              onClick={() => setModeFilter("EXAM")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                modeFilter === "EXAM" ? "bg-white text-indigo-700 shadow-2xs font-bold" : "hover:text-slate-900"
              }`}
            >
              CBT Exams
            </button>
            <button
              onClick={() => setModeFilter("MOCK")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                modeFilter === "MOCK" ? "bg-white text-purple-700 shadow-2xs font-bold" : "hover:text-slate-900"
              }`}
            >
              Mock Practice
            </button>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Exam or Paper Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 w-full bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 ml-auto">
            <span>Sort:</span>
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none"
            >
              <option value="NEWEST">Default Order</option>
              <option value="DURATION">Duration (High to Low)</option>
            </select>
          </div>
        </div>

        {/* 3. TEST LISTING (Responsive Mobile Cards & Desktop Table) */}
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading examination catalog...
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-3xl mx-auto shadow-2xs">
              {SUBJECTS.find((s) => s.id === selectedSubject)?.icon || "📚"}
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                {SUBJECTS.find((s) => s.id === selectedSubject)?.name} Module
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                No active examinations found in <strong>{SUBJECTS.find((s) => s.id === selectedSubject)?.name}</strong> for the selected tab.
              </p>
            </div>
            {isAdminOrTeacher && (
              <div className="pt-2">
                <Link href={`/upload`}>
                  <Button variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
                    Upload &amp; Create Paper for this Subject &rarr;
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExams.map((exam) => {
              const isAssigned = isAssignedExam(exam);
              const isExamMode = exam.mode === "EXAM" || isAssigned;
              const isScheduled = exam.availability === "SCHEDULED";
              const isDraft = exam.status === "DRAFT";
              const isLive = exam.scheduledStatus === "LIVE" && !isDraft;
              const isUpcoming = exam.scheduledStatus === "UPCOMING" && !isDraft;
              const isExpired = exam.scheduledStatus === "EXPIRED";

              return (
                <div
                  key={exam.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isDraft
                      ? "bg-slate-50/70 border-slate-300/80 border-dashed"
                      : "bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs border-slate-200/90"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Exam Details */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Mode Badge */}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                            isAssigned
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : isExamMode
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {isAssigned ? "🎯 Assigned CBT Exam" : isExamMode ? "Official CBT Exam" : "Practice Mock"}
                        </span>

                        {/* Scheduled / Availability Status Badge */}
                        {isLive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Now
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            Upcoming
                          </span>
                        )}
                        {isExpired && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Closed / Expired
                          </span>
                        )}

                        {/* Public / Private Badge */}
                        {isDraft ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            Draft (Hidden)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Public
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {exam.category}
                        </span>
                      </div>

                      <h3
                        onClick={() => router.push(`/exams/${exam.id}`)}
                        className="font-bold text-slate-900 text-base sm:text-lg tracking-tight cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                      >
                        <span>{formatCleanChapterTitle(exam.title)}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </h3>

                      {exam.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">{exam.description}</p>
                      )}

                      {/* Time Window & Exam Metrics */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {!isScheduled
                              ? "Unlimited Access (Always Available)"
                              : `${exam.startDate ? new Date(exam.startDate).toLocaleDateString() : "--"} to ${
                                  exam.endDate ? new Date(exam.endDate).toLocaleDateString() : "--"
                                }`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{exam.totalDurationMinutes} Mins Duration</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {exam.totalQuestions} Questions &bull; {exam.totalMarks} Marks
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          (Correct: +{exam.marksPerCorrect} &bull; Negative: -{exam.negativeMarks})
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons & Admin Controls */}
                    <div className="flex flex-wrap md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {/* Admin Quick Controls */}
                      {isAdminOrTeacher && (
                        <div className="flex items-center gap-1.5">
                          {/* 1-Click Publish/Unpublish */}
                          <button
                            onClick={() => handleTogglePublish(exam)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1 ${
                              exam.status === "PUBLISHED"
                                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            }`}
                            title={exam.status === "PUBLISHED" ? "Make Private / Draft" : "Make Public for Candidates"}
                          >
                            {exam.status === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">
                              {exam.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                            </span>
                          </button>

                          {/* 1-Click Email All Candidates */}
                          {currentUser?.role === "ADMIN" && (
                            <button
                              onClick={async () => {
                                if (
                                  !confirm(
                                    `Dispatch official scorecards via email to all candidates who completed "${exam.title}"?`
                                  )
                                ) {
                                  return;
                                }
                                try {
                                  const res = await fetch(`/api/exams/${exam.id}/publish-results`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ emailAll: true }),
                                  });
                                  const data = await res.json();
                                  alert(data.message || "Scorecards dispatched via email!");
                                } catch (e: any) {
                                  alert("Failed to send emails: " + e.message);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors flex items-center gap-1"
                              title="Broadcast scorecards via email to all candidates who completed this exam"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Email All</span>
                            </button>
                          )}

                          {/* Edit Schedule / Mode */}
                          <button
                            onClick={() => handleOpenEditModal(exam)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Edit Timing, Dates, Mode and Controls"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Configure</span>
                          </button>

                          {/* Candidate Scores & Submissions (Admin Only) */}
                          {currentUser?.role === "ADMIN" && (
                            <Link
                              href={`/admin?tab=SUBMISSIONS&examId=${exam.id}`}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors flex items-center gap-1"
                              title="View candidate submissions, marks, and detailed scorecards for this exam"
                            >
                              <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">
                                Scores {exam.totalAttempts ? `(${exam.totalAttempts})` : ""}
                              </span>
                            </Link>
                          )}

                          {/* 1-Click Permanent Delete Test (Admin Only) */}
                          <button
                            onClick={() => handleDeleteExam(exam)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Permanently Delete Test"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      )}

                      {/* Launch Test Button */}
                      <div>
                        {isUpcoming && !isAdminOrTeacher ? (
                          <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold border border-slate-200 text-center">
                            Opens on {exam.startDate ? new Date(exam.startDate).toLocaleDateString() : "--"}
                          </div>
                        ) : isExpired && !isAdminOrTeacher ? (
                          <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold border border-slate-200 text-center">
                            Examination Closed
                          </div>
                        ) : (
                          <button
                            onClick={() => router.push(`/exams/${exam.id}`)}
                            className={`px-4 sm:px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 active:scale-98 ${
                              isExamMode
                                ? "bg-indigo-600 hover:bg-indigo-700"
                                : "bg-[#5a4bda] hover:bg-[#4838cc]"
                            }`}
                          >
                            <PlayCircle className="w-4 h-4" />
                            <span>
                              {isUpcoming
                                ? "Preview (Admin)"
                                : isAssigned
                                ? "Take Assigned Test"
                                : isAdminOrTeacher
                                ? "Open Chapter Studio"
                                : "Practice Chapter"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================= */}
      {/* 4. ADMIN SCHEDULE & CONTROL MODAL                             */}
      {/* ============================================================= */}
      {editingExam && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Configure Exam &amp; Time Window</h3>
                  <p className="text-[11px] text-slate-400">Set availability dates, live mode, and permissions</p>
                </div>
              </div>
              <button
                onClick={() => setEditingExam(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {editFeedback && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{editFeedback}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                />
              </div>

              {/* Exam Mode: MOCK vs OFFICIAL EXAM */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Mode</label>
                  <select
                    value={editMode}
                    onChange={(e: any) => setEditMode(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="MOCK">Practice Mock (Instant Review)</option>
                    <option value="EXAM">Official CBT Exam (Proctored)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Public Visibility</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="PUBLISHED">Published (Visible to Students)</option>
                    <option value="DRAFT">Private Draft (Admin/Teacher Only)</option>
                  </select>
                </div>
              </div>

              {/* Availability Type: Unlimited vs Time-Based Window */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-800">
                  Time-Based Scheduling &amp; Availability
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditAvailability("ALWAYS")}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                      editAvailability === "ALWAYS"
                        ? "border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold">♾️ Unlimited</div>
                    <div className="text-[10px] text-slate-500 font-normal">Open 24/7 with no expiration date</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditAvailability("SCHEDULED")}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                      editAvailability === "SCHEDULED"
                        ? "border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold">⏳ Time-Based</div>
                    <div className="text-[10px] text-slate-500 font-normal">Active only during specific dates/hours</div>
                  </button>
                </div>

                {/* If Time-Based Window is selected, show start & end date pickers & presets */}
                {editAvailability === "SCHEDULED" && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-500">Quick Presets:</span>
                      <button
                        type="button"
                        onClick={() => applyPresetDays(1)}
                        className="px-2 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-semibold hover:bg-slate-100"
                      >
                        Next 24 Hours
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetDays(3)}
                        className="px-2 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-semibold hover:bg-slate-100"
                      >
                        3 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetDays(7)}
                        className="px-2 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-semibold hover:bg-slate-100"
                      >
                        1 Week
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Start Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={editStartDate}
                          onChange={(e) => setEditStartDate(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          End Date &amp; Time
                        </label>
                        <input
                          type="datetime-local"
                          value={editEndDate}
                          onChange={(e) => setEditEndDate(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timing & Scoring Parameters */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                    min={5}
                    max={360}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks/Correct</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editMarksPerCorrect}
                    onChange={(e) => setEditMarksPerCorrect(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Negative Marks</label>
                  <input
                    type="number"
                    step="0.25"
                    value={editNegativeMarks}
                    onChange={(e) => setEditNegativeMarks(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingExam(null)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isSavingExam}
                onClick={handleSaveExamSettings}
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                Save &amp; Apply Schedule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamsCatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading catalog...</div>}>
      <ExamsCatalogContent />
    </Suspense>
  );
}
