"use client";

import React, { useState } from "react";
import { ResponseState } from "@/lib/exam/state-machine";

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
      ? "ring-2 ring-blue-600 ring-offset-1 font-bold scale-105 z-10 shadow-sm"
      : "";

    switch (state) {
      case "ANSWERED":
        return `bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 ${activeRing}`;
      case "NOT_ANSWERED":
        return `bg-rose-500 text-white hover:bg-rose-600 border-rose-500 ${activeRing}`;
      case "MARKED_FOR_REVIEW":
        return `bg-purple-600 text-white hover:bg-purple-700 border-purple-600 ${activeRing}`;
      case "ANSWERED_AND_MARKED_FOR_REVIEW":
        return `bg-indigo-700 text-white hover:bg-indigo-800 border-indigo-700 relative ${activeRing}`;
      case "NOT_VISITED":
      default:
        return `bg-white text-slate-700 hover:bg-slate-100 border-slate-300 ${activeRing}`;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] border-l border-slate-200 select-none overflow-y-auto font-sans w-full max-w-[280px]">
      {/* Legend & Summary Counters */}
      <div className="p-3 bg-white border-b border-slate-200/90 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-800 tracking-tight uppercase text-[10px]">
            Palette Legend
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            {items.length} Qs
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px]">
              {counts.answered}
            </span>
            <span className="text-slate-600 font-medium">Answered</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-rose-500 text-white flex items-center justify-center font-bold text-[9px]">
              {counts.notAnswered}
            </span>
            <span className="text-slate-600 font-medium">Not Ans.</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-white text-slate-700 border border-slate-300 flex items-center justify-center font-bold text-[9px]">
              {counts.notVisited}
            </span>
            <span className="text-slate-600 font-medium">Not Visited</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-[9px]">
              {counts.markedForReview}
            </span>
            <span className="text-slate-600 font-medium">Marked</span>
          </div>
        </div>
      </div>

      {/* Palette Grid Container */}
      <div className="p-2.5 flex-1 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="text-[11px] font-bold text-slate-700 truncate max-w-[140px]">
            {currentSectionName || "Questions"}
          </div>

          {currentSectionName && (
            <div className="flex items-center bg-slate-200/70 p-0.5 rounded text-[9px] font-semibold">
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
                Sec
              </button>
            </div>
          )}
        </div>

        {/* Compact Question Number Palette Grid */}
        <div className="grid grid-cols-6 gap-1 pt-1">
          {displayedItems.map((item) => (
            <button
              key={item.index}
              onClick={() => onSelectQuestion(item.index)}
              title={`Question ${item.questionNumber}: ${item.state}`}
              className={`h-7 w-full rounded-md border text-[11px] font-bold flex items-center justify-center transition-all ${getStateStyle(
                item.state,
                item.isActive
              )}`}
            >
              {item.questionNumber}
              {item.state === "ANSWERED_AND_MARKED_FOR_REVIEW" && (
                <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-emerald-300 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
