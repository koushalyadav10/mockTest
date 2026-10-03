"use client";

import React from "react";
import { Calculator, Compass, BookOpen, Globe2, Clock, CheckCircle2, XCircle } from "lucide-react";

interface SubjectData {
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
  accuracy: number;
  averageTimeSeconds: number;
}

interface SubjectPerformanceCardProps {
  breakdown: Record<string, SubjectData>;
}

export const SubjectPerformanceCard: React.FC<SubjectPerformanceCardProps> = ({
  breakdown,
}) => {
  const getSubjectIcon = (name: string) => {
    if (name.includes("Math") || name.includes("Quantitative")) {
      return <Calculator className="w-5 h-5 text-blue-600" />;
    }
    if (name.includes("Reasoning") || name.includes("Intelligence")) {
      return <Compass className="w-5 h-5 text-purple-600" />;
    }
    if (name.includes("English")) {
      return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
    return <Globe2 className="w-5 h-5 text-amber-600" />;
  };

  const subjects = Object.entries(breakdown);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-slate-900">Subject-wise Performance</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map(([subjName, data]) => {
          return (
            <div
              key={subjName}
              className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs hover:border-slate-300 transition-colors"
            >
              {/* Subject Title & Icon */}
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  {getSubjectIcon(subjName)}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-slate-900 truncate" title={subjName}>
                    {subjName}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Score: {data.score} pts
                  </span>
                </div>
              </div>

              {/* Accuracy Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Accuracy</span>
                  <span className="font-bold text-slate-800 font-mono">{data.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      data.accuracy >= 75
                        ? "bg-emerald-500"
                        : data.accuracy >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${data.accuracy}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-1 pt-1 text-center border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Attempted</span>
                  <span className="font-mono font-bold text-slate-700">
                    {data.attempted}/{data.total}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-600 block">Correct</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {data.correct}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-red-500 block">Wrong</span>
                  <span className="font-mono font-bold text-red-600">
                    {data.incorrect}
                  </span>
                </div>
              </div>

              {/* Average Time */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100 font-mono">
                <span className="flex items-center gap-1 font-sans">
                  <Clock className="w-3 h-3 text-slate-400" /> Avg Time
                </span>
                <span>{data.averageTimeSeconds}s / Q</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
