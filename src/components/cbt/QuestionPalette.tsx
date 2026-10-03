"use client";

import React, { useState } from "react";
import { ResponseState } from "@/lib/exam/state-machine";
import { Layers, Filter } from "lucide-react";

export interface PaletteItem {
  index: number; // 0-based index
  questionNumber: number;
  state: ResponseState;
  isActive: boolean;
  subject?: string;
}

interface QuestionPaletteProps {
  items: PaletteItem[];
  currentSectionName?: string;
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  items,
  currentSectionName,
  onSelectQuestion,
}) => {
  const [filterMode, setFilterMode] = useState<"ALL" | "SECTION">("ALL");

  // Filter items if in SECTION mode and currentSectionName is provided
  const displayedItems =
    filterMode === "SECTION" && currentSectionName
      ? items.filter(
          (i) =>
            i.subject?.toLowerCase().trim() === currentSectionName.toLowerCase().trim()
        )
      : items;

  // Aggregate state counts
  const counts = {
    answered: items.filter((i) => i.state === "ANSWERED").length,
    notAnswered: items.filter((i) => i.state === "NOT_ANSWERED").length,
    notVisited: items.filter((i) => i.state === "NOT_VISITED").length,
    markedForReview: items.filter((i) => i.state === "MARKED_FOR_REVIEW").length,
    answeredAndMarked: items.filter((i) => i.state === "ANSWERED_AND_MARKED_FOR_REVIEW").length,
  };

  const getStateStyle = (state: ResponseState, isActive: boolean) => {
    const activeRing = isActive
      ? "ring-2 ring-blue-600 ring-offset-2 font-extrabold scale-105 shadow-sm"
      : "shadow-xs";

    switch (state) {
      case "ANSWERED":
        return `bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 ${activeRing}`;
      case "NOT_ANSWERED":
        return `bg-rose-500 text-white hover:bg-rose-600 border-rose-600 ${activeRing}`;
      case "MARKED_FOR_REVIEW":
        return `bg-purple-600 text-white hover:bg-purple-700 border-purple-700 ${activeRing}`;
      case "ANSWERED_AND_MARKED_FOR_REVIEW":
        return `bg-indigo-700 text-white hover:bg-indigo-800 border-indigo-900 relative ${activeRing}`;
      case "NOT_VISITED":
      default:
        return `bg-white text-slate-700 hover:bg-slate-100 border-slate-300/80 ${activeRing}`;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] border-l border-slate-200 select-none overflow-y-auto font-sans">
      {/* Legend & Summary Counters */}
      <div className="p-3.5 bg-white border-b border-slate-200 text-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800 tracking-tight uppercase text-[11px]">
            Question Status Legend
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            Total: {items.length} Qs
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
              {counts.answered}
            </span>
            <span className="text-slate-700 font-medium">Answered</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-rose-500 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
              {counts.notAnswered}
            </span>
            <span className="text-slate-700 font-medium">Not Answered</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-white text-slate-700 border border-slate-300 flex items-center justify-center font-bold text-[10px] shadow-2xs">
              {counts.notVisited}
            </span>
            <span className="text-slate-700 font-medium">Not Visited</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
              {counts.markedForReview}
            </span>
            <span className="text-slate-700 font-medium">Marked</span>
          </div>

          <div className="flex items-center gap-1.5 col-span-2">
            <span className="w-5 h-5 rounded bg-indigo-700 text-white flex items-center justify-center font-bold text-[10px] relative shadow-2xs">
              {counts.answeredAndMarked}
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-slate-700 font-medium">Ans. &amp; Marked for Review</span>
          </div>
        </div>
      </div>

      {/* Palette View Switcher & Header */}
      <div className="p-3.5 flex-1 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800">
            {currentSectionName ? (
              <span className="truncate max-w-[160px] inline-block" title={currentSectionName}>
                {currentSectionName}
              </span>
            ) : (
              "Question Palette"
            )}
          </div>

          {currentSectionName && (
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded text-[10px] font-semibold">
              <button
                onClick={() => setFilterMode("ALL")}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  filterMode === "ALL" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode("SECTION")}
                className={`px-1.5 py-0.5 rounded transition-all ${
                  filterMode === "SECTION" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600"
                }`}
              >
                Section
              </button>
            </div>
          )}
        </div>

        {/* Question Number Palette Grid */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {displayedItems.map((item) => (
            <button
              key={item.index}
              onClick={() => onSelectQuestion(item.index)}
              title={`Question ${item.questionNumber}: ${item.state}`}
              className={`h-9 w-full rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${getStateStyle(
                item.state,
                item.isActive
              )}`}
            >
              {item.questionNumber}
              {item.state === "ANSWERED_AND_MARKED_FOR_REVIEW" && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-300 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
