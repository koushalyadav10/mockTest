"use client";

import React, { useState } from "react";
import {
  ZoomIn,
  Image as ImageIcon,
  Award,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Languages,
  FileText,
} from "lucide-react";
import { MathRenderer } from "../math/MathRenderer";
import { OptionCard } from "./OptionCard";
import { Modal } from "../ui/Modal";
import { extractExamTag, cleanExamCitationTag } from "@/lib/exam/tag-parser";
import {
  translateTextToHindi,
  translateOptionToHindi,
  translateExplanationToHindi,
} from "@/lib/exam/bilingual-translator";
import { DataInterpretationVisual } from "./DataInterpretationVisual";

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
  // Exam metadata & citation
  exam?: string | null;
  year?: number | null;
  tags?: string | null;
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
  exam,
  year,
  tags,
  questionTimeSeconds = 0,
  isInstantFeedbackActive = false,
  onToggleInstantFeedback,
  correctOptionStableId,
  explanation,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [questionLang, setQuestionLang] = useState<"en" | "hi">("en");

  const { cleanQuestionText, examTag: inlineTag, year: parsedYear, examName: parsedExam } = extractExamTag(questionText, tags || exam);
  const rawTag = inlineTag || (exam && exam !== "CBT Assessment" ? exam : null) || (year ? `Exam ${year}` : null);
  const displayExamTag = cleanExamCitationTag(rawTag, topic);

  // Extract [Type: ...] if embedded in text
  let typeHeader = "";
  let displayQuestionText = cleanQuestionText;
  const typeMatch = cleanQuestionText.match(/\[Type:\s*([^\]]+)\]/i);
  if (typeMatch) {
    typeHeader = typeMatch[1].trim();
    displayQuestionText = cleanQuestionText.replace(/\[Type:\s*[^\]]+\]\s*/i, "").trim();
  }

  // Determine whether to display Data Interpretation visual card
  const isDataInterpretation =
    topic?.toLowerCase().includes("data interpretation") ||
    topic?.toLowerCase().includes("di") ||
    typeHeader.toLowerCase().includes("chart") ||
    typeHeader.toLowerCase().includes("graph") ||
    typeHeader.toLowerCase().includes("tabular") ||
    displayQuestionText.toLowerCase().includes("from the given table") ||
    displayQuestionText.toLowerCase().includes("from the given graph") ||
    displayQuestionText.toLowerCase().includes("bar graph") ||
    displayQuestionText.toLowerCase().includes("line graph") ||
    displayQuestionText.toLowerCase().includes("pie chart") ||
    Boolean(imageUrl);

  // Bilingual translation support
  const activeQuestionText = questionLang === "hi" ? translateTextToHindi(displayQuestionText) : displayQuestionText;
  const activeTypeHeader = questionLang === "hi" && typeHeader ? translateTextToHindi(typeHeader) : typeHeader;
  const activeExplanation = questionLang === "hi" ? translateExplanationToHindi(explanation) : explanation;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#fafbfc] rounded-2xl border border-slate-200/90 shadow-2xs overflow-y-auto landscape:overflow-hidden scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 p-2.5 sm:p-6 landscape:p-2 landscape:py-1.5">
      {/* Top Header Bar: Ultra-compact single slim line in landscape */}
      <div className="flex flex-wrap landscape:flex-nowrap items-center justify-between gap-1.5 sm:gap-2 pb-1.5 sm:pb-3.5 landscape:pb-1 border-b border-slate-200/80 text-xs shrink-0">
        {/* Left: Question No + Topic + Question Timer */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap landscape:flex-nowrap">
          <span className="text-base sm:text-lg landscape:text-sm font-black text-slate-900 font-mono tracking-tight shrink-0">
            Q.{questionNumber}
          </span>

          {topic && (
            <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 landscape:px-1.5 landscape:py-0.5 rounded-lg border border-slate-200/80 text-[11px] landscape:text-[10px] max-w-[130px] sm:max-w-none truncate shrink-0">
              {topic}
            </span>
          )}

          {/* Exam Citation: hidden on mobile landscape to guarantee 1-row header */}
          {displayExamTag && (
            <span className="hidden sm:inline-flex landscape:hidden lg:landscape:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/90 border border-amber-300/90 text-amber-950 font-bold text-[11px] shadow-2xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="max-w-[160px] truncate">{displayExamTag}</span>
            </span>
          )}

          {/* Per-Question Live Timer & Speed Badge */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 landscape:px-1.5 landscape:py-0.5 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-800 text-[11px] landscape:text-[10px] font-mono font-bold shrink-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
            <span>Time: {formatTimer(questionTimeSeconds)}</span>
            {selectedOptionStableId && (
              <span className="text-emerald-700 font-semibold ml-1 hidden sm:inline">
                ({questionTimeSeconds}s)
              </span>
            )}
          </div>
        </div>

        {/* Right: Bilingual Single-Question Switcher & Marks Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Official SSC Real-Time Question Language Toggle */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-white border border-slate-300 rounded-lg sm:rounded-xl px-1.5 py-0.5 sm:px-2.5 sm:py-1 shadow-2xs hover:border-indigo-400 transition-colors">
            <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 hidden md:inline">View in:</span>
            <select
              value={questionLang}
              onChange={(e) => setQuestionLang(e.target.value as "en" | "hi")}
              className="bg-transparent text-[11px] sm:text-xs font-black text-slate-900 border-none outline-none cursor-pointer pr-0.5"
              title="Switch language between English and Hindi for this question"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 font-mono text-[10px] sm:text-[11px] font-bold shrink-0">
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded">
              +{marksPerCorrect.toFixed(1)}
            </span>
            <span className="text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded">
              -{negativeMarks.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content Body: Single column in Portrait, 2-column half/half split in Landscape */}
      <div className="py-2 sm:py-4 landscape:py-1 flex-1 w-full grid grid-cols-1 landscape:grid-cols-2 gap-3 sm:gap-6 landscape:gap-3 overflow-hidden min-h-0">
        {/* Left Side: Question Text, Context Passage, DI Visuals / Diagrams */}
        <div className="space-y-2.5 sm:space-y-3 landscape:space-y-1.5 overflow-y-auto pr-1 landscape:pr-2 scrollbar-thin scrollbar-thumb-slate-200 overscroll-contain [-webkit-overflow-scrolling:touch]">
          {/* Authentic Aditya Ranjan Type Badge (if present) */}
          {activeTypeHeader && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-2xs border border-slate-700">
              <span className="text-amber-400">◆</span>
              <span>{activeTypeHeader}</span>
              <span className="text-amber-400">◆</span>
            </div>
          )}

          {/* Reading Comprehension Passage or Story Context */}
          {directionText && (
            <div className="p-3 sm:p-5 landscape:p-2.5 rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-2xs space-y-1 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-900">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 shrink-0" />
                <span>Reference Context / Reading Passage</span>
              </div>
              <div className="text-[13px] sm:text-base landscape:text-[12px] landscape:leading-snug text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                <MathRenderer text={directionText} />
              </div>
            </div>
          )}

          {/* Data Interpretation Visual or Chart or Diagram */}
          {isDataInterpretation && (
            <DataInterpretationVisual
              questionNumber={questionNumber}
              subtopic={typeHeader || topic}
              questionText={displayQuestionText}
              hasVisualContent={hasVisualContent}
              visualType={visualType}
              imageUrl={imageUrl}
            />
          )}

          {/* Highlighted Crisp Large Question Text */}
          <div className="text-[16px] sm:text-[21px] landscape:text-[14px] sm:landscape:text-[16px] font-semibold text-slate-900 leading-snug sm:leading-relaxed tracking-tight py-1 sm:py-2 landscape:py-0.5">
            <MathRenderer text={activeQuestionText} />
          </div>

          {/* Fallback Image for Non-DI questions if imageUrl exists */}
          {!isDataInterpretation && hasVisualContent && imageUrl && (
            <div className="my-1.5 sm:my-2 p-2 sm:p-3 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm block w-full max-w-2xl">
              <img
                src={imageUrl}
                alt={`Question ${questionNumber} Diagram`}
                className="max-h-[220px] sm:max-h-[480px] landscape:max-h-[150px] w-auto mx-auto object-contain rounded-xl cursor-pointer hover:opacity-95 transition-all"
                onClick={() => setIsZoomOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Right Side: Options & Instant Feedback Explanation */}
        <div className="space-y-1.5 sm:space-y-2.5 landscape:space-y-1 overflow-y-auto pl-0 landscape:pl-2 scrollbar-thin scrollbar-thumb-slate-200 flex flex-col justify-start overscroll-contain [-webkit-overflow-scrolling:touch]">
          <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider pb-0.5 shrink-0 landscape:hidden">
            {questionLang === "hi" ? "अपना विकल्प चुनें:" : "Select Your Option:"}
          </div>

          <div className="space-y-1.5 sm:space-y-2.5 landscape:space-y-1 w-full">
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

              const optionDisplay = questionLang === "hi" ? translateOptionToHindi(opt.text) : opt.text;

              return (
                <OptionCard
                  key={opt.stableId}
                  label={opt.displayLabel}
                  text={optionDisplay}
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
            <div className="mt-3 p-3.5 sm:p-4 rounded-2xl border border-blue-200/90 bg-blue-50/40 space-y-2 w-full transition-all animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{questionLang === "hi" ? "चरणबद्ध समाधान एवं दृष्टिकोण" : "Step-by-Step Solution & Approach"}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                <MathRenderer
                  text={
                    activeExplanation ||
                    `Answer option (${options.find((o) => o.stableId === correctOptionStableId)?.displayLabel || "Verified"}) is verified by TCS standard methodology.`
                  }
                />
              </div>
            </div>
          )}
        </div>
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

