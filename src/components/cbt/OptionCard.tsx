"use client";

import React from "react";
import { MathRenderer } from "../math/MathRenderer";

interface OptionCardProps {
  label: string; // "A", "B", "C", "D"
  text: string;
  isSelected: boolean;
  onSelect: () => void;
  keyboardShortcut?: string; // "1", "2", "3", "4"
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  text,
  isSelected,
  onSelect,
  keyboardShortcut,
}) => {
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
      className={`group relative flex items-start gap-3.5 p-3.5 sm:p-4 rounded-lg border-2 cursor-pointer transition-all select-none ${
        isSelected
          ? "border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
      }`}
    >
      {/* Radio Circle & Label */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border transition-colors ${
          isSelected
            ? "border-blue-600 bg-blue-600 text-white shadow-xs"
            : "border-slate-300 bg-slate-100 text-slate-700 group-hover:border-slate-400 group-hover:bg-slate-200"
        }`}
      >
        {label}
      </div>

      {/* Option Text with KaTeX and Hindi support */}
      <div className="flex-1 pt-0.5 text-sm sm:text-base text-slate-800 leading-relaxed font-sans">
        <MathRenderer text={text} />
      </div>

      {/* Optional keyboard shortcut hint */}
      {keyboardShortcut && (
        <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
          {keyboardShortcut}
        </span>
      )}
    </div>
  );
};
