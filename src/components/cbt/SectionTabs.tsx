"use client";

import React from "react";
import { Lock, CheckCircle2, ChevronRight } from "lucide-react";

export interface SectionTabItem {
  id: string;
  name: string;
  questionCount: number;
  answeredCount?: number;
  isLocked?: boolean;
}

interface SectionTabsProps {
  sections: SectionTabItem[];
  activeSectionIndex: number;
  onSelectSection: (index: number) => void;
  allowSwitching?: boolean;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  sections,
  activeSectionIndex,
  onSelectSection,
  allowSwitching = true,
}) => {
  return (
    <div className="bg-[#f1f4f8] border-b border-slate-200/90 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto select-none no-scrollbar">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline shrink-0">
          Sections:
        </span>
        {sections.map((section, idx) => {
          const isActive = activeSectionIndex === idx;
          const isLocked = section.isLocked || (!allowSwitching && !isActive);

          return (
            <button
              key={section.id || idx}
              disabled={isLocked && !isActive}
              onClick={() => onSelectSection(idx)}
              className={`group flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shadow-xs ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                  : isLocked
                  ? "bg-slate-200/70 text-slate-400 border border-transparent cursor-not-allowed"
                  : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200/80"
              }`}
            >
              {isLocked && !isActive ? (
                <Lock className="w-3 h-3 text-slate-400" />
              ) : (
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    isActive ? "bg-white animate-pulse" : "bg-slate-300 group-hover:bg-blue-400"
                  }`}
                />
              )}
              <span>{section.name}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                  isActive
                    ? "bg-blue-700/80 text-white"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {section.questionCount} Qs
              </span>
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center text-[11px] text-slate-500 font-medium">
        <span>Click tab to jump to section</span>
      </div>
    </div>
  );
};
