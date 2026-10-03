"use client";

import React from "react";
import { CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
import { PipelineStep } from "@/lib/ai/types";

interface ProcessingProgressProps {
  currentStep: number;
  totalSteps?: number;
  steps: PipelineStep[];
  isFailed?: boolean;
  errorMessage?: string | null;
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  currentStep,
  totalSteps = 15,
  steps,
  isFailed = false,
  errorMessage,
}) => {
  const percent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  const standardStepNames = [
    "Document validation",
    "Preprocessing",
    "OCR / Document understanding",
    "Layout analysis",
    "Question boundary detection",
    "Option detection",
    "Image/Diagram extraction",
    "Subject classification",
    "Topic classification",
    "Question normalization",
    "Answer detection",
    "Question validation",
    "Duplicate detection",
    "Confidence scoring",
    "Human review preparation",
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
      {/* Header with progress percentage */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {isFailed ? "Processing Interrupted" : "Understanding your question paper..."}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isFailed
              ? "An issue was encountered during extraction"
              : `Step ${Math.min(currentStep, totalSteps)} of ${totalSteps} in progress`}
          </p>
        </div>
        <span className="font-mono text-xl font-bold text-blue-600 tabular-nums">
          {percent}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            isFailed ? "bg-red-500" : "bg-blue-600"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Error Message if Failed */}
      {isFailed && errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step by Step Breakdown */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
        {standardStepNames.map((name, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep || percent === 100;
          const isCurrent = stepNum === currentStep && !isCompleted && !isFailed;
          const isError = isFailed && stepNum === currentStep;

          return (
            <div
              key={stepNum}
              className={`flex items-center justify-between text-xs py-1.5 px-3 rounded-md transition-colors ${
                isCurrent
                  ? "bg-blue-50/70 text-blue-900 font-semibold"
                  : isCompleted
                  ? "text-slate-700 font-medium"
                  : isError
                  ? "bg-red-50 text-red-800"
                  : "text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                ) : isError ? (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
                <span>
                  {stepNum}. {name}
                </span>
              </div>

              <span className="text-[11px] font-mono">
                {isCompleted ? "Done" : isCurrent ? "Processing" : isError ? "Failed" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
