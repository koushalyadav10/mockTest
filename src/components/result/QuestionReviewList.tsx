"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Clock, Check, ArrowRight } from "lucide-react";
import { MathRenderer } from "../math/MathRenderer";
import { Button } from "../ui/Button";
import Link from "next/link";

export interface QuestionReviewItem {
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

export const QuestionReviewList: React.FC<QuestionReviewListProps> = ({ questions }) => {
  const [filter, setFilter] = useState<"ALL" | "CORRECT" | "INCORRECT" | "UNATTEMPTED">("ALL");

  const filteredQuestions = questions.filter((q) => {
    if (filter === "CORRECT") return q.isCorrect === true;
    if (filter === "INCORRECT") return q.isCorrect === false && q.selectedOptionStableId !== null;
    if (filter === "UNATTEMPTED") return q.selectedOptionStableId === null;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">Question-by-Question Solutions</h3>
          <p className="text-xs text-slate-500">
            Review your answers with complete official explanations and timing analysis
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-md transition-all ${
              filter === "ALL" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setFilter("CORRECT")}
            className={`px-3 py-1 rounded-md transition-all ${
              filter === "CORRECT" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Correct ({questions.filter((q) => q.isCorrect === true).length})
          </button>
          <button
            onClick={() => setFilter("INCORRECT")}
            className={`px-3 py-1 rounded-md transition-all ${
              filter === "INCORRECT" ? "bg-white text-red-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Incorrect ({questions.filter((q) => q.isCorrect === false && q.selectedOptionStableId !== null).length})
          </button>
          <button
            onClick={() => setFilter("UNATTEMPTED")}
            className={`px-3 py-1 rounded-md transition-all ${
              filter === "UNATTEMPTED" ? "bg-white text-slate-800 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Unattempted ({questions.filter((q) => q.selectedOptionStableId === null).length})
          </button>
        </div>
      </div>

      {/* List of Questions */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const selectedOpt = q.options.find((o) => o.stableId === q.selectedOptionStableId);
          const correctOpt = q.options.find((o) => o.stableId === q.correctOptionStableId || o.isCorrect);

          const isAnswered = Boolean(q.selectedOptionStableId);

          return (
            <div
              key={q.questionNumber}
              className={`bg-white rounded-xl border p-5 space-y-3.5 shadow-xs transition-colors ${
                q.isCorrect === true
                  ? "border-emerald-200"
                  : isAnswered
                  ? "border-red-200"
                  : "border-slate-200"
              }`}
            >
              {/* Question Header Status */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    Q.{q.questionNumber}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-600 font-medium">{q.subject}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {q.topic}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" /> {q.timeSpentSeconds}s
                  </span>

                  {q.isCorrect === true ? (
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+2.0)
                    </span>
                  ) : isAnswered ? (
                    <span className="flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-bold text-[11px]">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect (-0.5)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium text-[11px]">
                      <HelpCircle className="w-3.5 h-3.5" /> Unattempted (0)
                    </span>
                  )}
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
                      <span className="font-bold font-mono w-4">{opt.label}.</span>
                      <div className="flex-1">
                        <MathRenderer text={opt.text} />
                      </div>
                      {isThisCorrect && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 flex-shrink-0">
                          <Check className="w-3 h-3" /> Correct
                        </span>
                      )}
                      {isUserSelected && !isThisCorrect && (
                        <span className="text-[10px] text-red-600 font-bold flex-shrink-0">
                          Your Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box */}
              <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs sm:text-sm text-slate-800 space-y-1">
                <span className="font-bold text-blue-900 text-xs block">Solution Explanation:</span>
                <MathRenderer text={q.explanation || "No explanation provided for this question."} />
              </div>

              {/* Bottom Quick Action */}
              <div className="flex justify-end pt-1">
                <Link
                  href={`/practice?subject=${encodeURIComponent(q.subject)}&topic=${encodeURIComponent(
                    q.topic
                  )}`}
                >
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline">
                    <span>Practice similar {q.topic} questions</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
