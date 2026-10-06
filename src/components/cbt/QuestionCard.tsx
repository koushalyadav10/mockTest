"use client";

import React, { useState } from "react";
import { ZoomIn, Image as ImageIcon, Award, Calendar, Clock, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { MathRenderer } from "../math/MathRenderer";
import { OptionCard } from "./OptionCard";
import { Modal } from "../ui/Modal";
import { extractExamTag } from "@/lib/exam/tag-parser";

export interface QuestionCardOption {
  stableId: string;
  displayLabel: string;
  text: string;
}

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  subject: string;
  topic?: string;
  marksPerCorrect?: number;
  negativeMarks?: number;
  hasVisualContent?: boolean;
  imageUrl?: string | null;
  source?: string;
  questionType?: string;
  visualType?: string;
  directionText?: string | null;
  options: QuestionCardOption[];
  selectedOptionStableId: string | null;
  onSelectOption: (stableId: string) => void;
  // Per-Question timer & stats
  questionTimeSeconds?: number;
  // Instant feedback / Learning mode
  isInstantFeedbackActive?: boolean;
  onToggleInstantFeedback?: (enabled: boolean) => void;
  correctOptionStableId?: string | null;
  explanation?: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  questionText,
  subject,
  topic,
  marksPerCorrect = 2.0,
  negativeMarks = 0.5,
  hasVisualContent = false,
  imageUrl,
  source = "SOURCE_QUESTION",
  questionType = "MCQ",
  visualType = "UNKNOWN",
  directionText,
  options,
  selectedOptionStableId,
  onSelectOption,
  questionTimeSeconds = 0,
  isInstantFeedbackActive = false,
  onToggleInstantFeedback,
  correctOptionStableId,
  explanation,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const { cleanQuestionText, examTag } = extractExamTag(questionText);

  // Extract [Type: ...] if embedded in text
  let typeHeader = "";
  let displayQuestionText = cleanQuestionText;
  const typeMatch = cleanQuestionText.match(/\[Type:\s*([^\]]+)\]/i);
  if (typeMatch) {
    typeHeader = typeMatch[1].trim();
    displayQuestionText = cleanQuestionText.replace(/\[Type:\s*[^\]]+\]\s*/i, "").trim();
  }

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#fafbfc] rounded-2xl border border-slate-200/90 shadow-2xs overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 p-3.5 sm:p-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-slate-200/80 text-xs">
        {/* Left: Question No + Topic + Question Timer */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
            Q.{questionNumber}
          </span>

          {topic && (
            <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200/80 text-[11px]">
              {topic}
            </span>
          )}

          {/* Per-Question Live Timer & Speed Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-800 text-[11px] font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Time: {formatTimer(questionTimeSeconds)}</span>
            {selectedOptionStableId && (
              <span className="text-emerald-700 font-semibold ml-1">
                (Marked in {questionTimeSeconds}s)
              </span>
            )}
          </div>

          {/* Exam Tag Badge */}
          {examTag && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/90 text-amber-900 font-bold text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>{examTag}</span>
            </span>
          )}
        </div>

        {/* Right: Marks Badges */}
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            +{marksPerCorrect.toFixed(1)}
          </span>
          <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            -{negativeMarks.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Question Content Body */}
      <div className="py-4 space-y-3.5 flex-1 w-full">
        {/* Authentic Aditya Ranjan Type Badge (if present) */}
        {typeHeader && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-2xs border border-slate-700">
            <span className="text-amber-400">◆</span>
            <span>{typeHeader}</span>
            <span className="text-amber-400">◆</span>
          </div>
        )}

        {/* Highlighted Crisp Question Text */}
        <div className="text-[16px] sm:text-[18px] font-semibold text-slate-900 leading-relaxed tracking-tight py-1">
          <MathRenderer text={displayQuestionText} />
        </div>

        {/* Visual Content if any */}
        {hasVisualContent && visualType !== "TABLE" && imageUrl && (
          <div className="my-2 p-3 bg-white border border-slate-200 rounded-xl inline-block max-w-md">
            <img
              src={imageUrl}
              alt={`Question ${questionNumber} Diagram`}
              className="max-h-64 object-contain rounded cursor-pointer"
              onClick={() => setIsZoomOpen(true)}
            />
          </div>
        )}

        {/* Compact, Soothing Option Boxes Utilizing Available Width */}
        <div className="pt-1.5 space-y-2 w-full">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-0.5">
            Select Your Option:
          </div>

          {options.map((opt, idx) => {
            const isSelected = selectedOptionStableId === opt.stableId;
            const isCorrectOption = Boolean(
              isInstantFeedbackActive &&
                correctOptionStableId &&
                opt.stableId === correctOptionStableId
            );
            const isWrongOption = Boolean(
              isInstantFeedbackActive &&
                isSelected &&
                correctOptionStableId &&
                opt.stableId !== correctOptionStableId
            );

            return (
              <OptionCard
                key={opt.stableId}
                label={opt.displayLabel}
                text={opt.text}
                isSelected={isSelected}
                onSelect={() => onSelectOption(opt.stableId)}
                keyboardShortcut={String(idx + 1)}
                instantFeedbackActive={isInstantFeedbackActive && Boolean(selectedOptionStableId)}
                isCorrectOption={isCorrectOption}
                isWrongOption={isWrongOption}
              />
            );
          })}
        </div>

        {/* Step-by-Step Explanation Box (revealed when instant feedback is ON and option is marked) */}
        {isInstantFeedbackActive && selectedOptionStableId && (
          <div className="mt-4 p-4 rounded-2xl border border-blue-200/90 bg-blue-50/40 space-y-2 w-full transition-all animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Step-by-Step Solution &amp; Approach</span>
            </div>
            <div className="text-sm text-slate-800 leading-relaxed font-sans">
              <MathRenderer
                text={
                  explanation ||
                  `Answer option (${options.find((o) => o.stableId === correctOptionStableId)?.displayLabel || "Verified"}) is verified by TCS standard methodology.`
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Diagram Zoom Modal */}
      {isZoomOpen && imageUrl && (
        <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} title="Question Diagram Zoom">
          <div className="p-4 flex justify-center bg-white">
            <img src={imageUrl} alt="Zoomed Diagram" className="max-h-[80vh] object-contain rounded" />
          </div>
        </Modal>
      )}
    </div>
  );
};
