"use client";

import React from "react";
import { MathRenderer } from "../math/MathRenderer";
import { Check, X } from "lucide-react";

interface OptionCardProps {
  label: string; // "A", "B", "C", "D"
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  keyboardShortcut?: string; // "1", "2", "3", "4"
  // Instant Feedback / Learning Mode states:
  instantFeedbackActive?: boolean;
  isCorrectOption?: boolean;
  isWrongOption?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  text,
  isSelected,
  onSelect,
  keyboardShortcut,
  instantFeedbackActive = false,
  isCorrectOption = false,
  isWrongOption = false,
}) => {
  // Determine soothing visual state
  let containerStyles = "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-800";
  let circleStyles = "border-slate-300 bg-slate-50 text-slate-700 group-hover:border-slate-400 group-hover:bg-slate-100";

  if (instantFeedbackActive) {
    if (isCorrectOption) {
      containerStyles = "border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500/50 shadow-2xs";
      circleStyles = "border-emerald-600 bg-emerald-600 text-white shadow-2xs";
    } else if (isWrongOption) {
      containerStyles = "border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-400/50 shadow-2xs";
      circleStyles = "border-rose-500 bg-rose-500 text-white shadow-2xs";
    } else {
      containerStyles = "border-slate-200/60 bg-slate-50/40 opacity-70 text-slate-600";
      circleStyles = "border-slate-200 bg-slate-100 text-slate-500";
    }
  } else if (isSelected) {
    containerStyles = "border-blue-600 bg-blue-50/50 text-blue-950 ring-1 ring-blue-600/60 shadow-2xs";
    circleStyles = "border-blue-600 bg-blue-600 text-white shadow-2xs";
  }

  return (
    <div
      onClick={onSelect}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex items-center gap-3 py-2.5 px-3.5 sm:py-2.5 sm:px-4 rounded-xl border transition-all select-none cursor-pointer w-full ${containerStyles}`}
    >
      {/* Radio Circle & Label */}
      <div
        className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold text-xs border transition-colors ${circleStyles}`}
      >
        {instantFeedbackActive && isCorrectOption ? (
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        ) : instantFeedbackActive && isWrongOption ? (
          <X className="w-3.5 h-3.5 stroke-[3]" />
        ) : (
          label
        )}
      </div>

      {/* Option Text with KaTeX and Hindi font support */}
      <div className="flex-1 text-sm sm:text-[15px] font-medium leading-relaxed">
        <MathRenderer text={text} />
      </div>

      {/* Instant Feedback indicator badge */}
      {instantFeedbackActive && isCorrectOption && (
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md ml-auto shrink-0">
          Correct
        </span>
      )}
      {instantFeedbackActive && isWrongOption && (
        <span className="text-[11px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md ml-auto shrink-0">
          Incorrect
        </span>
      )}

      {/* Optional keyboard shortcut hint */}
      {!instantFeedbackActive && keyboardShortcut && (
        <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded ml-auto shrink-0">
          {keyboardShortcut}
        </span>
      )}
    </div>
  );
};
