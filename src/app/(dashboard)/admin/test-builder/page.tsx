"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Target,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  ShieldCheck,
  Eye,
  Calendar,
  AlertCircle,
  Shuffle,
  ListOrdered,
  BookOpen,
  Search,
  X,
  RefreshCw,
  Sliders,
  Check,
} from "lucide-react";

interface ChapterItem {
  id: string;
  documentId: string | null;
  chapterId: string | null;
  chapterNumber: number;
  title: string;
  questionCount: number;
  subject: string;
}

interface SubjectItem {
  id: string;
  name: string;
  displayName: string;
  totalQuestions: number;
  chapters: ChapterItem[];
}

export default function TestBuilderPage() {
  const router = useRouter();

  // Top-level Mode Tab: MIXED_MOCK vs STANDARD_WIZARD
  const [activeBuilderTab, setActiveBuilderTab] = useState<"MIXED_MOCK" | "STANDARD_WIZARD">("MIXED_MOCK");

  // -------------------------------------------------------------
  // STATE FOR MIXED MOCK BUILDER
  // -------------------------------------------------------------
  const [subjectsData, setSubjectsData] = useState<SubjectItem[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const [mixedTitle, setMixedTitle] = useState("Maths & Reasoning Combined Full Mock");
  const [mixedCategory, setMixedCategory] = useState("SSC");
  const [mixedExamMode, setMixedExamMode] = useState<"MOCK" | "PRACTICE">("MOCK");
  const [mixedPaperMode, setMixedPaperMode] = useState<"FIXED" | "DYNAMIC">("FIXED");
  const [mixedOrderingMode, setMixedOrderingMode] = useState<"JUMBLED" | "SECTIONAL">("JUMBLED");
  const [mixedGlobalSelection, setMixedGlobalSelection] = useState<"RANDOM" | "SEQUENTIAL">("RANDOM");

  // Filter & Search
  const [subjectFilterTab, setSubjectFilterTab] = useState<string>("ALL");
  const [chapterSearchQuery, setChapterSearchQuery] = useState<string>("");

  // Map of chapterId/documentId -> { quota: number, selectionMode: "RANDOM" | "SEQUENTIAL", item: ChapterItem }
  const [selectedQuotas, setSelectedQuotas] = useState<
    Record<string, { quota: number; selectionMode: "RANDOM" | "SEQUENTIAL"; item: ChapterItem }>
  >({});

  // Marks & Duration
  const [customDuration, setCustomDuration] = useState<number | "">("");
  const [mixedMarksPerCorrect, setMixedMarksPerCorrect] = useState<number>(2.0);
  const [mixedNegativeMarks, setMixedNegativeMarks] = useState<number>(0.50);

  // Preview Modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<any[]>([]);
  const [previewBreakdown, setPreviewBreakdown] = useState<Record<string, any>>({});
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Submission State
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Fetch subjects and chapters on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoadingSubjects(true);
        const res = await fetch("/api/admin/chapters-by-subject");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load subjects");
        setSubjectsData(data.subjects || []);
      } catch (err: any) {
        setSubjectsError(err.message || "Failed to connect to chapter question bank");
      } finally {
        setLoadingSubjects(false);
      }
    }
    loadCatalog();
  }, []);

  // Compute total selected questions & marks
  const totalAllocatedQuestions = useMemo(() => {
    return Object.values(selectedQuotas).reduce((sum, entry) => sum + (Number(entry.quota) || 0), 0);
  }, [selectedQuotas]);

  const totalCalculatedMarks = totalAllocatedQuestions * mixedMarksPerCorrect;
  const autoEstimatedDuration = Math.max(15, Math.ceil(totalAllocatedQuestions * 1.2));
  const effectiveDuration = customDuration !== "" ? Number(customDuration) : autoEstimatedDuration;

  // Count selected chapters per subject
  const selectedCountBySubject = useMemo(() => {
    const counts: Record<string, { chapters: number; questions: number }> = {};
    for (const entry of Object.values(selectedQuotas)) {
      if (entry.quota > 0) {
        const s = entry.item.subject;
        if (!counts[s]) counts[s] = { chapters: 0, questions: 0 };
        counts[s].chapters += 1;
        counts[s].questions += entry.quota;
      }
    }
    return counts;
  }, [selectedQuotas]);

  // Handle quota change
  const handleSetQuota = (item: ChapterItem, quota: number) => {
    const key = item.id;
    if (quota <= 0) {
      const next = { ...selectedQuotas };
      delete next[key];
      setSelectedQuotas(next);
    } else {
      const currentMode = selectedQuotas[key]?.selectionMode || mixedGlobalSelection;
      setSelectedQuotas({
        ...selectedQuotas,
        [key]: {
          quota: Math.min(quota, item.questionCount),
          selectionMode: currentMode,
          item,
        },
      });
    }
  };

  const handleToggleChapterMode = (item: ChapterItem) => {
    const key = item.id;
    if (!selectedQuotas[key]) return;
    const current = selectedQuotas[key].selectionMode;
    setSelectedQuotas({
      ...selectedQuotas,
      [key]: {
        ...selectedQuotas[key],
        selectionMode: current === "RANDOM" ? "SEQUENTIAL" : "RANDOM",
      },
    });
  };

  // Quick helper: Set all chapters in subject to N questions
  const handleQuickSetSubject = (subjectItem: SubjectItem, quotaPerChapter: number) => {
    const next = { ...selectedQuotas };
    for (const ch of subjectItem.chapters) {
      if (quotaPerChapter <= 0) {
        delete next[ch.id];
      } else {
        next[ch.id] = {
          quota: Math.min(quotaPerChapter, ch.questionCount),
          selectionMode: mixedGlobalSelection,
          item: ch,
        };
      }
    }
    setSelectedQuotas(next);
  };

  // Prepare allocations payload
  const getAllocationsPayload = () => {
    return Object.values(selectedQuotas)
      .filter((e) => e.quota > 0)
      .map((e) => ({
        id: e.item.id,
        documentId: e.item.documentId,
        chapterId: e.item.chapterId,
        subject: e.item.subject,
        title: e.item.title,
        quota: e.quota,
        selectionMode: e.selectionMode,
      }));
  };

  // Open Preview Modal
  const handleOpenPreview = async () => {
    const allocations = getAllocationsPayload();
    if (allocations.length === 0) {
      setSubmitError("Please select at least one chapter with question quota before previewing.");
      return;
    }

    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError(null);

    try {
      const res = await fetch("/api/admin/blueprint-test/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allocations,
          orderingMode: mixedOrderingMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate preview");

      setPreviewQuestions(data.questions || []);
      setPreviewBreakdown(data.subjectBreakdown || {});
    } catch (err: any) {
      setPreviewError(err.message || "Failed to preview questions");
    } finally {
      setPreviewLoading(false);
    }
  };

  // Publish Mixed Mock Test
  const handlePublishMixedMock = async () => {
    const allocations = getAllocationsPayload();
    if (allocations.length === 0) {
      setSubmitError("Please select at least one chapter and set a question quota.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = {
        title: mixedTitle.trim(),
        category: mixedCategory,
        mode: mixedExamMode,
        paperMode: mixedPaperMode,
        orderingMode: mixedOrderingMode,
        allocations,
        durationMinutes: effectiveDuration,
        marksPerCorrect: mixedMarksPerCorrect,
        negativeMarks: mixedNegativeMarks,
      };

      const res = await fetch("/api/admin/blueprint-test/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create mixed mock test");

      setSubmitSuccess("Mixed mock test published successfully! Redirecting to Exams Catalog...");
      setTimeout(() => {
        router.push("/exams");
      }, 1000);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to publish test");
    } finally {
      setSubmitLoading(false);
    }
  };

  // -------------------------------------------------------------
  // STATE FOR CLASSIC STANDARD WIZARD (Tab 2)
  // -------------------------------------------------------------
  const [currentStep, setCurrentStep] = useState(1);
  const [classicLoading, setClassicLoading] = useState(false);
  const [classicErrorMessage, setClassicErrorMessage] = useState<string | null>(null);
  const [classicSuccessMessage, setClassicSuccessMessage] = useState<string | null>(null);

  const [title, setTitle] = useState("UP Police SI Full Mock Test 02");
  const [category, setCategory] = useState("UP_POLICE");
  const [description, setDescription] = useState("Comprehensive UPSI exam simulation with sectional qualifiers.");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [timingMode, setTimingMode] = useState<"OVERALL" | "SECTIONAL">("OVERALL");
  const [totalDurationMinutes, setTotalDurationMinutes] = useState(120);
  const [marksPerCorrect, setMarksPerCorrect] = useState(2.5);
  const [negativeMarks, setNegativeMarks] = useState(0.0);
  const [allowBackNavigation, setAllowBackNavigation] = useState(true);
  const [sectionLock, setSectionLock] = useState(false);

  const [sections, setSections] = useState([
    { name: "सामान्य हिन्दी (General Hindi)", questionCount: 40, durationMinutes: 30 },
    { name: "मूलविधि / संविधान / GK", questionCount: 40, durationMinutes: 30 },
    { name: "संख्यात्मक योग्यता (Maths)", questionCount: 40, durationMinutes: 30 },
    { name: "तार्किक परीक्षा (Reasoning)", questionCount: 40, durationMinutes: 30 },
  ]);

  const totalQuestions = sections.reduce((sum, s) => sum + Number(s.questionCount), 0);
  const totalMarks = totalQuestions * marksPerCorrect;

  const handleAddSection = () => {
    setSections([...sections, { name: "New Section", questionCount: 25, durationMinutes: 15 }]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: string, value: any) => {
    const updated = [...sections];
    (updated[index] as any)[field] = value;
    setSections(updated);
  };

  const handlePublishClassicTest = async () => {
    setClassicLoading(true);
    setClassicErrorMessage(null);

    try {
      const payload = {
        title,
        category,
        description,
        totalQuestions,
        totalMarks,
        totalDurationMinutes,
        marksPerCorrect,
        negativeMarks,
        sectionalTiming: timingMode === "SECTIONAL",
        sectionLock,
        allowBackNavigation,
        difficulty,
        sections,
      };

      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish test");

      setClassicSuccessMessage("Test created successfully! Redirecting to Exams Catalog...");
      setTimeout(() => {
        router.push("/exams");
      }, 700);
    } catch (err: any) {
      setClassicErrorMessage(err.message || "Failed to save and publish test.");
    } finally {
      setClassicLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Admin Test Builder &bull; Question Allotment Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Custom &amp; Mixed Mock Examinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cross-subject mixing, multi-chapter question quotas, and sequential vs random candidate allotment
          </p>
        </div>

        <Link href="/admin">
          <button className="text-xs font-semibold text-slate-600 hover:text-black self-start sm:self-auto">
            &larr; Back to Admin Dashboard
          </button>
        </Link>
      </div>

      {/* Top Level Builder Switch */}
      <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 max-w-xl">
        <button
          onClick={() => setActiveBuilderTab("MIXED_MOCK")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeBuilderTab === "MIXED_MOCK"
              ? "bg-white text-blue-700 shadow-xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Shuffle className="w-4 h-4 text-blue-600" />
          <span>Cross-Subject &amp; Multi-Chapter Mixer</span>
        </button>
        <button
          onClick={() => setActiveBuilderTab("STANDARD_WIZARD")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeBuilderTab === "STANDARD_WIZARD"
              ? "bg-white text-slate-900 shadow-xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4 text-slate-600" />
          <span>Standard Sectional Wizard</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* BUILDER TAB 1: CROSS-SUBJECT & MULTI-CHAPTER MIXER */}
      {/* ============================================================== */}
      {activeBuilderTab === "MIXED_MOCK" && (
        <div className="space-y-8">
          {/* Top Feedback Messages */}
          {submitError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {/* SECTION 1: EXAM BASIC SETTINGS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
              <span>Exam Identity &amp; Mode</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="text-xs font-bold text-slate-700 block mb-1">Exam Title</label>
                <input
                  type="text"
                  value={mixedTitle}
                  onChange={(e) => setMixedTitle(e.target.value)}
                  placeholder="e.g. Maths Special Mock (Profit & Loss + Percentage + Ratio)"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Category</label>
                <select
                  value={mixedCategory}
                  onChange={(e) => setMixedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="SSC">SSC (CGL / CHSL / CPO / GD)</option>
                  <option value="RAILWAY">Railway RRB (NTPC / Group D)</option>
                  <option value="UP_POLICE">UP Police / UPSI</option>
                  <option value="CUSTOM">Custom Multi-Subject Practice</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">Exam Engine Mode</label>
                <select
                  value={mixedExamMode}
                  onChange={(e) => setMixedExamMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="MOCK">CBT Mock Exam (Scorecard at end)</option>
                  <option value="PRACTICE">Instant Practice (Solution on click)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: ALLOTMENT & ORDERING STRATEGY */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Question Allotment &amp; Ordering Rules</span>
              </h3>
              <span className="text-xs text-slate-500">Configure how questions are picked and presented to candidates</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Question Selection Strategy */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Shuffle className="w-4 h-4 text-blue-600" />
                  <span>Question Selection Pool</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  How questions are chosen from each chapter&apos;s question bank:
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="globalSelection"
                      checked={mixedGlobalSelection === "RANDOM"}
                      onChange={() => setMixedGlobalSelection("RANDOM")}
                      className="text-blue-600"
                    />
                    <span>Random Sampling (Uniform Fisher-Yates)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="globalSelection"
                      checked={mixedGlobalSelection === "SEQUENTIAL"}
                      onChange={() => setMixedGlobalSelection("SEQUENTIAL")}
                      className="text-blue-600"
                    />
                    <span>Sequential Slice (Q1..Q_N order)</span>
                  </label>
                </div>
              </div>

              {/* Presentation Ordering */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-blue-600" />
                  <span>Presentation / Ordering Mode</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  How questions are displayed in the candidate&apos;s exam player:
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="orderingMode"
                      checked={mixedOrderingMode === "JUMBLED"}
                      onChange={() => setMixedOrderingMode("JUMBLED")}
                      className="text-blue-600"
                    />
                    <span>Jumbled / Mixed (Cross-subject shuffle)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="orderingMode"
                      checked={mixedOrderingMode === "SECTIONAL"}
                      onChange={() => setMixedOrderingMode("SECTIONAL")}
                      className="text-blue-600"
                    />
                    <span>Sectional Blocks (Subject by Subject)</span>
                  </label>
                </div>
              </div>

              {/* Candidate Paper Lifecycle */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Candidate Paper Generation</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Determines whether paper questions are fixed or fresh:
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="paperMode"
                      checked={mixedPaperMode === "FIXED"}
                      onChange={() => setMixedPaperMode("FIXED")}
                      className="text-blue-600"
                    />
                    <span>Fixed Test Paper (Same set for all)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="paperMode"
                      checked={mixedPaperMode === "DYNAMIC"}
                      onChange={() => setMixedPaperMode("DYNAMIC")}
                      className="text-blue-600"
                    />
                    <span>Dynamic (Fresh random draw per attempt)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: MULTI-SUBJECT & MULTI-CHAPTER SELECTION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Select Subjects, Chapters &amp; Allocate Quotas</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Check the chapters you want to include and specify how many questions to draw from each
                </p>
              </div>

              {/* Chapter Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={chapterSearchQuery}
                  onChange={(e) => setChapterSearchQuery(e.target.value)}
                  placeholder="Search chapters..."
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Subject Tabs */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => setSubjectFilterTab("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  subjectFilterTab === "ALL"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Subjects ({subjectsData.reduce((acc, s) => acc + s.chapters.length, 0)})
              </button>
              {subjectsData.map((subj) => {
                const countInfo = selectedCountBySubject[subj.name];
                return (
                  <button
                    key={subj.id}
                    onClick={() => setSubjectFilterTab(subj.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      subjectFilterTab === subj.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span>{subj.displayName}</span>
                    {countInfo && countInfo.questions > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px]">
                        {countInfo.questions} Qs
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Loading / Error States */}
            {loadingSubjects && (
              <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span>Loading authentic question bank catalogs...</span>
              </div>
            )}

            {subjectsError && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{subjectsError}</span>
              </div>
            )}

            {/* Subjects & Chapters List */}
            {!loadingSubjects && !subjectsError && (
              <div className="space-y-8">
                {subjectsData
                  .filter((subj) => subjectFilterTab === "ALL" || subjectFilterTab === subj.id)
                  .map((subj) => {
                    const filteredChapters = subj.chapters.filter((ch) =>
                      ch.title.toLowerCase().includes(chapterSearchQuery.toLowerCase())
                    );

                    if (filteredChapters.length === 0) return null;

                    const subjectSelectedQs = selectedCountBySubject[subj.name]?.questions || 0;

                    return (
                      <div key={subj.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/40">
                        {/* Subject Header */}
                        <div className="px-5 py-3.5 bg-slate-100/90 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <h4 className="font-extrabold text-slate-900 text-sm">{subj.displayName}</h4>
                            <span className="text-[11px] text-slate-500">
                              ({subj.chapters.length} Chapters &bull; {subj.totalQuestions.toLocaleString()} Questions)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {subjectSelectedQs > 0 && (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                                {subjectSelectedQs} Qs Selected
                              </span>
                            )}
                            <button
                              onClick={() => handleQuickSetSubject(subj, 10)}
                              className="px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                            >
                              +10 Qs Each
                            </button>
                            <button
                              onClick={() => handleQuickSetSubject(subj, 0)}
                              className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-200 rounded-lg border border-slate-200"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Chapters Grid */}
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {filteredChapters.map((ch) => {
                            const quotaData = selectedQuotas[ch.id];
                            const isSelected = Boolean(quotaData && quotaData.quota > 0);
                            const currentQuota = quotaData?.quota || 0;
                            const currentMode = quotaData?.selectionMode || mixedGlobalSelection;

                            return (
                              <div
                                key={ch.id}
                                className={`p-3.5 rounded-xl border transition-all ${
                                  isSelected
                                    ? "bg-white border-blue-500 shadow-xs ring-1 ring-blue-500"
                                    : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => handleSetQuota(ch, e.target.checked ? 10 : 0)}
                                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-slate-900 leading-snug truncate" title={ch.title}>
                                        {ch.title}
                                      </p>
                                      <p className="text-[11px] text-slate-400">
                                        {ch.questionCount} Qs in bank
                                      </p>
                                    </div>
                                  </label>
                                </div>

                                {/* Controls when selected */}
                                {isSelected && (
                                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                    {/* Number input */}
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-bold text-slate-500">Quota:</span>
                                      <input
                                        type="number"
                                        min="1"
                                        max={ch.questionCount}
                                        value={currentQuota}
                                        onChange={(e) => handleSetQuota(ch, parseInt(e.target.value, 10) || 0)}
                                        className="w-16 px-2 py-1 text-xs font-bold border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-blue-600"
                                      />
                                    </div>

                                    {/* Individual Mode Toggle */}
                                    <button
                                      type="button"
                                      onClick={() => handleToggleChapterMode(ch)}
                                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                        currentMode === "RANDOM"
                                          ? "bg-purple-50 text-purple-700 border-purple-200"
                                          : "bg-slate-100 text-slate-700 border-slate-200"
                                      }`}
                                      title="Toggle between Random selection and Sequential slice"
                                    >
                                      {currentMode === "RANDOM" ? "🎲 Random" : "🔢 Sequential"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* SECTION 4: SCORING & TIMER */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">4</span>
              <span>Timing &amp; Marking Scheme</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Duration (Minutes)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={`Auto: ${autoEstimatedDuration} mins`}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default: ~1.2 mins/question ({autoEstimatedDuration} min). Leave blank to auto-scale.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Marks per Correct (+)</label>
                <input
                  type="number"
                  step="0.5"
                  value={mixedMarksPerCorrect}
                  onChange={(e) => setMixedMarksPerCorrect(Number(e.target.value) || 2.0)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Negative Marks (-)</label>
                <input
                  type="number"
                  step="0.25"
                  value={mixedNegativeMarks}
                  onChange={(e) => setMixedNegativeMarks(Number(e.target.value) || 0.0)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* FLOATING BOTTOM ACTION & SUMMARY BAR */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-4 sm:px-8 py-3.5">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Selected</span>
                  <span className="font-black text-slate-900 text-base">
                    {totalAllocatedQuestions} Qs
                  </span>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-slate-400 block text-[11px]">Total Marks</span>
                  <span className="font-extrabold text-blue-600 text-sm">
                    {totalCalculatedMarks.toFixed(1)} Marks
                  </span>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <span className="text-slate-400 block text-[11px]">Duration</span>
                  <span className="font-bold text-slate-700 text-sm">
                    {effectiveDuration} Mins
                  </span>
                </div>
                <div className="hidden md:block border-l border-slate-200 pl-4">
                  <span className="text-slate-400 block text-[11px]">Subjects</span>
                  <span className="font-bold text-slate-700 text-xs">
                    {Object.keys(selectedCountBySubject).length} Subjects Included
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  disabled={totalAllocatedQuestions === 0}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>Preview Questions</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublishMixedMock}
                  disabled={totalAllocatedQuestions === 0 || submitLoading}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                >
                  {submitLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing Exam...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Create &amp; Publish Mock Test</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* QUESTION PREVIEW MODAL */}
          {previewOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span>Live Sample Paper Preview ({previewQuestions.length} Questions)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sampled according to your quotas ({mixedOrderingMode === "JUMBLED" ? "Jumbled Mixed" : "Sectional Blocks"})
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {previewLoading && (
                    <div className="py-20 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <span>Sampling questions from chapter banks...</span>
                    </div>
                  )}

                  {previewError && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{previewError}</span>
                    </div>
                  )}

                  {!previewLoading && !previewError && previewQuestions.length > 0 && (
                    <div className="space-y-4">
                      {/* Breakdown badges */}
                      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
                        {Object.entries(previewBreakdown).map(([subj, data]: [string, any]) => (
                          <div
                            key={subj}
                            className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200"
                          >
                            <span>{subj}: {data.total} Qs</span>
                          </div>
                        ))}
                      </div>

                      {/* Question items */}
                      <div className="space-y-3">
                        {previewQuestions.map((q, idx) => (
                          <div
                            key={q.id || idx}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-extrabold text-blue-700">
                                Q.{idx + 1} &bull; {q.subject}
                              </span>
                              <span className="text-[11px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                                {q.chapterTitle || q.topic}
                              </span>
                            </div>

                            <p className="font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                              {q.questionText}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                              {q.options?.map((opt: any) => {
                                const isCorrect = opt.isCorrect || opt.label === q.sourceAnswer || opt.label === q.verifiedAnswer;
                                return (
                                  <div
                                    key={opt.id || opt.label}
                                    className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                                      isCorrect
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                        : "bg-white border-slate-200 text-slate-700"
                                    }`}
                                  >
                                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] shrink-0">
                                      {opt.label}
                                    </span>
                                    <span className="truncate">{opt.text}</span>
                                    {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <button
                    onClick={handleOpenPreview}
                    disabled={previewLoading}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${previewLoading ? "animate-spin" : ""}`} />
                    <span>Re-sample Questions</span>
                  </button>

                  <button
                    onClick={() => {
                      setPreviewOpen(false);
                      handlePublishMixedMock();
                    }}
                    disabled={submitLoading}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                  >
                    Confirm &amp; Publish Test
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* BUILDER TAB 2: CLASSIC SECTIONAL WIZARD */}
      {/* ============================================================== */}
      {activeBuilderTab === "STANDARD_WIZARD" && (
        <div className="space-y-6">
          {/* Step Indicators */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            <button
              onClick={() => setCurrentStep(1)}
              className={`py-2 rounded-xl border transition-all ${
                currentStep === 1
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              1. Exam Details
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className={`py-2 rounded-xl border transition-all ${
                currentStep === 2
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              2. Sections &amp; Qs
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className={`py-2 rounded-xl border transition-all ${
                currentStep === 3
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              3. Timing &amp; Marks
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className={`py-2 rounded-xl border transition-all ${
                currentStep === 4
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              4. Preview &amp; Publish
            </button>
          </div>

          {/* Error / Success Feedback */}
          {classicErrorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{classicErrorMessage}</span>
            </div>
          )}

          {classicSuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{classicSuccessMessage}</span>
            </div>
          )}

          {/* STEP 1: EXAM BASIC DETAILS */}
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <h3 className="font-bold text-slate-900 text-base">Step 1: Exam &amp; Target Category</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Test Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. SSC CHSL Tier-I Mock Test 02"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Exam Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none"
                    >
                      <option value="SSC">Staff Selection Commission (SSC)</option>
                      <option value="UP_POLICE">UP Police / UPSI</option>
                      <option value="RAILWAY">Railway RRB</option>
                      <option value="BANKING">Banking (IBPS / SBI)</option>
                      <option value="CUSTOM">Custom Competitive Blueprint</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none"
                    >
                      <option value="EASY">Easy (Foundation / Beginners)</option>
                      <option value="MEDIUM">Medium (Actual Exam Standard)</option>
                      <option value="HARD">Hard (Advanced Qualifying Level)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description &amp; Overview</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
                >
                  <span>Next: Configure Sections</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIGURE SECTIONS */}
          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Step 2: Dynamic Exam Sections</h3>
                  <p className="text-xs text-slate-500">Configure each subject section and question allotment</p>
                </div>
                <button
                  onClick={handleAddSection}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-3">
                {sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-6">
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Section #{idx + 1} Name</label>
                      <input
                        type="text"
                        value={sec.name}
                        onChange={(e) => handleSectionChange(idx, "name", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Question Count</label>
                      <input
                        type="number"
                        value={sec.questionCount}
                        onChange={(e) => handleSectionChange(idx, "questionCount", Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-center justify-end pt-4">
                      {sections.length > 1 && (
                        <button
                          onClick={() => handleRemoveSection(idx)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
                >
                  <span>Next: Timing &amp; Marks</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TIMING & MARKS */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <h3 className="font-bold text-slate-900 text-base">Step 3: Timing &amp; Marking Scheme</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Total Duration (Minutes)</label>
                  <input
                    type="number"
                    value={totalDurationMinutes}
                    onChange={(e) => setTotalDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Marks per Correct</label>
                  <input
                    type="number"
                    step="0.5"
                    value={marksPerCorrect}
                    onChange={(e) => setMarksPerCorrect(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Negative Marks</label>
                  <input
                    type="number"
                    step="0.25"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
                >
                  <span>Next: Preview &amp; Publish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW & PUBLISH */}
          {currentStep === 4 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <h3 className="font-bold text-slate-900 text-base">Step 4: Final Verification</h3>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <p><span className="font-bold text-slate-600">Title:</span> {title}</p>
                <p><span className="font-bold text-slate-600">Category:</span> {category}</p>
                <p><span className="font-bold text-slate-600">Total Questions:</span> {totalQuestions}</p>
                <p><span className="font-bold text-slate-600">Total Marks:</span> {totalMarks}</p>
                <p><span className="font-bold text-slate-600">Duration:</span> {totalDurationMinutes} minutes</p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handlePublishClassicTest}
                  disabled={classicLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
                >
                  {classicLoading ? "Publishing..." : "Confirm & Publish Test"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
