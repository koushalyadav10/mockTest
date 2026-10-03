"use client";

import React from "react";
import {
  Zap,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { KnowledgeSpeedMatrix as IKnowledgeSpeedMatrix, TopicPerformance } from "@/lib/exam/analytics-engine";
import Link from "next/link";
import { Button } from "../ui/Button";

interface KnowledgeSpeedMatrixProps {
  matrix: IKnowledgeSpeedMatrix;
}

export const KnowledgeSpeedMatrix: React.FC<KnowledgeSpeedMatrixProps> = ({
  matrix,
}) => {
  const { quadrants, benchmarkSeconds, accuracyThreshold, summary } = matrix;

  const renderTopicPill = (topic: TopicPerformance, accentColor: string) => (
    <div
      key={`${topic.subject}-${topic.topic}`}
      className="p-2.5 rounded-lg bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-2 text-xs"
    >
      <div>
        <div className="font-bold text-slate-800">{topic.topic}</div>
        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
          <span>{topic.accuracy}% acc</span>
          <span>&bull;</span>
          <span>{topic.averageTimeSeconds}s/Q</span>
          <span>&bull;</span>
          <span>{topic.attempted} attempts</span>
        </div>
      </div>
      <Link
        href={`/practice?subject=${encodeURIComponent(topic.subject)}&topic=${encodeURIComponent(
          topic.topic
        )}&count=10`}
      >
        <button
          className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${accentColor}`}
          title="Practice targeted questions for this topic"
        >
          Practice
        </button>
      </Link>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              2D Knowledge vs Speed Matrix
            </h3>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
              Diagnostic Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Correlates conceptual accuracy with solving tempo (Benchmark: {accuracyThreshold}% accuracy &bull; {benchmarkSeconds}s per question)
          </p>
        </div>

        {/* Matrix Legend Badges */}
        <div className="flex items-center gap-2 text-[11px] text-slate-600 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Mastered ({summary.masteredCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Overthinking ({summary.overthinkingCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            Rushing ({summary.rushingCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Critical Gap ({summary.criticalGapCount})
          </span>
        </div>
      </div>

      {/* 2x2 Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: Mastered (High Accuracy, Fast Speed) */}
        <div className="bg-emerald-50/50 rounded-xl border border-emerald-200/80 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Mastered &bull; Exam Ready
                </h4>
                <div className="text-[11px] text-emerald-700">
                  High Accuracy (&ge;{accuracyThreshold}%) + Swift Tempo (&le;{benchmarkSeconds}s)
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              {quadrants.mastered.length}
            </span>
          </div>

          <div className="space-y-2">
            {quadrants.mastered.length > 0 ? (
              quadrants.mastered.map((t) =>
                renderTopicPill(
                  t,
                  "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                )
              )
            ) : (
              <p className="text-xs text-slate-400 italic py-3 text-center">
                No topics in exam-ready quadrant yet.
              </p>
            )}
          </div>
        </div>

        {/* Quadrant 2: Overthinking (High Accuracy, Slow Speed) */}
        <div className="bg-amber-50/50 rounded-xl border border-amber-200/80 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  Accurate but Slow &bull; Needs Speed Drill
                </h4>
                <div className="text-[11px] text-amber-700">
                  High Accuracy (&ge;{accuracyThreshold}%) + Consuming Clock (&gt;{benchmarkSeconds}s)
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              {quadrants.overthinking.length}
            </span>
          </div>

          <div className="space-y-2">
            {quadrants.overthinking.length > 0 ? (
              quadrants.overthinking.map((t) =>
                renderTopicPill(
                  t,
                  "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                )
              )
            ) : (
              <p className="text-xs text-slate-400 italic py-3 text-center">
                No overthinking topics detected.
              </p>
            )}
          </div>
        </div>

        {/* Quadrant 3: Rushing (Low Accuracy, Fast Speed) */}
        <div className="bg-orange-50/50 rounded-xl border border-orange-200/80 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wide">
                  Rushing &bull; Careless Errors
                </h4>
                <div className="text-[11px] text-orange-700">
                  Low Accuracy (&lt;{accuracyThreshold}%) + Fast Tempo (&le;{benchmarkSeconds}s)
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
              {quadrants.rushing.length}
            </span>
          </div>

          <div className="space-y-2">
            {quadrants.rushing.length > 0 ? (
              quadrants.rushing.map((t) =>
                renderTopicPill(
                  t,
                  "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100"
                )
              )
            ) : (
              <p className="text-xs text-slate-400 italic py-3 text-center">
                No rushing errors detected.
              </p>
            )}
          </div>
        </div>

        {/* Quadrant 4: Critical Gap (Low Accuracy, Slow Speed) */}
        <div className="bg-rose-50/50 rounded-xl border border-rose-200/80 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
                  Critical Gap &bull; Revise Theory
                </h4>
                <div className="text-[11px] text-rose-700">
                  Low Accuracy (&lt;{accuracyThreshold}%) + Slow Tempo (&gt;{benchmarkSeconds}s)
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
              {quadrants.criticalGap.length}
            </span>
          </div>

          <div className="space-y-2">
            {quadrants.criticalGap.length > 0 ? (
              quadrants.criticalGap.map((t) =>
                renderTopicPill(
                  t,
                  "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                )
              )
            ) : (
              <p className="text-xs text-slate-400 italic py-3 text-center">
                No critical gaps detected.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Topics With Insufficient Sample Size */}
      {quadrants.unevaluated.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Preliminary Topics ({quadrants.unevaluated.length} with &lt; 3 attempts)
            </h5>
          </div>
          <p className="text-[11px] text-slate-500">
            ExamForge AI requires a minimum of 3 attempts per topic before diagnosing weakness or assigning a quadrant to avoid misleading evaluations based on a single question.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {quadrants.unevaluated.map((t) => (
              <div
                key={`${t.subject}-${t.topic}`}
                className="p-2.5 rounded bg-white border border-slate-200 text-xs flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold text-slate-800">{t.topic}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {t.attempted} of 3 attempts needed
                  </div>
                </div>
                <Link
                  href={`/practice?subject=${encodeURIComponent(t.subject)}&topic=${encodeURIComponent(
                    t.topic
                  )}&count=5`}
                >
                  <button className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 hover:bg-slate-200 rounded border border-slate-200 font-medium">
                    Test More
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
