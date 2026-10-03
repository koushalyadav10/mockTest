"use client";

import React from "react";
import { Award, Target, CheckCircle2, XCircle, Clock, Zap, HelpCircle } from "lucide-react";
import { formatSecondsToHHMMSS } from "@/lib/exam/timer";

interface ScoreOverviewCardProps {
  finalScore: number;
  totalMarks: number;
  rawScore: number;
  negativeMarksTotal: number;
  accuracy: number;
  attemptRate: number;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  totalTimeSeconds: number;
  averageTimeSeconds: number;
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = ({
  finalScore,
  totalMarks,
  rawScore,
  negativeMarksTotal,
  accuracy,
  attemptRate,
  totalQuestions,
  attemptedCount,
  correctCount,
  incorrectCount,
  unattemptedCount,
  totalTimeSeconds,
  averageTimeSeconds,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Top Banner: Final Score & Accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-800 text-xs font-semibold">
            <span>Final Score</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-3xl font-extrabold text-blue-900 tabular-nums">
              {finalScore}
            </span>
            <span className="text-slate-500 text-sm ml-1 font-mono">/ {totalMarks}</span>
          </div>
          <div className="text-[11px] text-blue-700 mt-1">
            Raw: +{rawScore} &bull; Negative: -{negativeMarksTotal}
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>Accuracy</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-3xl font-extrabold text-emerald-900 tabular-nums">
              {accuracy}%
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            {correctCount} correct of {attemptedCount} attempted
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 text-xs font-semibold">
            <span>Attempt Rate</span>
            <Zap className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-3xl font-extrabold text-slate-800 tabular-nums">
              {attemptRate}%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {attemptedCount} of {totalQuestions} questions
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 text-xs font-semibold">
            <span>Total Time Used</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2">
            <span className="font-mono text-2xl font-bold text-slate-800 tabular-nums">
              {formatSecondsToHHMMSS(totalTimeSeconds)}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg. {averageTimeSeconds}s per question
          </div>
        </div>
      </div>

      {/* Answer Distribution Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40">
          <div className="flex items-center justify-center gap-1 text-xs text-emerald-700 font-semibold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
          </div>
          <div className="text-xl font-bold font-mono text-emerald-800 tabular-nums">
            {correctCount}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-red-200 bg-red-50/40">
          <div className="flex items-center justify-center gap-1 text-xs text-red-700 font-semibold mb-1">
            <XCircle className="w-3.5 h-3.5" /> Incorrect
          </div>
          <div className="text-xl font-bold font-mono text-red-800 tabular-nums">
            {incorrectCount}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex items-center justify-center gap-1 text-xs text-slate-600 font-semibold mb-1">
            <HelpCircle className="w-3.5 h-3.5" /> Unattempted
          </div>
          <div className="text-xl font-bold font-mono text-slate-800 tabular-nums">
            {unattemptedCount}
          </div>
        </div>

        <div className="hidden sm:block p-3 rounded-lg border border-blue-200 bg-blue-50/40">
          <div className="flex items-center justify-center gap-1 text-xs text-blue-700 font-semibold mb-1">
            <Award className="w-3.5 h-3.5" /> Total Questions
          </div>
          <div className="text-xl font-bold font-mono text-blue-800 tabular-nums">
            {totalQuestions}
          </div>
        </div>
      </div>
    </div>
  );
};
