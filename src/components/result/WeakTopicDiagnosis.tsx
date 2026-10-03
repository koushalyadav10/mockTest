"use client";

import React from "react";
import { AlertCircle, Target, ArrowRight, Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";
import { TopicPerformance } from "@/lib/exam/analytics-engine";

interface WeakTopicDiagnosisProps {
  topics: TopicPerformance[];
}

export const WeakTopicDiagnosis: React.FC<WeakTopicDiagnosisProps> = ({ topics }) => {
  const weakTopics = topics.filter((t) => t.isWeakTopic);

  if (weakTopics.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">Solid Conceptual Fluency</h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              No persistent weak topics detected in evaluated syllabus sections (&ge;65% accuracy across verified attempts).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-2">
              <span>Weak Topic Diagnosis &amp; Remediation Engine</span>
              <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                {weakTopics.length} Focus {weakTopics.length === 1 ? "Area" : "Areas"}
              </span>
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Identified with statistical confidence (&ge;3 attempts with &lt;65% accuracy). Remedial drill recommendations:
            </p>
          </div>
        </div>
      </div>

      {/* Weak Topics List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {weakTopics.map((item) => (
          <div
            key={`${item.subject}-${item.topic}`}
            className="bg-white p-4 rounded-lg border border-amber-200 shadow-xs flex flex-col justify-between gap-3"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {item.subject}
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-bold font-mono">
                  {item.accuracy}% Accuracy
                </span>
              </div>
              <h5 className="text-sm font-bold text-slate-900">{item.topic}</h5>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono text-[11px]">
                <span>{item.attempted} attempts</span>
                <span>&bull;</span>
                <span className="text-rose-600 font-semibold">{item.incorrect} missed</span>
                <span>&bull;</span>
                <span>{item.averageTimeSeconds}s avg</span>
              </div>
              <div className="text-[10px] text-amber-800 bg-amber-50 rounded px-2 py-1 mt-2 border border-amber-100">
                {item.confidenceMessage}
              </div>
            </div>

            <Link
              href={`/practice?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(
                item.topic
              )}&count=${item.recommendedPracticeCount}`}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 text-xs font-semibold justify-center"
              >
                <span>Practice {item.recommendedPracticeCount} Remedial Questions</span>
                <ArrowRight className="w-3 h-3 ml-1.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
