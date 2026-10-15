"use client";

import React from "react";
import { Button } from "../ui/Button";
import { CheckCircle2, ChevronLeft, ChevronRight, BookmarkCheck, RotateCcw, Layers } from "lucide-react";

interface ExamFooterProps {
  onPrevious: () => void;
  onClearResponse: () => void;
  onMarkForReview: () => void;
  onSaveAndNext: () => void;
  onSubmitPrompt: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  hasSelectedOption: boolean;
  onToggleMobilePalette?: () => void;
  currentQuestionNumber?: number;
  totalQuestions?: number;
  examTitle?: string;
  activeSectionName?: string;
}

export const ExamFooter: React.FC<ExamFooterProps> = ({
  onPrevious,
  onClearResponse,
  onMarkForReview,
  onSaveAndNext,
  onSubmitPrompt,
  isFirstQuestion,
  isLastQuestion,
  hasSelectedOption,
  onToggleMobilePalette,
  currentQuestionNumber,
  totalQuestions,
  examTitle,
  activeSectionName,
}) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 px-2 sm:px-6 py-2 sm:py-3.5 max-lg:landscape:py-1 max-lg:landscape:px-3 flex flex-col gap-2 select-none shadow-lg z-20">
      {/* MOBILE LAYOUT (Image 2): Single Row Buttons + Full Chapter Name Row */}
      <div className="flex lg:hidden items-center justify-between gap-1 w-full">
        {/* Review */}
        <button
          onClick={onMarkForReview}
          className="px-2 py-1.5 rounded-md bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-700/60 font-semibold text-[11px] flex items-center gap-1 shrink-0"
          title="Mark for Review (Shortcut: M)"
        >
          <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Review</span>
        </button>

        {/* Clear */}
        <button
          onClick={onClearResponse}
          disabled={!hasSelectedOption}
          className="px-2 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-30 font-semibold text-[11px] flex items-center gap-1 shrink-0"
          title="Clear Response (Shortcut: C)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Clear</span>
        </button>

        {/* Palette Drawer Trigger */}
        {onToggleMobilePalette && (
          <button
            onClick={onToggleMobilePalette}
            className="px-2 py-1.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold text-[11px] flex items-center gap-1 shrink-0"
            title="Open Question Palette"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Q {currentQuestionNumber || 1}/{totalQuestions || 1}</span>
          </button>
        )}

        {/* Previous (<) */}
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30 shrink-0"
          title="Previous Question"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Save & Next */}
        <button
          onClick={onSaveAndNext}
          className="px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm shrink-0 active:scale-95 transition-all"
          title="Save & Next"
        >
          <span>Save &amp; Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MOBILE ROW 2: Full Chapter Name (Image 2 bottom annotation) */}
      <div className="flex lg:hidden items-center gap-2 pt-1 border-t border-slate-800/80 text-[11px] text-slate-300 overflow-x-auto whitespace-nowrap scrollbar-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="font-bold text-white tracking-wide">
          {examTitle || "CBT Examination"}
        </span>
        {activeSectionName && (
          <span className="text-slate-400 font-medium">
            • Section: {activeSectionName}
          </span>
        )}
      </div>

      {/* DESKTOP LAYOUT (Spacious) */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkForReview}
            className="bg-slate-800 hover:bg-slate-700 text-purple-300 border-purple-800/80 hover:border-purple-700 px-3 text-xs"
            title="Shortcut: M"
          >
            <BookmarkCheck className="w-4 h-4 mr-1 text-purple-400" />
            <span>Mark for Review</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearResponse}
            disabled={!hasSelectedOption}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 disabled:opacity-40 px-3 text-xs"
            title="Shortcut: C"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>Clear Response</span>
          </Button>
        </div>

        {/* Right Navigation & Submission Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 disabled:opacity-40 px-3 text-xs"
            title="Shortcut: P"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5" />
            <span>Previous</span>
          </Button>

          <Button
            variant="cbt-action"
            size="sm"
            onClick={onSaveAndNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs px-3.5 text-xs"
            title="Shortcut: N or Enter"
          >
            <span>Save &amp; Next</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>

          <Button
            variant="cbt-accent"
            size="sm"
            onClick={onSubmitPrompt}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm px-3.5 text-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" />
            <span>Submit</span>
          </Button>
        </div>
      </div>
    </footer>
  );
};
