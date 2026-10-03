"use client";

import React from "react";
import { Button } from "../ui/Button";
import { CheckCircle2, ChevronLeft, ChevronRight, BookmarkCheck, RotateCcw } from "lucide-react";

interface ExamFooterProps {
  onPrevious: () => void;
  onClearResponse: () => void;
  onMarkForReview: () => void;
  onSaveAndNext: () => void;
  onSubmitPrompt: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  hasSelectedOption: boolean;
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
}) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 select-none shadow-lg z-20">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkForReview}
          className="bg-slate-800 hover:bg-slate-700 text-purple-300 border-purple-800/80 hover:border-purple-700"
          title="Shortcut: M"
        >
          <BookmarkCheck className="w-4 h-4 mr-1 text-purple-400" />
          <span className="hidden sm:inline">Mark for Review &amp; Next</span>
          <span className="sm:hidden">Review</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClearResponse}
          disabled={!hasSelectedOption}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 disabled:opacity-40"
          title="Shortcut: C"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Clear Response
        </Button>
      </div>

      {/* Right Navigation & Submission Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 disabled:opacity-40"
          title="Shortcut: P"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          Previous
        </Button>

        <Button
          variant="cbt-action"
          size="sm"
          onClick={onSaveAndNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
          title="Shortcut: N or Enter"
        >
          <span>Save &amp; Next</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </Button>

        <Button
          variant="cbt-accent"
          size="sm"
          onClick={onSubmitPrompt}
          className="bg-emerald-600 hover:bg-emerald-700 text-white ml-2 shadow-sm font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 mr-1 text-white" />
          Submit Test
        </Button>
      </div>
    </footer>
  );
};
