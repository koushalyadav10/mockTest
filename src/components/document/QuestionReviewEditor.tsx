"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { MathRenderer } from "../math/MathRenderer";
import {
  Check,
  Trash2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Sparkles,
  Shuffle,
  Eye,
  CheckCircle,
  Columns,
  Maximize2,
  ShieldCheck,
  Zap,
  Award,
  Calendar,
} from "lucide-react";
import { safelyShuffleOptions } from "@/lib/exam/shuffling";
import { BoundingBox } from "@/lib/ai/types";
import { SourceDocumentViewer } from "./SourceDocumentViewer";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { extractExamTag } from "@/lib/exam/tag-parser";

export interface ReviewQuestionItem {
  id: string;
  questionNumber: number;
  subject: string;
  topic: string;
  subtopic?: string | null;
  difficulty: string;
  difficultyConfidence?: number;
  questionType?: string;
  source?: string;
  language: string;
  questionText: string;
  hasVisualContent: boolean;
  visualType?: string;
  imageUrl?: string | null;
  diagramUrl?: string | null;
  options: { id: string; stableId: string; label: string; text: string; isCorrect: boolean }[];
  sourceAnswer?: string | null;
  aiSuggestedAnswer?: string | null;
  verifiedAnswer?: string | null;
  explanation?: string | null;
  requiresReview: boolean;
  status: string;
  sourcePage?: number;
  questionBoundingBox?: BoundingBox | null;
  optionBoundingBoxes?: { label: string; boundingBox: BoundingBox }[] | null;
  visualBoundingBox?: BoundingBox | null;
  confidence: {
    question: number;
    options: number;
    classification: number;
    subject?: number;
    topic?: number;
    difficulty?: number;
    answer: number;
    visualAssociation?: number;
  };
}

interface QuestionReviewEditorProps {
  questions: ReviewQuestionItem[];
  fileName?: string;
  documentId?: string;
  pdfUrl?: string | null;
  onSaveQuestion: (updated: ReviewQuestionItem) => void;
  onDeleteQuestion: (id: string) => void;
  onGenerateTest: () => void;
}

export const QuestionReviewEditor: React.FC<QuestionReviewEditorProps> = ({
  questions: initialQuestions,
  fileName = "Document_Upload.pdf",
  documentId,
  pdfUrl,
  onSaveQuestion,
  onDeleteQuestion,
  onGenerateTest,
}) => {
  const [questions, setQuestions] = useState<ReviewQuestionItem[]>(initialQuestions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<"SPLIT_SOURCE" | "QUESTION_LIST">("SPLIT_SOURCE");
  const [activePage, setActivePage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentQ = questions[selectedIndex] || questions[0];

  const handleSelectQuestion = (idx: number) => {
    setSelectedIndex(idx);
    setIsEditing(false);
    if (questions[idx]?.sourcePage) {
      setActivePage(questions[idx].sourcePage!);
    }
  };

  const handleUpdateCurrent = (updates: Partial<ReviewQuestionItem>) => {
    if (!currentQ) return;
    const updated: ReviewQuestionItem = { ...currentQ, ...updates };
    const nextList = [...questions];
    nextList[selectedIndex] = updated;
    setQuestions(nextList);
    onSaveQuestion(updated);
  };

  // 3-Level Answer Designation: Sets verifiedAnswer and marks option as isCorrect
  const handleSetVerifiedAnswer = (optLabel: string) => {
    if (!currentQ) return;
    const nextOptions = currentQ.options.map((opt) => ({
      ...opt,
      isCorrect: opt.label.trim().toUpperCase() === optLabel.trim().toUpperCase(),
    }));
    handleUpdateCurrent({
      options: nextOptions,
      verifiedAnswer: optLabel,
      requiresReview: false,
    });
    showToast(`✓ Option (${optLabel}) set as verified correct answer`);
  };

  const handleShuffleCurrentOptions = () => {
    if (!currentQ) return;
    const shuffled = safelyShuffleOptions(
      currentQ.options.map((o) => ({
        stableId: o.stableId,
        label: o.label,
        text: o.text,
        isCorrect: o.isCorrect,
      }))
    );

    const remapped = shuffled.map((s, idx) => ({
      id: currentQ.options[idx]?.id || s.stableId,
      stableId: s.stableId,
      label: s.displayLabel,
      text: s.text,
      isCorrect: Boolean(s.isCorrect),
    }));

    handleUpdateCurrent({ options: remapped });
    showToast(`✓ Options safely shuffled`);
  };

  const handleApproveAll = () => {
    const approved = questions.map((q) => ({
      ...q,
      requiresReview: false,
      status: "APPROVED",
      verifiedAnswer: q.verifiedAnswer || q.sourceAnswer || q.aiSuggestedAnswer || (q.options.find(o => o.isCorrect)?.label ?? null),
    }));
    setQuestions(approved);
    approved.forEach((q) => onSaveQuestion(q));
    showToast(`✓ All ${questions.length} questions approved successfully!`);
  };

  if (!currentQ) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No questions available to review.</p>
      </div>
    );
  }

  // Determine current effective answer
  const effectiveAnswer =
    currentQ.verifiedAnswer ||
    currentQ.sourceAnswer ||
    currentQ.aiSuggestedAnswer ||
    currentQ.options.find((o) => o.isCorrect)?.label;

  const { cleanQuestionText, examTag } = extractExamTag(currentQ.questionText, currentQ.subtopic);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Action & Viewport Mode Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Review Workspace
          </span>
          <span className="text-xs text-slate-500">
            ({questions.length} questions extracted)
          </span>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg border border-slate-200 text-xs ml-2">
            <button
              onClick={() => setViewMode("SPLIT_SOURCE")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === "SPLIT_SOURCE"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Split Source View
            </button>
            <button
              onClick={() => setViewMode("QUESTION_LIST")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                viewMode === "QUESTION_LIST"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              List &amp; Edit View
            </button>
          </div>

          {questions.some((q) => q.requiresReview) && (
            <Badge variant="warning">Action Needed: Verify Key</Badge>
          )}
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleApproveAll}>
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Approve All Questions
          </Button>

          <Button variant="primary" size="sm" onClick={onGenerateTest}>
            Create Mock Test
          </Button>
        </div>
      </div>

      {/* Question Selector Quick Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1 shrink-0">
          Jump to:
        </span>
        {questions.map((q, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={q.id || idx}
              onClick={() => handleSelectQuestion(idx)}
              className={`px-2.5 py-1 rounded font-mono shrink-0 transition-all ${
                isSelected
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : q.requiresReview
                  ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              Q.{q.questionNumber}
              {q.requiresReview && <span className="ml-1 text-[9px] text-amber-600 font-bold">&bull;</span>}
            </button>
          );
        })}
      </div>

      {/* Main Multi-Column Split Screen */}
      <div className="grid grid-cols-12 flex-1 min-h-[600px] divide-x divide-slate-200 overflow-hidden">
        {/* LEFT COLUMN: Source Document Viewer (in SPLIT_SOURCE mode) OR Question List (in QUESTION_LIST mode) */}
        {viewMode === "SPLIT_SOURCE" ? (
          <div className="col-span-12 md:col-span-5 h-full overflow-hidden bg-slate-900 p-2">
            <SourceDocumentViewer
              fileName={fileName}
              documentId={documentId}
              pdfUrl={fileName?.toLowerCase().endsWith(".pdf") ? (pdfUrl || (documentId ? `/uploads/${documentId}.pdf` : null)) : null}
              questions={questions}
              currentPage={activePage}
              onPageChange={(p) => setActivePage(p)}
              activeQuestionNumber={currentQ?.questionNumber || 1}
              questionBoundingBox={currentQ?.questionBoundingBox}
              optionBoundingBoxes={currentQ?.optionBoundingBoxes}
              visualBoundingBox={currentQ?.visualBoundingBox}
              imageUrl={currentQ?.imageUrl}
              questionSnippetText={currentQ?.questionText}
            />
          </div>
        ) : (
          <div className="col-span-12 md:col-span-3 overflow-y-auto bg-slate-50/50 p-3 space-y-2">
            {questions.map((q, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={q.id || idx}
                  onClick={() => handleSelectQuestion(idx)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-blue-600 shadow-xs ring-1 ring-blue-600"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 font-mono">
                      Q.{q.questionNumber}
                    </span>
                    {q.requiresReview ? (
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Review
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                        Approved
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {extractExamTag(q.questionText).cleanQuestionText}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* CENTER COLUMN: Question Editor & KaTeX Preview */}
        <div
          className={`col-span-12 overflow-y-auto p-5 sm:p-6 space-y-5 bg-white ${
            viewMode === "SPLIT_SOURCE" ? "md:col-span-4" : "md:col-span-6"
          }`}
        >
          {/* Header with Classification Tags */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold text-blue-600 font-mono uppercase tracking-wider">
                  Q.{currentQ.questionNumber}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium">
                  {currentQ.questionType || "MCQ"}
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                  {currentQ.source || "SOURCE_QUESTION"}
                </span>
                {examTag && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-900 font-bold text-[11px] shadow-2xs">
                    <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{examTag}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <select
                  value={currentQ.subject}
                  onChange={(e) => {
                    handleUpdateCurrent({ subject: e.target.value });
                    showToast(`✓ Subject set to ${e.target.value}`);
                  }}
                  className="text-xs font-bold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="General Awareness">General Awareness (GK & GS)</option>
                  <option value="Quantitative Aptitude">Quantitative Aptitude (Maths)</option>
                  <option value="General Intelligence">General Intelligence (Reasoning)</option>
                  <option value="English Language">English Language</option>
                  <option value="General Hindi">General Hindi</option>
                </select>
                <span className="text-slate-400 text-xs">&bull;</span>
                <input
                  type="text"
                  value={currentQ.topic}
                  onChange={(e) => handleUpdateCurrent({ topic: e.target.value })}
                  placeholder="Topic / Chapter..."
                  className="text-xs px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[200px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffleCurrentOptions}
                title="Safely shuffle options"
              >
                <Shuffle className="w-3.5 h-3.5 mr-1" />
                Shuffle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Preview Math" : "Edit Text"}
              </Button>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Question Content</label>
              <div className="flex items-center gap-2">
                {examTag && !isEditing && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                    {examTag}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-normal">KaTeX formatted</span>
              </div>
            </div>
            {isEditing ? (
              <textarea
                rows={4}
                value={currentQ.questionText}
                onChange={(e) => handleUpdateCurrent({ questionText: e.target.value })}
                className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
              />
            ) : (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 text-sm leading-relaxed">
                <MathRenderer text={cleanQuestionText} />
              </div>
            )}
          </div>

          {/* Visual Content Preview if Attached */}
          {currentQ.hasVisualContent && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Visual Diagram ({currentQ.visualType || "DIAGRAM"})</span>
                <span className="text-[10px] text-purple-600 font-mono">Preserved Region</span>
              </div>
              <div className="bg-white rounded border border-slate-200 p-2 flex justify-center">
                <div className="w-48 h-24 bg-slate-100 rounded border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-500 font-mono">
                  [Diagram Display: Page {currentQ.sourcePage || 1}]
                </div>
              </div>
            </div>
          )}

          {/* 3-Level Answer Verification Bar */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Three-Level Answer Verification
              </span>
              <span className="text-[11px] text-slate-500">
                Verified: <strong className="text-blue-700 font-mono">{effectiveAnswer || "Unset"}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="text-[10px] text-slate-400 font-medium">Source Key</div>
                <div className="font-bold font-mono text-slate-800 mt-0.5">
                  {currentQ.sourceAnswer ? `Option ${currentQ.sourceAnswer}` : "None"}
                </div>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <div className="text-[10px] text-slate-400 font-medium">AI Suggested</div>
                <div className="font-bold font-mono text-blue-600 mt-0.5">
                  {currentQ.aiSuggestedAnswer ? `Option ${currentQ.aiSuggestedAnswer}` : "None"}
                </div>
              </div>
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] text-emerald-700 font-medium">Human Verified</div>
                <div className="font-bold font-mono text-emerald-800 mt-0.5">
                  {currentQ.verifiedAnswer ? `Option ${currentQ.verifiedAnswer}` : "Pending"}
                </div>
              </div>
            </div>
          </div>

          {/* Options Section with Direct Answer Designation */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Options &amp; Verified Correct Answer
              </label>
              <span className="text-[11px] text-slate-400">
                Select option to set as verified correct answer
              </span>
            </div>

            <div className="space-y-2">
              {currentQ.options.map((opt) => {
                const isDesignatedCorrect =
                  currentQ.verifiedAnswer === opt.label ||
                  (!currentQ.verifiedAnswer && opt.isCorrect);

                return (
                  <div
                    key={opt.stableId}
                    onClick={() => handleSetVerifiedAnswer(opt.label)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isDesignatedCorrect
                        ? "bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`verified-answer-${currentQ.id}`}
                      checked={Boolean(isDesignatedCorrect)}
                      onChange={() => handleSetVerifiedAnswer(opt.label)}
                      className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-bold text-xs w-5 font-mono text-slate-700 mt-0.5">
                      {opt.label}.
                    </span>
                    <div className="flex-1 text-xs sm:text-sm text-slate-800">
                      <MathRenderer text={opt.text} />
                    </div>
                    {isDesignatedCorrect && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Verified Correct
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-slate-700">Solution / Explanation</label>
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-700 leading-relaxed">
              <MathRenderer text={currentQ.explanation || "No explanation entered."} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Metadata & Confidences (~25-30%) */}
        <div className="col-span-12 md:col-span-3 overflow-y-auto p-4 bg-slate-50 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Confidences
          </h4>

          {/* Granular Confidences */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-3">
            <div className="font-semibold text-xs text-slate-800">Extraction Confidence</div>

            <ConfidenceIndicator
              label="Question Text"
              score={currentQ.confidence.question}
            />
            <ConfidenceIndicator
              label="Options Structure"
              score={currentQ.confidence.options}
            />
            <ConfidenceIndicator
              label="Subject Classification"
              score={currentQ.confidence.subject ?? currentQ.confidence.classification}
            />
            <ConfidenceIndicator
              label="Answer Inference"
              score={currentQ.confidence.answer}
            />
            {currentQ.hasVisualContent && (
              <ConfidenceIndicator
                label="Diagram Association"
                score={currentQ.confidence.visualAssociation ?? 0.9}
              />
            )}
          </div>

          {/* Classification Metadata */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-800">SSC Exam Categorization</div>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="font-medium text-slate-800">{currentQ.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Topic:</span>
                <span className="font-medium text-slate-800">{currentQ.topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Difficulty:</span>
                <span className="font-medium text-slate-800">
                  {currentQ.difficulty} ({Math.round((currentQ.difficultyConfidence || 0.85) * 100)}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Source Page:</span>
                <span className="font-mono text-slate-800">Page {currentQ.sourcePage || 1}</span>
              </div>
            </div>
          </div>

          {/* Actions: Approve / Delete */}
          <div className="space-y-2 pt-2">
            <Button
              variant={currentQ.status === "APPROVED" && !currentQ.requiresReview ? "outline" : "primary"}
              size="sm"
              className={`w-full ${
                currentQ.status === "APPROVED" && !currentQ.requiresReview
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 font-bold"
                  : "bg-blue-600 hover:bg-blue-700 text-white font-bold"
              }`}
              onClick={() => {
                handleUpdateCurrent({
                  requiresReview: false,
                  status: "APPROVED",
                  verifiedAnswer: effectiveAnswer,
                });
                showToast(`✓ Question Q.${currentQ.questionNumber} marked as Approved!`);
              }}
            >
              <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              {currentQ.status === "APPROVED" && !currentQ.requiresReview
                ? `✓ Question Q.${currentQ.questionNumber} Approved`
                : `Approve Question Q.${currentQ.questionNumber}`}
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="w-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
              onClick={() => {
                onDeleteQuestion(currentQ.id);
                showToast(`Question Q.${currentQ.questionNumber} deleted`);
              }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Question
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Interactive Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-slate-700 backdrop-blur-sm transition-all duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
