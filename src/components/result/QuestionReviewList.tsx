"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Check,
  ArrowRight,
  Star,
  Lightbulb,
  Eye,
  ChevronDown,
} from "lucide-react";
import { MathRenderer } from "../math/MathRenderer";
import { cleanExplanationText } from "@/lib/utils/textCleaner";
import {
  isQuestionBookmarked,
  toggleQuestionBookmark,
  getBookmarks,
} from "@/lib/bookmarks";
import Link from "next/link";

export interface QuestionReviewItem {
  questionId?: string;
  questionNumber: number;
  subject: string;
  topic: string;
  questionText: string;
  hasVisualContent: boolean;
  imageUrl?: string | null;
  options: { label: string; text: string; isCorrect: boolean; stableId: string }[];
  selectedOptionStableId: string | null;
  correctOptionStableId: string | null;
  isCorrect: boolean | null;
  timeSpentSeconds: number;
  explanation?: string | null;
}

interface QuestionReviewListProps {
  questions: QuestionReviewItem[];
}

type FilterMode = "ATTEMPTED" | "INCORRECT" | "CORRECT" | "UNATTEMPTED" | "ALL" | "BOOKMARKED";

export const QuestionReviewList: React.FC<QuestionReviewListProps> = ({ questions }) => {
  // Default to only showing the user's attempted responses (Correct + Incorrect)
  const [filter, setFilter] = useState<FilterMode>("ATTEMPTED");
  const [bookmarksMap, setBookmarksMap] = useState<Record<string, boolean>>({});

  // Sync bookmarks from localStorage
  const refreshBookmarks = () => {
    const bms = getBookmarks();
    const map: Record<string, boolean> = {};
    for (const id of Object.keys(bms)) {
      map[id] = true;
    }
    setBookmarksMap(map);
  };

  useEffect(() => {
    refreshBookmarks();
    const handleBookmarkUpdate = () => refreshBookmarks();
    window.addEventListener("studybae_bookmarks_updated", handleBookmarkUpdate);
    return () => window.removeEventListener("studybae_bookmarks_updated", handleBookmarkUpdate);
  }, []);

  const handleToggleBookmark = (q: QuestionReviewItem) => {
    const qId = q.questionId || `q-${q.questionNumber}`;
    toggleQuestionBookmark({
      questionId: qId,
      subject: q.subject,
      topic: q.topic,
      questionText: q.questionText,
    });
    refreshBookmarks();
  };

  const attemptedCount = questions.filter((q) => q.selectedOptionStableId !== null).length;
  const correctCount = questions.filter((q) => q.isCorrect === true).length;
  const incorrectCount = questions.filter(
    (q) => q.isCorrect === false && q.selectedOptionStableId !== null
  ).length;
  const unattemptedCount = questions.filter((q) => q.selectedOptionStableId === null).length;
  const bookmarkedCount = questions.filter((q) => {
    const qId = q.questionId || `q-${q.questionNumber}`;
    return Boolean(bookmarksMap[qId]);
  }).length;

  // Filter logic
  const filteredQuestions = questions.filter((q) => {
    const qId = q.questionId || `q-${q.questionNumber}`;
    if (filter === "ATTEMPTED") return q.selectedOptionStableId !== null;
    if (filter === "CORRECT") return q.isCorrect === true;
    if (filter === "INCORRECT") return q.isCorrect === false && q.selectedOptionStableId !== null;
    if (filter === "UNATTEMPTED") return q.selectedOptionStableId === null;
    if (filter === "BOOKMARKED") return Boolean(bookmarksMap[qId]);
    return true; // ALL
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Question-by-Question Solutions</span>
            {filter === "ATTEMPTED" && (
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Showing Your Attempted Responses Only
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Review detailed step-by-step solutions and timing analysis for each question.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter("ATTEMPTED")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "ATTEMPTED"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My Responses ({attemptedCount})
          </button>

          <button
            onClick={() => setFilter("INCORRECT")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "INCORRECT"
                ? "bg-white text-rose-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Incorrect ({incorrectCount})
          </button>

          <button
            onClick={() => setFilter("CORRECT")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "CORRECT"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Correct ({correctCount})
          </button>

          <button
            onClick={() => setFilter("UNATTEMPTED")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "UNATTEMPTED"
                ? "bg-white text-amber-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Unattempted ({unattemptedCount})
          </button>

          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === "ALL"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({questions.length})
          </button>

          {bookmarkedCount > 0 && (
            <button
              onClick={() => setFilter("BOOKMARKED")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                filter === "BOOKMARKED"
                  ? "bg-white text-amber-600 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>Saved ({bookmarkedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State for current filter */}
      {filteredQuestions.length === 0 && (
        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-slate-700">
            No questions found in this view.
          </p>
          <p className="text-xs text-slate-500">
            {filter === "ATTEMPTED"
              ? "You did not attempt any questions in this exam attempt."
              : filter === "INCORRECT"
              ? "Great job! You had zero incorrect answers in this test."
              : filter === "BOOKMARKED"
              ? "You haven't bookmarked any questions from this exam yet."
              : "Try switching to another tab above."}
          </p>
          {filter === "ATTEMPTED" && unattemptedCount > 0 && (
            <button
              onClick={() => setFilter("ALL")}
              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 underline"
            >
              View all {questions.length} questions &amp; solutions &rarr;
            </button>
          )}
        </div>
      )}

      {/* List of Questions */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const selectedOpt = q.options.find((o) => o.stableId === q.selectedOptionStableId);
          const correctOpt = q.options.find((o) => o.stableId === q.correctOptionStableId || o.isCorrect);
          const isAnswered = Boolean(q.selectedOptionStableId);
          const qId = q.questionId || `q-${q.questionNumber}`;
          const isBookmarked = Boolean(bookmarksMap[qId]);

          return (
            <div
              key={q.questionNumber}
              className={`bg-white rounded-xl border p-4 sm:p-5 space-y-3.5 shadow-2xs transition-colors ${
                q.isCorrect === true
                  ? "border-emerald-200"
                  : isAnswered
                  ? "border-red-200"
                  : "border-slate-200"
              }`}
            >
              {/* Question Header Status */}
              <div className="flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    Q.{q.questionNumber}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">{q.subject}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 bg-slate-100 border border-slate-200/70 px-2 py-0.5 rounded text-[11px] font-medium">
                    {q.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="flex items-center gap-1 font-mono text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {q.timeSpentSeconds}s
                  </span>

                  {q.isCorrect === true ? (
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+2.0)
                    </span>
                  ) : isAnswered ? (
                    <span className="flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md font-bold text-[11px]">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect (-0.5)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      <HelpCircle className="w-3.5 h-3.5" /> Unattempted (0)
                    </span>
                  )}

                  {/* Bookmark Star Toggle */}
                  <button
                    onClick={() => handleToggleBookmark(q)}
                    title={isBookmarked ? "Remove from Bookmark Vault" : "Save to Mistake Diary / Bookmark Vault"}
                    className={`p-1 rounded-md transition-colors ${
                      isBookmarked
                        ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                        : "text-slate-400 hover:text-amber-500 hover:bg-slate-100"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isBookmarked ? "fill-amber-400 text-amber-500" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base text-slate-900 leading-relaxed font-sans">
                <MathRenderer text={q.questionText} />
              </div>

              {/* Options Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {q.options.map((opt) => {
                  const isUserSelected = opt.stableId === q.selectedOptionStableId;
                  const isThisCorrect = opt.stableId === q.correctOptionStableId || opt.isCorrect;

                  let cardStyle = "border-slate-200 bg-slate-50/70 text-slate-700";
                  if (isThisCorrect) {
                    cardStyle = "border-emerald-400 bg-emerald-50/80 text-emerald-950 font-medium ring-1 ring-emerald-400";
                  } else if (isUserSelected && !isThisCorrect) {
                    cardStyle = "border-red-400 bg-red-50/80 text-red-950 line-through ring-1 ring-red-400";
                  }

                  return (
                    <div
                      key={opt.stableId}
                      className={`p-2.5 rounded-lg border flex items-start gap-2 ${cardStyle}`}
                    >
                      <span className="font-bold font-mono w-4 shrink-0">{opt.label}.</span>
                      <div className="flex-1 min-w-0">
                        <MathRenderer text={opt.text} inlineOnly />
                      </div>
                      {isThisCorrect && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 shrink-0">
                          <Check className="w-3 h-3" /> Correct
                        </span>
                      )}
                      {isUserSelected && !isThisCorrect && (
                        <span className="text-[10px] text-red-600 font-bold shrink-0">
                          Your Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Solution Explanation Box (Compact, zero excessive vertical spacing) */}
              <div className="p-3 sm:p-3.5 rounded-lg bg-blue-50/60 border border-blue-200/70 text-xs sm:text-sm text-slate-800 space-y-1.5 leading-snug">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Solution &amp; Explanation:</span>
                </div>
                <div className="pt-0.5 text-slate-800 leading-normal">
                  <MathRenderer
                    text={cleanExplanationText(q.explanation) || "No explanation provided for this question."}
                  />
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Topic: <strong className="text-slate-600">{q.topic}</strong>
                </span>

                <Link
                  href={`/practice?subject=${encodeURIComponent(q.subject)}&topic=${encodeURIComponent(
                    q.topic
                  )}`}
                >
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline">
                    <span>Practice similar questions</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent CTA to view unattempted questions if user is in "ATTEMPTED" mode */}
      {filter === "ATTEMPTED" && unattemptedCount > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/40 text-center space-y-2.5 shadow-2xs mt-6">
          <div className="w-10 h-10 rounded-full bg-blue-100/80 text-blue-700 flex items-center justify-center mx-auto">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {unattemptedCount} Unattempted Questions in this Exam
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-0.5">
              To keep your review focused, we loaded your attempted responses first. Click below to view solutions for all remaining questions.
            </p>
          </div>
          <div className="pt-1">
            <button
              onClick={() => setFilter("UNATTEMPTED")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>Show Unattempted Questions ({unattemptedCount})</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
