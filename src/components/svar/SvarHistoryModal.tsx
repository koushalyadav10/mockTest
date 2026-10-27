"use client";

import React, { useState, useEffect } from "react";
import { History, Award, Trash2, X, ChevronRight, Sparkles } from "lucide-react";
import { ScoringEngine, SvarEvaluationResult } from "@/lib/svar/scoringEngine";

interface SvarHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAttempt: (report: SvarEvaluationResult) => void;
}

export const SvarHistoryModal: React.FC<SvarHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectAttempt,
}) => {
  const [history, setHistory] = useState<SvarEvaluationResult[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(ScoringEngine.getHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm("Are you sure you want to delete all past assessment records?")) {
      ScoringEngine.clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 text-slate-100 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-5 pr-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Past Practice Attempts</h2>
              <p className="text-xs text-slate-400">Review your historical scores, speaking pace, and CEFR progress</p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No previous attempts recorded</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Complete your first SVAR or Accenture mock assessment to unlock diagnostic score history and track your improvement.
              </p>
            </div>
          ) : (
            history.map((att) => (
              <div
                key={att.attemptId}
                onClick={() => {
                  onSelectAttempt(att);
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-900 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-bold"
                    style={{ borderColor: att.ratingColor }}
                  >
                    <span className="text-base" style={{ color: att.ratingColor }}>
                      {att.totalScore}
                    </span>
                    <span className="text-[9px] text-slate-400 -mt-1">/100</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">
                        {att.cefrLevel}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                        {att.mode === "accenture_versant" ? "Accenture Versant" : "SVAR Corporate"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{att.formattedDate}</span>
                      <span>•</span>
                      <span>⚡ {att.avgWpm} WPM</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Sparkles className="w-3 h-3" />
                        Accenture Readiness: {att.accentureReadiness?.probabilityPercent ?? 80}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition">
                  <span>View Scorecard</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
