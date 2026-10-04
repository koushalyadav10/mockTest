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
}) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 px-3 sm:px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 select-none shadow-lg z-20">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkForReview}
          className="bg-slate-800 hover:bg-slate-700 text-purple-300 border-purple-800/80 hover:border-purple-700 px-2.5 sm:px-3 text-xs"
          title="Shortcut: M"
        >
          <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1 text-purple-400" />
          <span className="hidden sm:inline">Mark for Review</span>
          <span className="sm:hidden ml-1">Review</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClearResponse}
          disabled={!hasSelectedOption}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 disabled:opacity-40 px-2.5 sm:px-3 text-xs"
          title="Shortcut: C"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 sm:mr-1 text-slate-400" />
          <span className="hidden sm:inline">Clear Response</span>
          <span className="sm:hidden ml-1">Clear</span>
        </Button>

        {/* Mobile Palette Drawer Trigger Button */}
        {onToggleMobilePalette && (
          <button
            onClick={onToggleMobilePalette}
            className="lg:hidden px-2 py-1.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-semibold text-xs flex items-center gap-1"
            title="Open Question Palette"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Q {currentQuestionNumber || 1}/{totalQuestions || 1}</span>
          </button>
        )}
      </div>

      {/* Right Navigation & Submission Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 disabled:opacity-40 px-2 sm:px-3 text-xs"
          title="Shortcut: P"
        >
          <ChevronLeft className="w-4 h-4 sm:mr-0.5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <Button
          variant="cbt-action"
          size="sm"
          onClick={onSaveAndNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs px-2.5 sm:px-3.5 text-xs"
          title="Shortcut: N or Enter"
        >
          <span>Save &amp; Next</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Button>

        <Button
          variant="cbt-accent"
          size="sm"
          onClick={onSubmitPrompt}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm px-3 sm:px-3.5 text-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" />
          <span>Submit</span>
        </Button>
      </div>
    </footer>
  );
};
