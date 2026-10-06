"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
  Users,
  Play,
  Download,
  Lock,
  Layers,
  Sparkles,
  BarChart2,
  AlertCircle,
  Award,
  ChevronRight,
  Eye,
  Sliders,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCleanChapterTitle } from "@/lib/exam/tag-parser";

const EXAM_FILTERS = ["ALL", "CHSL", "CGL", "CPO", "MTS", "Selection Post"];

export default function DedicatedChapterPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [exam, setExam] = useState<any>(null);
  const [userAttempt, setUserAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subtopics, setSubtopics] = useState<string[]>([]);

  // Admin Configuration States
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedExam, setSelectedExam] = useState("ALL");
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [enableInstantFeedback, setEnableInstantFeedback] = useState(false);

  // Negative Marking & Marks
  const [enableNegativeMarking, setEnableNegativeMarking] = useState(true);
  const [marksPerCorrect, setMarksPerCorrect] = useState(2.0);
  const [negativeMarks, setNegativeMarks] = useState(0.5);

  // Time Window Allotment
  const [allotmentDays, setAllotmentDays] = useState<number | null>(null); // null = Unlimited

  // Result Holding Control
  const [holdResults, setHoldResults] = useState(true);

  // Loading States
  const [isLaunching, setIsLaunching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  // Fetch Current User
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Fetch Exam Data & Subtopics
  useEffect(() => {
    setLoading(true);
    fetch(`/api/exams/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.exam) {
          setExam(data.exam);
          setMarksPerCorrect(data.exam.marksPerCorrect ?? 2.0);
          setNegativeMarks(data.exam.negativeMarks ?? 0.5);
          setEnableNegativeMarking((data.exam.negativeMarks ?? 0.5) > 0);
        }
        if (data.userAttempt) {
          setUserAttempt(data.userAttempt);
        }
      })
      .catch((err) => console.error("Error fetching exam:", err))
      .finally(() => setLoading(false));

    fetch(`/api/exams/${params.id}/subtopics`)
      .then((res) => res.json())
      .then((data) => {
        if (data.subtopics && Array.isArray(data.subtopics)) {
          setSubtopics(data.subtopics);
        }
      })
      .catch(() => {});
  }, [params.id]);

  const isAdminOrTeacher = currentUser?.role === "ADMIN" || currentUser?.role === "TEACHER";

  // Calculate deadline string if allotmentDays is set
  const getDeadlineString = (days: number) => {
    const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Launch test for self
  const handleStartSelfTest = async () => {
    try {
      setIsLaunching(true);
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examConfigId: exam.id,
          subtopicFilter: selectedType !== "ALL" ? selectedType : undefined,
          examFilter: selectedExam !== "ALL" ? selectedExam : undefined,
          shuffle: shuffleQuestions,
          mode: enableInstantFeedback && isAdminOrTeacher ? "PRACTICE" : "MOCK",
        }),
      });

      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(`/exams/${exam.id}`)}`);
        return;
      }

      const data = await res.json();
      if (data.testAttemptId) {
        router.push(
          `/mock/${data.testAttemptId}/test?instantFeedback=${enableInstantFeedback && isAdminOrTeacher ? "true" : "false"}`
        );
      } else {
        alert(data.error || "Could not launch test session");
      }
    } catch (e: any) {
      alert("Error starting test: " + e.message);
    } finally {
      setIsLaunching(false);
    }
  };

  // Allot & Assign to All Candidates (Admin Only)
  const handleAssignToCandidates = async () => {
    try {
      setIsAssigning(true);
      setBroadcastFeedback(null);

      const effectiveNegative = enableNegativeMarking ? Number(negativeMarks) : 0.0;

      const res = await fetch("/api/exams/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          subtopicFilter: selectedType !== "ALL" ? selectedType : undefined,
          examFilter: selectedExam !== "ALL" ? selectedExam : undefined,
          shuffle: shuffleQuestions,
          instantFeedback: false, // Students NEVER get instant feedback during test
          marksPerCorrect: Number(marksPerCorrect),
          negativeMarks: effectiveNegative,
          allotmentDays: allotmentDays,
          holdResults: holdResults,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBroadcastFeedback(
          data.message || "Test has been successfully assigned and made available to all candidates!"
        );
      } else {
        alert(data.error || "Failed to assign test");
      }
    } catch (e: any) {
      alert("Error assigning test: " + e.message);
    } finally {
      setIsAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading chapter details...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Chapter Not Found</h2>
        <p className="text-sm text-slate-500">The requested chapter could not be located in the catalog.</p>
        <Link href="/exams">
          <Button variant="primary" size="md">
            Return to Examination Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const cleanTitle = formatCleanChapterTitle(exam.title);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* 1. Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          href="/exams"
          className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Examinations</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-700">Quantitative Aptitude (Maths)</span>
        <span>/</span>
        <span className="font-semibold text-slate-900 truncate max-w-xs">{cleanTitle}</span>
      </div>

      {/* 2. Hero Chapter Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
              Aditya Ranjan 6500+ TCS
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
              {exam.category || "SSC"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Strict Sequential Order (1..{exam.totalQuestions})</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{cleanTitle}</h1>
          {exam.description && (
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">{exam.description}</p>
          )}
        </div>

        {/* Chapter Metrics Bar */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-200 border-t border-slate-700/80">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">{exam.totalQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">{exam.totalDurationMinutes} Minutes Duration</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">
              +{exam.marksPerCorrect} / -{exam.negativeMarks} Marks
            </span>
          </div>
        </div>
      </div>

      {/* 3. Previous Student Attempt / Report Card Banner (if attempted) */}
      {userAttempt && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You Have Previously Completed This Chapter Test</span>
            </div>
            <p className="text-xs text-slate-600">
              Score: <strong className="text-slate-900">{userAttempt.finalScore.toFixed(1)}</strong> / {exam.totalMarks} Marks
              &bull; Accuracy: <strong>{userAttempt.accuracy.toFixed(1)}%</strong> &bull; Completed on{" "}
              {new Date(userAttempt.completedAt).toLocaleDateString()}
            </p>
          </div>

          <Link href={`/mock/${userAttempt.id}/result`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-emerald-300 text-emerald-800 hover:bg-emerald-50 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download Report Card &amp; Review Solutions</span>
            </Button>
          </Link>
        </div>
      )}

      {/* 4. Student Practice Box */}
      {!isAdminOrTeacher && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Official Computer Based Test (CBT) Practice</h3>
            <p className="text-xs text-slate-500">
              Test will open in authentic full-screen CBT proctored mode with official countdown timer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Questions</span>
              <p className="text-base font-extrabold text-slate-900">{exam.totalQuestions} MCQs</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Marking Scheme</span>
              <p className="text-base font-extrabold text-slate-900">
                +{exam.marksPerCorrect} Correct &bull; -{exam.negativeMarks} Negative
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Duration</span>
              <p className="text-base font-extrabold text-slate-900">{exam.totalDurationMinutes} Mins</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>
              <strong>Authentic Exam Discipline:</strong> Detailed solutions and report cards will be released upon
              completion in accordance with instructor evaluation guidelines.
            </span>
          </div>

          <Button
            onClick={handleStartSelfTest}
            disabled={isLaunching}
            className="w-full py-4 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isLaunching ? "Launching CBT Session..." : `Start Full Chapter Test (${exam.totalQuestions} Qs)`}</span>
          </Button>
        </div>
      )}

      {/* 5. Admin Full Configuration & Allotment Studio */}
      {isAdminOrTeacher && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">
                  Instructor Control Studio &amp; Assignment Console
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Customize marking schemes, apply topic/shift filters, set candidate deadlines, and control result release.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
              Admin Mode
            </span>
          </div>

          {/* Feedback banner */}
          {broadcastFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{broadcastFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Marking Scheme & Time Allotment */}
            <div className="space-y-6">
              {/* Negative Marking & Scores */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Negative Marking &amp; Scoring Scheme
                    </h4>
                    <p className="text-[11px] text-slate-500">Configure penalty and marks per correct MCQ</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={enableNegativeMarking}
                      onChange={(e) => setEnableNegativeMarking(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>Negative Marking {enableNegativeMarking ? "ON" : "OFF"}</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Marks per Correct (+):</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={marksPerCorrect}
                      onChange={(e) => setMarksPerCorrect(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Negative Penalty (-):</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      disabled={!enableNegativeMarking}
                      value={enableNegativeMarking ? negativeMarks : 0}
                      onChange={(e) => setNegativeMarks(Number(e.target.value))}
                      className={`w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                        !enableNegativeMarking ? "bg-slate-100 text-slate-400" : "bg-white text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Time Window Allotment & Deadline */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Time-Based Allotment &amp; Deadline</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Set how long candidates have to complete this allotted test
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Unlimited", value: null },
                    { label: "1 Day (24 hrs)", value: 1 },
                    { label: "2 Days (48 hrs)", value: 2 },
                    { label: "3 Days", value: 3 },
                    { label: "7 Days (1 Week)", value: 7 },
                  ].map((preset) => (
                    <button
                      key={String(preset.value)}
                      type="button"
                      onClick={() => setAllotmentDays(preset.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        allotmentDays === preset.value
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {allotmentDays !== null && (
                  <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
                    ⏰ Candidates must complete before: <strong>{getDeadlineString(allotmentDays)}</strong>
                  </div>
                )}
              </div>

              {/* Result Holding & Privacy Control */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Result Holding &amp; Privacy Policy</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Control when students can see their score and solutions</p>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="resultPolicy"
                      checked={holdResults}
                      onChange={() => setHoldResults(true)}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800">🔒 Hold Results (Recommended for Proctored Tests)</span>
                      <p className="text-[11px] text-slate-500">
                        Students see &quot;Submitted - Pending Review&quot;. You release the results or email scorecards
                        when all candidates finish.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="resultPolicy"
                      checked={!holdResults}
                      onChange={() => setHoldResults(false)}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="font-bold text-slate-800">🌐 Immediate Release</span>
                      <p className="text-[11px] text-slate-500">
                        Students instantly see scores, rankings, and full step-by-step solutions upon clicking Submit.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Question Filtering & Diagnostic Shuffling */}
            <div className="space-y-6">
              {/* Type / Subtopic Filter */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Select Question Type / Subtopic</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Focus practice on a specific chapter concept or type</p>
                </div>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="ALL">All Types Combined (Whole Chapter - {exam.totalQuestions} Qs)</option>
                  {subtopics.map((st, idx) => (
                    <option key={st} value={st}>
                      Type {idx + 1}: {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Shift Filter */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Filter by Target Exam Shift</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Isolate questions asked in specific SSC exams</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {EXAM_FILTERS.map((ef) => (
                    <button
                      key={ef}
                      type="button"
                      onClick={() => setSelectedExam(ef)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedExam === ef
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {ef === "ALL" ? "All Shifts" : ef}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mix & Shuffle Toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Shuffle / Mix Questions &amp; Options</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Randomize question presentation order for diagnostic testing</p>
                </div>
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Pre-Test Learning Mode Toggle (Admin Preview Only) */}
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Enable Learning Mode (Instant Answers for Preview)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Reveals Green/Red solution immediately upon clicking an option during self preview.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableInstantFeedback}
                  onChange={(e) => setEnableInstantFeedback(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-blue-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleStartSelfTest}
              disabled={isLaunching || isAssigning}
              className="py-3 text-slate-800 border-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <Play className="w-3.5 h-3.5 fill-slate-800" />
              <span>{isLaunching ? "Launching..." : "Test for Self (Admin Preview)"}</span>
            </Button>

            <Button
              onClick={handleAssignToCandidates}
              disabled={isLaunching || isAssigning}
              className="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center justify-center gap-2"
            >
              <Users className="w-3.5 h-3.5 text-white" />
              <span>{isAssigning ? "Allotting..." : "Allot & Assign to All Candidates"}</span>
            </Button>

            <Link href={`/admin?tab=SUBMISSIONS&examId=${exam.id}`}>
              <Button
                variant="outline"
                className="w-full py-3 bg-emerald-50 text-emerald-800 border-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-100"
              >
                <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>View Submissions &amp; Reports</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
