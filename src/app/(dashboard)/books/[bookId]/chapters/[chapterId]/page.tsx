"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PlayCircle,
  ChevronRight,
  Clock,
  Award,
  Bookmark,
  ExternalLink,
  Flame,
  X,
  Loader2,
  Eye,
  EyeOff,
  Filter,
  Layers,
  GraduationCap,
  FileCheck2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { MathRenderer } from "@/components/math/MathRenderer";

type ChapterTab = "learn" | "examples" | "solved" | "practice" | "pyqs" | "revision" | "mistakes";

export default function ChapterStudyHubPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookId = params?.bookId as string;
  const chapterId = params?.chapterId as string;

  // Active Tab
  const initialTab = (searchParams.get("tab") as ChapterTab) || "learn";
  const [activeTab, setActiveTab] = useState<ChapterTab>(initialTab);

  // Data State
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Solved Questions Tab State
  const [revealedAnswers, setRevealedAnswers] = useState<{ [qId: string]: boolean }>({});
  const [questionDifficultyFilter, setQuestionDifficultyFilter] = useState("ALL");

  // Practice Tab Config State
  const [practiceCount, setPracticeCount] = useState(20);
  const [practiceMode, setPracticeMode] = useState<"PRACTICE" | "MOCK">("PRACTICE");
  const [rangeFrom, setRangeFrom] = useState<number | "">("");
  const [rangeTo, setRangeTo] = useState<number | "">("");
  const [practiceDifficulty, setPracticeDifficulty] = useState("ALL");
  const [practiceSource, setPracticeSource] = useState("ALL");
  const [isGeneratingPractice, setIsGeneratingPractice] = useState(false);

  // Fetch Chapter Details
  const fetchChapterData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/books/${bookId}/chapters/${chapterId}`);
      if (!res.ok) throw new Error("Failed to load chapter");
      const json = await res.json();
      if (json?.success) {
        setData(json);
      }
    } catch (e) {
      console.error("Error loading chapter:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId && chapterId) {
      fetchChapterData();
    }
  }, [bookId, chapterId]);

  // Handle Practice Generation
  const handleLaunchPractice = async (overrideParams?: any) => {
    try {
      setIsGeneratingPractice(true);
      const payload: any = {
        bookId,
        chapterIds: [chapterId],
        questionCount: practiceCount,
        mode: practiceMode,
        difficulty: practiceDifficulty,
        sourceFilter: practiceSource,
        ...overrideParams,
      };

      if (rangeFrom && rangeTo && Number(rangeFrom) >= 1 && Number(rangeTo) >= Number(rangeFrom)) {
        payload.rangeFrom = Number(rangeFrom);
        payload.rangeTo = Number(rangeTo);
      }

      const res = await fetch("/api/books/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        router.push(`/login?callbackUrl=/books/${bookId}/chapters/${chapterId}`);
        return;
      }

      const respData = await res.json();
      if (respData?.testAttemptId) {
        router.push(
          `/mock/${respData.testAttemptId}/test?instantFeedback=${
            payload.mode === "PRACTICE"
          }`
        );
      } else {
        alert(respData.error || "Failed to create practice attempt");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsGeneratingPractice(false);
    }
  };

  const toggleRevealAnswer = (qId: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Loading chapter intelligence hub...</p>
      </div>
    );
  }

  if (!data?.chapter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <h2 className="text-lg font-bold text-slate-800">Chapter not found</h2>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Books Library</span>
        </Link>
      </div>
    );
  }

  const { chapter, learn, examples, questions, pyqs, revision, myMistakes, progress } = data;

  // Filter questions for the Solved tab
  const displayedSolvedQuestions = questions.filter((q: any) => {
    if (questionDifficultyFilter === "ALL") return true;
    return q.difficulty === questionDifficultyFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-sans">
      {/* 1. TOP BREADCRUMBS & NAVIGATION */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link
            href="/books"
            className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Books &amp; Learning</span>
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">{chapter.book?.title}</span>
          <span>/</span>
          <span className="font-extrabold text-slate-900">
            Chapter {chapter.chapterNumber}
          </span>
        </div>

        {/* Page citation & Volume Badge */}
        <div className="flex items-center gap-2">
          {chapter.volume && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
              Vol {chapter.volume.volumeNumber}
            </span>
          )}
          {chapter.startPage && chapter.endPage && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[11px] font-bold">
              Pages {chapter.startPage} &ndash; {chapter.endPage}
            </span>
          )}
        </div>
      </div>

      {/* 2. CHAPTER HERO BANNER */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white">
                Chapter {chapter.chapterNumber}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {chapter.book?.subject}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {chapter.title}
            </h1>

            {chapter.summary && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {chapter.summary}
              </p>
            )}

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                <strong>{chapter.counts?.questions || 0}</strong> Questions
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <strong>{chapter.counts?.theory || 0}</strong> Theory Blocks
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <strong>{chapter.counts?.examples || 0}</strong> Examples
              </span>
              {chapter.counts?.pyqs > 0 && (
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <strong>{chapter.counts.pyqs}</strong> PYQs
                </span>
              )}
            </div>
          </div>

          {/* Quick Practice Launcher Button */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => handleLaunchPractice({ mode: "PRACTICE", questionCount: 20 })}
              disabled={isGeneratingPractice}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Instant Practice (20 Qs)</span>
            </button>

            <button
              onClick={() => handleLaunchPractice({ mode: "MOCK", questionCount: 25 })}
              disabled={isGeneratingPractice}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Timed CBT Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 7-TAB NAVIGATION */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: "learn", label: "Learn", count: chapter.counts?.theory, icon: BookOpen },
          { id: "examples", label: "Examples", count: chapter.counts?.examples, icon: Sparkles },
          { id: "solved", label: "Solved Questions", count: chapter.counts?.questions, icon: CheckCircle2 },
          { id: "practice", label: "Practice", icon: PlayCircle },
          { id: "pyqs", label: "PYQs", count: chapter.counts?.pyqs, icon: Flame },
          { id: "revision", label: "Revision", count: revision?.length, icon: Award },
          { id: "mistakes", label: "My Mistakes", count: chapter.counts?.mistakes, icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ChapterTab)}
              className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 shrink-0 ${
                isActive
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB 1: LEARN (Theory, Rules, Exceptions, Facts) */}
      {activeTab === "learn" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Theory, Grammatical Rules &amp; Conceptual Notes ({learn?.length || 0})
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Source: {chapter.book?.title}
            </span>
          </div>

          {learn?.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">No theory blocks found for this chapter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {learn.map((item: any, idx: number) => {
                const badgeColor =
                  item.contentType === "RULE"
                    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                    : item.contentType === "EXCEPTION"
                    ? "bg-rose-100 text-rose-800 border-rose-200"
                    : item.contentType === "FACT"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-slate-100 text-slate-800 border-slate-200";

                return (
                  <div
                    key={item.id || idx}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${badgeColor}`}
                        >
                          {item.contentType}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {item.title}
                        </h3>
                      </div>

                      {item.sourcePage && (
                        <span className="text-[11px] text-slate-400 font-bold">
                          Page {item.sourcePage}
                        </span>
                      )}
                    </div>

                    {/* Content Text with KaTeX */}
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                      <MathRenderer text={item.content} />
                    </div>

                    {/* Key Points Chip List */}
                    {item.keyPoints && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">
                          High-Yield Pointers
                        </span>
                        <div className="text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-200/80 leading-relaxed">
                          <MathRenderer text={item.keyPoints} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXAMPLES (Illustrative Sentences & Rule Applications) */}
      {activeTab === "examples" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Illustrative Examples &amp; Case Studies ({examples?.length || 0})
            </h2>
          </div>

          {examples?.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">
                No standalone examples indexed. Review the Learn tab for integrated rule examples.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examples.map((ex: any, idx: number) => (
                <div
                  key={ex.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Example #{idx + 1}
                      </span>
                      {ex.sourcePage && (
                        <span className="text-[10px] text-slate-400 font-bold">
                          Page {ex.sourcePage}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm">{ex.title}</h3>

                    <div className="text-xs text-slate-700 leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100">
                      <MathRenderer text={ex.content} />
                    </div>
                  </div>

                  {ex.keyPoints && (
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <MathRenderer text={ex.keyPoints} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SOLVED QUESTIONS (Interactive Practice with Instant Reveal) */}
      {activeTab === "solved" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Authentic Solved Questions ({displayedSolvedQuestions.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review questions one by one with verified step-by-step solutions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Filter Level:</span>
              <select
                value={questionDifficultyFilter}
                onChange={(e) => setQuestionDifficultyFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="ALL">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {displayedSolvedQuestions.map((q: any, idx: number) => {
              const isRevealed = revealedAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        Q.{q.questionNumber || idx + 1}
                      </span>
                      {q.difficulty && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {q.difficulty}
                        </span>
                      )}
                      {q.sourcePage && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          p. {q.sourcePage}
                        </span>
                      )}
                    </div>

                    {q.year && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        SSC {q.year}
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <div className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                    <MathRenderer text={q.questionText} />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options?.map((opt: any) => {
                      const isCorrect = opt.isCorrect;
                      const showHighlight = isRevealed && isCorrect;

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs font-semibold transition-all flex items-start gap-2.5 ${
                            showHighlight
                              ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold"
                              : "bg-slate-50/60 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                              showHighlight
                                ? "bg-emerald-600 text-white"
                                : "bg-white text-slate-700 border border-slate-300"
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="leading-tight pt-0.5">
                            <MathRenderer text={opt.text} />
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Reveal Answer & Explanation */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRevealAnswer(q.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide Answer</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>View Correct Answer &amp; Explanation</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Revealed Explanation Box */}
                  {isRevealed && (
                    <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200/80 space-y-2 animate-in fade-in-50 duration-150">
                      <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Step-by-Step Explanation &amp; Rule Application</span>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                        <MathRenderer
                          text={
                            q.explanation ||
                            "Correct answer marked directly from authoritative textbook key."
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PRACTICE (Custom Session Configurator) */}
      {activeTab === "practice" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1 border border-indigo-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>CBT Practice Generator</span>
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Customize Practice for Chapter {chapter.chapterNumber}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select question count, range, or simulation mode to launch directly into the CBT testing engine
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Number of Questions</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, Math.min(50, chapter.counts?.questions || 50)].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setPracticeCount(num);
                      setRangeFrom("");
                      setRangeTo("");
                    }}
                    className={`py-2 rounded-lg font-bold transition-all ${
                      practiceCount === num && !rangeFrom
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range (e.g. Q 1 to 30) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">
                  Custom Question Range (Optional)
                </label>
                <span className="text-[11px] text-slate-400">
                  Max {chapter.counts?.questions || 0} questions available
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="From question # (e.g. 1)"
                    value={rangeFrom}
                    min={1}
                    max={chapter.counts?.questions || 100}
                    onChange={(e) => setRangeFrom(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="To question # (e.g. 30)"
                    value={rangeTo}
                    min={1}
                    max={chapter.counts?.questions || 100}
                    onChange={(e) => setRangeTo(e.target.value ? Number(e.target.value) : "")}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Session Mode */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Session Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPracticeMode("PRACTICE")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    practiceMode === "PRACTICE"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Study &amp; Learn</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-normal">
                    Instant KaTeX solutions on every click
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPracticeMode("MOCK")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    practiceMode === "MOCK"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Timed CBT Exam</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-normal">
                    Real exam conditions with countdown timer
                  </p>
                </button>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Difficulty Filter</label>
              <select
                value={practiceDifficulty}
                onChange={(e) => setPracticeDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="ALL">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={isGeneratingPractice}
            onClick={() => handleLaunchPractice()}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGeneratingPractice ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Launching CBT Testing Engine...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>Start Practice Session Now</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* TAB 5: PYQS (Previous Years Questions) */}
      {activeTab === "pyqs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Previous Years SSC Questions ({pyqs?.length || 0})
            </h2>
            <button
              onClick={() => handleLaunchPractice({ sourceFilter: "PYQ", questionCount: 20 })}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Test All PYQs</span>
            </button>
          </div>

          {pyqs?.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">No standalone PYQs mapped for this chapter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pyqs.map((q: any, idx: number) => {
                const isRevealed = revealedAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                        PYQ #{idx + 1}
                      </span>
                      {q.year && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          SSC Exam {q.year}
                        </span>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                      <MathRenderer text={q.questionText} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options?.map((opt: any) => (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                            isRevealed && opt.isCorrect
                              ? "bg-emerald-50 border-emerald-400 text-emerald-900 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span className="w-5 h-5 rounded font-bold text-[11px] bg-white border border-slate-300 flex items-center justify-center shrink-0">
                            {opt.label}
                          </span>
                          <span className="leading-tight">
                            <MathRenderer text={opt.text} />
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleRevealAnswer(q.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        {isRevealed ? "Hide Answer" : "Reveal Answer & Explanation"}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-slate-700 leading-relaxed">
                        <MathRenderer text={q.explanation || "Authoritative answer key solution."} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: REVISION (High-Yield Bullet Notes) */}
      {activeTab === "revision" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              High-Yield Revision &amp; Summary ({revision?.length || 0})
            </h2>
          </div>

          {revision?.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">
                Revision cards are being generated for this module.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {revision.map((rev: any, idx: number) => (
                <div
                  key={rev.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Rule Key
                    </span>
                    {rev.sourcePage && (
                      <span className="text-[10px] text-slate-400 font-bold">
                        p. {rev.sourcePage}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm">{rev.title}</h3>

                  <div className="text-xs text-slate-700 leading-relaxed">
                    <MathRenderer text={rev.content} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: MY MISTAKES (Personal Error Ledger) */}
      {activeTab === "mistakes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              My Mistakes Ledger ({myMistakes?.length || 0})
            </h2>
          </div>

          {myMistakes?.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Recorded Mistakes!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You haven&apos;t made any errors in tests attempted for this chapter yet. Keep up the high standard!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {myMistakes.map((q: any, idx: number) => (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      Error #{idx + 1}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    <MathRenderer text={q.questionText} />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong>Solution: </strong>
                    <MathRenderer text={q.explanation || "Review correct option key."} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
