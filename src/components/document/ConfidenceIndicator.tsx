"use client";

import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface ConfidenceIndicatorProps {
  label: string;
  score: number; // 0.0 to 1.0
  threshold?: number; // default 0.75
  showDetails?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  label,
  score,
  threshold = 0.75,
  showDetails = false,
}) => {
  const percentage = Math.round(score * 100);
  const isHigh = score >= 0.85;
  const isMedium = score >= threshold && score < 0.85;
  const isLow = score < threshold;

  const colorClasses = isHigh
    ? {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        bar: "bg-emerald-500",
        icon: CheckCircle2,
      }
    : isMedium
    ? {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        bar: "bg-amber-500",
        icon: AlertTriangle,
      }
    : {
        text: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
        bar: "bg-rose-500",
        icon: AlertCircle,
      };

  const Icon = colorClasses.icon;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${colorClasses.text}`} />
          {label}
        </span>
        <span className={`font-mono font-bold ${colorClasses.text}`}>
          {percentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClasses.bar}`}
          style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
        />
      </div>

      {/* Low confidence warning recommendation */}
      {isLow && (
        <div className="mt-1 p-2 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
          <span>
            Low extraction confidence (&lt;75%). Verify carefully with the source document.
          </span>
        </div>
      )}
    </div>
  );
};
