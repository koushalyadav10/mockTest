"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
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
  // Session-wide or controlled language state
  activeLanguage?: "en" | "hi";
  onLanguageChange?: (lang: "en" | "hi") => void;
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
  activeLanguage,
  onLanguageChange,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [internalLang, setInternalLang] = useState<"en" | "hi">("en");
  const effectiveLang = activeLanguage || internalLang;

  const [translatedMap, setTranslatedMap] = useState<Record<string, {
    questionText: string;
    typeHeader?: string;
    directionText?: string | null;
    options: Record<string, string>;
    explanation?: string | null;
  }>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const { cleanQuestionText, examTag: inlineTag, year: parsedYear, examName: parsedExam } = extractExamTag(questionText, tags || exam);
  const rawTag = inlineTag || tags || (exam && exam !== "CBT Assessment" ? exam : null) || (year ? `Exam ${year}` : null);
  const displayExamTag = cleanExamCitationTag(rawTag, topic);
  // User requested: only show exam citation when a year/shift is actually present
  const hasYear = Boolean(displayExamTag && /\b(19\d{2}|20\d{2})\b/.test(displayExamTag));

  // Extract [Type: ...] if embedded in text
  let typeHeader = "";
  let displayQuestionText = cleanQuestionText;
  const typeMatch = cleanQuestionText.match(/\[Type:\s*([^\]]+)\]/i);
  if (typeMatch) {
    typeHeader = typeMatch[1].trim();
    displayQuestionText = cleanQuestionText.replace(/\[Type:\s*[^\]]+\]\s*/i, "").trim();
  }

  // Detect whether original source text is in Hindi Devanagari or English
  const combinedSample = displayQuestionText + " " + (options[0]?.text || "");
  const devanagariCount = (combinedSample.match(/[\u0900-\u097F]/g) || []).length;
  const isOriginalHindi = devanagariCount > 3;

  // Determine if translation is needed:
  // If effectiveLang is 'hi' and original is English -> translate to 'hi'
  // If effectiveLang is 'en' and original is Hindi -> translate to 'en'
  const needsTranslation = (effectiveLang === "hi" && !isOriginalHindi) || (effectiveLang === "en" && isOriginalHindi);

  // Question translation key (scoped by target language)
  const questionKey = `q_${questionNumber}_${effectiveLang}_${displayQuestionText.slice(0, 35)}`;

  useEffect(() => {
    if (!needsTranslation) return;
    if (translatedMap[questionKey]) return;

    let isMounted = true;
    setIsTranslating(true);

    const texts = [
      displayQuestionText,
      typeHeader || "",
      directionText || "",
      explanation || "",
      ...options.map((o) => o.text),
    ];

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang: effectiveLang }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data?.translatedTexts) return;
        const [qText, tHeader, dText, exp, ...optTexts] = data.translatedTexts;
        const optMap: Record<string, string> = {};
        options.forEach((opt, idx) => {
          optMap[opt.stableId] = optTexts[idx] || opt.text;
        });

        setTranslatedMap((prev) => ({
          ...prev,
          [questionKey]: {
            questionText: qText || displayQuestionText,
            typeHeader: tHeader || typeHeader,
            directionText: dText || directionText,
            options: optMap,
            explanation: exp || explanation,
          },
        }));
      })
      .catch((err) => {
        console.warn("Failed to fetch full translation:", err);
      })
      .finally(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [needsTranslation, effectiveLang, questionKey, displayQuestionText, typeHeader, directionText, explanation, options]);

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

  // Active texts based on language and translation
  const currentTranslation = translatedMap[questionKey];
  const activeQuestionText = needsTranslation
    ? currentTranslation?.questionText || (effectiveLang === "hi" ? translateTextToHindi(displayQuestionText) : displayQuestionText)
    : displayQuestionText;

  const activeTypeHeader = needsTranslation
    ? currentTranslation?.typeHeader || (typeHeader ? (effectiveLang === "hi" ? translateTextToHindi(typeHeader) : typeHeader) : typeHeader)
    : typeHeader;

  const activeDirectionText = needsTranslation
    ? currentTranslation?.directionText || directionText
    : directionText;

  const activeExplanation = needsTranslation
    ? currentTranslation?.explanation || (effectiveLang === "hi" ? translateExplanationToHindi(explanation) : explanation)
    : explanation;

  const handleLangChange = (newLang: "en" | "hi") => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      setInternalLang(newLang);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#fafbfc] rounded-2xl border border-slate-200/90 shadow-2xs overflow-y-auto max-lg:landscape:overflow-hidden scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 p-3 sm:p-4 lg:p-5 max-lg:landscape:p-2 max-lg:landscape:py-1.5">
      {/* Top Header Bar */}
      <div className="flex flex-wrap max-lg:landscape:flex-nowrap items-center justify-between gap-2 pb-2 sm:pb-2.5 max-lg:landscape:pb-1 border-b border-slate-200/80 text-xs shrink-0">
        {/* Left: Question No + Topic + Question Timer */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap max-lg:landscape:flex-nowrap">
          <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight shrink-0">
            Q.{questionNumber}
          </span>

          {topic && (
            <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 max-lg:landscape:px-1.5 max-lg:landscape:py-0.5 rounded-lg border border-slate-200/80 text-xs max-lg:landscape:text-[10px] max-w-[150px] sm:max-w-none truncate shrink-0">
              {topic}
            </span>
          )}

          {/* Per-Question Live Timer & Speed Badge */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 max-lg:landscape:px-1.5 max-lg:landscape:py-0.5 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-800 text-xs max-lg:landscape:text-[10px] font-mono font-bold shrink-0">
            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Time: {formatTimer(questionTimeSeconds)}</span>
            {selectedOptionStableId && (
              <span className="text-emerald-700 font-semibold ml-1 hidden sm:inline">
                ({questionTimeSeconds}s)
              </span>
            )}
          </div>
        </div>

        {/* Right: Bilingual Single-Question Switcher & Marks Badges */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Official SSC Real-Time Question Language Toggle */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg sm:rounded-xl px-2 py-0.5 shadow-2xs hover:border-indigo-400 transition-colors">
            <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-slate-500 hidden md:inline">View in:</span>
            <select
              value={effectiveLang}
              onChange={(e) => handleLangChange(e.target.value as "en" | "hi")}
              className="bg-transparent text-xs font-black text-slate-900 border-none outline-none cursor-pointer pr-0.5"
              title="Switch language between English and Hindi for this test"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            {isTranslating && <Loader2 className="w-3 h-3 text-indigo-600 animate-spin shrink-0" />}
          </div>

          <div className="flex items-center gap-1 font-mono text-xs font-bold shrink-0">
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              +{marksPerCorrect.toFixed(1)}
            </span>
            <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              -{negativeMarks.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content Body: Single spacious column in Desktop & Portrait, 2-column ONLY in Mobile Landscape */}
      <div className="py-2 sm:py-3 max-lg:landscape:py-1 flex-1 w-full grid grid-cols-1 max-lg:landscape:grid-cols-2 gap-3.5 sm:gap-5 max-lg:landscape:gap-2.5 overflow-y-auto max-lg:landscape:overflow-hidden min-h-0">
        {/* Question Text, Context Passage, DI Visuals / Diagrams */}
        <div className="space-y-2 sm:space-y-3 max-lg:landscape:space-y-1.5 overflow-visible max-lg:landscape:overflow-y-auto pr-0 max-lg:landscape:pr-2">
          {/* Authentic Aditya Ranjan Type Badge (if present) */}
          {activeTypeHeader && (
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-lg bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-2xs border border-slate-700">
              <span className="text-amber-400">◆</span>
              <span>{activeTypeHeader}</span>
              <span className="text-amber-400">◆</span>
            </div>
          )}

          {/* Reading Comprehension Passage or Story Context */}
          {directionText && (
            <div className="p-3.5 sm:p-4 max-lg:landscape:p-2 rounded-xl bg-amber-50/70 border border-amber-200/90 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Reference Context / Reading Passage</span>
              </div>
              <div className="text-xs sm:text-sm max-lg:landscape:text-[11px] text-slate-800 leading-relaxed font-normal whitespace-pre-line">
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

          {/* Highlighted Crisp Large Question Text (Calibrated for comfortable single-screen fit) */}
          <div className="text-[16px] sm:text-[18px] lg:text-[19px] max-lg:landscape:text-[13px] font-bold text-slate-900 leading-snug tracking-tight py-1 sm:py-1.5 max-lg:landscape:py-0.5">
            <MathRenderer text={activeQuestionText} />
          </div>

          {/* Official Exam Year & Shift Badge (Shown under question text only when year/shift exists) */}
          {hasYear && displayExamTag && (
            <div className="flex justify-end pt-0.5 pb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#c5e1dd] text-[#0f4037] border border-[#a8d3cc] font-bold text-xs tracking-wide shadow-2xs select-none">
                {displayExamTag}
              </span>
            </div>
          )}

          {/* Fallback Image for Non-DI questions if imageUrl exists */}
          {!isDataInterpretation && hasVisualContent && imageUrl && (
            <div className="my-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-sm block w-full max-w-2xl">
              <img
                src={imageUrl}
                alt={`Question ${questionNumber} Diagram`}
                className="max-h-[220px] sm:max-h-[380px] max-lg:landscape:max-h-[140px] w-auto mx-auto object-contain rounded-xl cursor-pointer hover:opacity-95 transition-all"
                onClick={() => setIsZoomOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Options & Instant Feedback Explanation */}
        <div className="space-y-1.5 sm:space-y-2 max-lg:landscape:space-y-1 overflow-visible max-lg:landscape:overflow-y-auto pl-0 max-lg:landscape:pl-2 flex flex-col justify-start">
          <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider pb-0.5 shrink-0 max-lg:landscape:hidden">
            {effectiveLang === "hi" ? "अपना विकल्प चुनें (Select Your Option):" : "Select Your Option:"}
          </div>

          <div className="space-y-1.5 sm:space-y-2 max-lg:landscape:space-y-1 w-full">
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

              const isCodeOrFormulaOrNumber = (t: string) => {
                const s = t.trim();
                if (/^[\d\s,\-_+*/\\()=?:.><%^&!$]+$/.test(s)) return true;
                if (/^[A-Z0-9\s,\-_+*/\\()=?:.><%^&!$]+$/.test(s) && !/[a-z]/.test(s)) return true;
                if (s.length <= 15 && !/\s/.test(s) && /^[A-Z0-9]+$/i.test(s)) return true;
                return false;
              };

              const optionDisplay = needsTranslation && !isCodeOrFormulaOrNumber(opt.text)
                ? currentTranslation?.options[opt.stableId] || (effectiveLang === "hi" ? translateOptionToHindi(opt.text) : opt.text)
                : opt.text;

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
                <span>{effectiveLang === "hi" ? "चरणबद्ध समाधान एवं दृष्टिकोण" : "Step-by-Step Solution & Approach"}</span>
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

