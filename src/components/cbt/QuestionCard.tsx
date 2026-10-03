"use client";

import React, { useState } from "react";
import { ZoomIn, Image as ImageIcon, CheckCircle } from "lucide-react";
import { MathRenderer } from "../math/MathRenderer";
import { OptionCard } from "./OptionCard";
import { Modal } from "../ui/Modal";

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
  // In practice mode only:
  isPracticeMode?: boolean;
  instantFeedback?: boolean;
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
  isPracticeMode = false,
  instantFeedback = false,
  correctOptionStableId,
  explanation,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-xs overflow-y-auto p-4 sm:p-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-slate-900 font-mono">
            Question No: {questionNumber}
          </span>
          {topic && (
            <span className="hidden sm:inline-block bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
              {topic}
            </span>
          )}
          <span
            className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
              source === "AI_GENERATED_PRACTICE"
                ? "bg-purple-50 text-purple-700 border border-purple-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {source === "AI_GENERATED_PRACTICE" ? "AI Practice" : "Official Source"}
          </span>
          {questionType && questionType !== "MCQ" && (
            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-medium">
              {questionType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
            +{marksPerCorrect.toFixed(1)}
          </span>
          <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded font-semibold">
            -{negativeMarks.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Question Body */}
      <div className="py-4 space-y-4">
        {/* Authentic DIRECTIONS Block (matching Screenshot 5) */}
        <div className="p-2.5 bg-slate-50/80 rounded-md border border-slate-200/80 text-xs text-slate-700 font-medium leading-relaxed">
          <span className="font-bold text-slate-900 font-serif">DIRECTIONS for the question: </span>
          <span>
            {directionText ||
              "Solve the following question and mark the best possible option among the four choices given."}
          </span>
        </div>

        <div className="text-base sm:text-lg leading-relaxed text-slate-900 font-sans">
          <MathRenderer text={questionText} />
        </div>

        {/* Visual Content (Diagram / Image / Table) */}
        {hasVisualContent && (
          <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-lg max-w-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Reference Diagram
              </span>
              <button
                onClick={() => setIsZoomOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium hover:underline"
              >
                <ZoomIn className="w-3.5 h-3.5" /> Enlarge Diagram
              </button>
            </div>
            {/* SVG/Image Diagram Representation */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="cursor-pointer bg-white p-3 rounded border border-slate-200 flex items-center justify-center hover:shadow-xs transition-shadow"
            >
              <svg
                viewBox="0 0 360 160"
                className="w-full h-auto max-h-48 object-contain"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="360" height="160" fill="#f8fafc" rx="6" />
                <circle cx="180" cy="80" r="50" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                <line x1="60" y1="80" x2="300" y2="80" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="60" y1="80" x2="180" y2="30" stroke="#dc2626" strokeWidth="2" />
                <circle cx="180" cy="30" r="3.5" fill="#dc2626" />
                <text x="185" y="26" fontSize="11" fontWeight="bold" fill="#dc2626">T (Tangent)</text>
                <circle cx="60" cy="80" r="3.5" fill="#0f172a" />
                <text x="45" y="78" fontSize="11" fontWeight="bold" fill="#0f172a">P</text>
                <circle cx="130" cy="80" r="3.5" fill="#0f172a" />
                <text x="126" y="96" fontSize="11" fontWeight="bold" fill="#0f172a">A</text>
                <circle cx="230" cy="80" r="3.5" fill="#0f172a" />
                <text x="226" y="96" fontSize="11" fontWeight="bold" fill="#0f172a">B</text>
                <text x="175" y="84" fontSize="9" fill="#64748b">Center O</text>
              </svg>
            </div>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {options.map((opt, index) => {
            const isSelected = selectedOptionStableId === opt.stableId;
            const shortcut = (index + 1).toString();

            return (
              <OptionCard
                key={opt.stableId}
                label={opt.displayLabel}
                text={opt.text}
                isSelected={isSelected}
                onSelect={() => onSelectOption(opt.stableId)}
                keyboardShortcut={shortcut}
              />
            );
          })}
        </div>

        {/* Practice Mode Instant Explanation */}
        {isPracticeMode && instantFeedback && selectedOptionStableId && (
          <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 animate-in fade-in">
            <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-blue-900">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Solution & Explanation</span>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed font-sans">
              <MathRenderer text={explanation || "No step-by-step explanation provided for this question."} />
            </div>
          </div>
        )}
      </div>

      {/* Diagram Enlarge Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={`Reference Diagram - Question ${questionNumber}`}
        maxWidth="lg"
      >
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
          <svg
            viewBox="0 0 360 160"
            className="w-full h-auto max-h-96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="360" height="160" fill="#f8fafc" rx="6" />
            <circle cx="180" cy="80" r="50" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            <line x1="60" y1="80" x2="300" y2="80" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="60" y1="80" x2="180" y2="30" stroke="#dc2626" strokeWidth="2" />
            <circle cx="180" cy="30" r="4" fill="#dc2626" />
            <text x="185" y="25" fontSize="12" fontWeight="bold" fill="#dc2626">T (Tangent Point)</text>
            <circle cx="60" cy="80" r="4" fill="#0f172a" />
            <text x="45" y="78" fontSize="12" fontWeight="bold" fill="#0f172a">P (External Point)</text>
            <circle cx="130" cy="80" r="4" fill="#0f172a" />
            <text x="126" y="98" fontSize="12" fontWeight="bold" fill="#0f172a">A</text>
            <circle cx="230" cy="80" r="4" fill="#0f172a" />
            <text x="226" y="98" fontSize="12" fontWeight="bold" fill="#0f172a">B</text>
            <text x="175" y="84" fontSize="10" fill="#64748b">O (Center)</text>
          </svg>
          <span className="text-xs text-slate-500 mt-3 text-center">
            Figure not drawn to scale. Use theoretical geometric properties ($PT^2 = PA \\times PB$) to solve.
          </span>
        </div>
      </Modal>
    </div>
  );
};
