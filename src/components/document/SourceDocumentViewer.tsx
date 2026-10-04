"use client";

import React, { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  FileText,
  FileCheck2,
  Table,
} from "lucide-react";
import { Button } from "../ui/Button";
import { BoundingBox } from "@/lib/ai/types";
import { ReviewQuestionItem } from "./QuestionReviewEditor";

export interface HighlightBox {
  id?: string;
  label: string;
  box: BoundingBox;
  type: "QUESTION" | "OPTION" | "VISUAL";
}

interface SourceDocumentViewerProps {
  fileName?: string;
  documentId?: string;
  pdfUrl?: string | null;
  questions?: ReviewQuestionItem[];
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (newPage: number) => void;
  activeQuestionNumber?: number;
  questionBoundingBox?: BoundingBox | null;
  optionBoundingBoxes?: { label: string; boundingBox: BoundingBox }[] | null;
  visualBoundingBox?: BoundingBox | null;
  imageUrl?: string | null;
  questionSnippetText?: string;
}

export const SourceDocumentViewer: React.FC<SourceDocumentViewerProps> = ({
  fileName = "Uploaded_Question_Paper.pdf",
  documentId,
  pdfUrl,
  questions = [],
  pageCount: explicitPageCount,
  currentPage = 1,
  onPageChange,
  activeQuestionNumber = 1,
  questionBoundingBox,
  optionBoundingBoxes,
  visualBoundingBox,
  imageUrl,
  questionSnippetText,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [viewMode, setViewMode] = useState<"SHEET" | "PDF">(pdfUrl ? "PDF" : "SHEET");

  const computedPageCount =
    explicitPageCount ||
    (questions.length > 0 ? Math.max(1, Math.ceil(questions.length / 5)) + 1 : 1);
  const pageCount = Math.max(1, computedPageCount);

  const handleZoomIn = () => setZoom((prev) => Math.min(250, prev + 25));
  const handleZoomOut = () => setZoom((prev) => Math.max(50, prev - 25));
  const handleZoomReset = () => setZoom(100);

  // Fallback default bounding box if none is provided
  const qBox: BoundingBox = questionBoundingBox || {
    x: 6,
    y: 12 + (((activeQuestionNumber - 1) % 5) * 16),
    width: 88,
    height: 15,
  };

  // Determine questions belonging to this page (5 per page)
  const pageQuestions = questions.filter((q) => {
    const p = q.sourcePage || Math.ceil(q.questionNumber / 5);
    return p === currentPage;
  });

  const isAnswerKeyPage = currentPage === pageCount && questions.some((q) => q.sourceAnswer);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-xl overflow-hidden border border-slate-800 shadow-md">
      {/* Top Toolbar */}
      <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-[240px]" title={fileName}>
            {fileName}
          </span>
          <span className="text-[10px] bg-blue-950/80 text-blue-400 border border-blue-800/60 px-1.5 py-0.5 rounded font-mono font-medium">
            Source Doc
          </span>
        </div>

        {/* Page Controls */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5">
          <button
            onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 hover:text-blue-400 disabled:opacity-30 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-1.5 text-slate-300">
            Page {currentPage} of {pageCount}
          </span>
          <button
            onClick={() => onPageChange && onPageChange(Math.min(pageCount, currentPage + 1))}
            disabled={currentPage >= pageCount}
            className="p-1 hover:text-blue-400 disabled:opacity-30 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom & View Mode Controls */}
        <div className="flex items-center gap-2">
          {pdfUrl && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[10px]">
              <button
                onClick={() => setViewMode("SHEET")}
                className={`px-2 py-0.5 rounded transition-all ${
                  viewMode === "SHEET"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sheet
              </button>
              <button
                onClick={() => setViewMode("PDF")}
                className={`px-2 py-0.5 rounded transition-all ${
                  viewMode === "PDF"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                PDF
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-slate-400 px-1 text-[10px]">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Document Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950/80 flex justify-center items-start">
        {viewMode === "PDF" && pdfUrl ? (
          <div
            className="w-full h-[750px] bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-700"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          >
            <iframe
              src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title="Original PDF Document Preview"
            />
          </div>
        ) : (
          <div
            className="relative transition-transform duration-200 origin-top shadow-2xl"
            style={{
              transform: `scale(${zoom / 100})`,
              width: "595px", // Standard A4 aspect ratio at 72dpi
              minHeight: "842px",
            }}
          >
            {/* Paper Sheet Representation */}
            <div className="w-full min-h-[842px] bg-white text-slate-900 rounded-sm shadow-xl p-8 relative overflow-hidden font-sans select-none border border-slate-200">
              {/* Header of Uploaded Paper */}
              <div className="border-b-2 border-slate-800 pb-3 mb-5 text-center">
                <div className="text-[12px] font-bold tracking-tight text-slate-900 uppercase font-sans">
                  {fileName.replace(/\.pdf$/i, "").replace(/[-_]/g, " ")}
                </div>
                <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                  Extracted from Original Document &bull; Page {currentPage} of {pageCount}
                </div>
              </div>

              {/* Real Question Lines for the Current Page */}
              {pageQuestions.length > 0 ? (
                <div className="space-y-5 text-xs text-slate-800">
                  {pageQuestions.map((q) => {
                    const isActive = q.questionNumber === activeQuestionNumber;
                    return (
                      <div
                        key={q.id || q.questionNumber}
                        className={`p-2.5 rounded-lg transition-all ${
                          isActive
                            ? "bg-blue-50/70 ring-2 ring-blue-500 ring-offset-1"
                            : "opacity-85 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-start gap-2 font-medium text-slate-900">
                          <span className="font-bold font-mono text-blue-700">
                            Q.{q.questionNumber}
                          </span>
                          <p className="flex-1 text-[11px] leading-relaxed">
                            {q.questionText}
                          </p>
                        </div>

                        {/* Options rendered directly from the document */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-700 pl-6">
                            {q.options.map((opt) => (
                              <div
                                key={opt.id || opt.label}
                                className={
                                  opt.label === q.sourceAnswer || opt.isCorrect
                                    ? "font-bold text-emerald-800"
                                    : ""
                                }
                              >
                                <strong className="font-mono text-slate-900 mr-1">
                                  {opt.label}.
                                </strong>
                                <span>{opt.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : isAnswerKeyPage ? (
                /* Answer Key Section on the Last Page */
                <div className="space-y-6 pt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    Official Answer Key Detected in Document
                  </div>

                  <div className="border border-slate-300 rounded-lg overflow-hidden max-w-md mx-auto shadow-xs">
                    <div className="bg-slate-100 border-b border-slate-300 py-2 font-bold text-xs text-slate-700">
                      Answer Key Table
                    </div>
                    <div className="grid grid-cols-5 divide-x divide-y divide-slate-200 text-xs font-mono">
                      {questions.map((q) => (
                        <div key={q.questionNumber} className="p-2 text-center bg-white">
                          <div className="text-[10px] text-slate-400">Q.{q.questionNumber}</div>
                          <div className="text-sm font-bold text-emerald-700">
                            {q.sourceAnswer || q.verifiedAnswer || "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 text-xs">
                  <div>Showing Page {currentPage}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Select a question on the right or use page navigation.
                  </div>
                </div>
              )}

              {/* Document Footer */}
              <div className="absolute bottom-4 left-8 right-8 border-t border-slate-200 pt-2 flex justify-between text-[10px] text-slate-400 font-sans">
                <span>ExamForge AI Document Inspector &bull; High-Fidelity Extraction</span>
                <span>Page {currentPage} of {pageCount}</span>
              </div>

              {/* SVG Bounding Box Overlays */}
              {pageQuestions.some((q) => q.questionNumber === activeQuestionNumber) && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500/10 rounded transition-all duration-300"
                    style={{
                      left: `${qBox.x}%`,
                      top: `${qBox.y}%`,
                      width: `${qBox.width}%`,
                      height: `${qBox.height}%`,
                    }}
                  >
                    <div className="absolute -top-3 left-0 bg-blue-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded shadow flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Q.{activeQuestionNumber} Source Box
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
