"use client";

import React, { useState } from "react";
import { Settings, Sparkles, X, Check, Volume2, Shield, Clock } from "lucide-react";

export interface SvarTestConfig {
  mode: "accenture_versant" | "svar_corporate";
  difficulty: "Mixed" | "Easy" | "Medium" | "Hard";
  accent: "American English" | "British English" | "Indian English";
  durationMinutes: number;
}

interface SvarConfigModalProps {
  isOpen: boolean;
  currentConfig: SvarTestConfig;
  onClose: () => void;
  onApplyConfig: (config: SvarTestConfig) => void;
}

export const SvarConfigModal: React.FC<SvarConfigModalProps> = ({
  isOpen,
  currentConfig,
  onClose,
  onApplyConfig,
}) => {
  const [config, setConfig] = useState<SvarTestConfig>(currentConfig);

  if (!isOpen) return null;

  const handleSave = () => {
    onApplyConfig(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Assessment Configuration</h2>
            <p className="text-xs text-slate-400">
              Customize corporate assessment blueprint, AI accent, and duration
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Assessment Pattern &amp; Blueprint
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: "accenture_versant", durationMinutes: 25 })}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  config.mode === "accenture_versant"
                    ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Accenture Versant
                  </span>
                  {config.mode === "accenture_versant" && (
                    <span className="p-0.5 rounded-full bg-indigo-500 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 mb-2">
                  6 Sub-Sections (59 Qs)
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Exact pattern used in Accenture Communication Assessment: Reading, Repeat Sentences, Short Answers, Sentence Builds, Story Retelling, Open Speaking.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setConfig({ ...config, mode: "svar_corporate", durationMinutes: 20 })}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  config.mode === "svar_corporate"
                    ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-400" />
                    SVAR Corporate
                  </span>
                  {config.mode === "svar_corporate" && (
                    <span className="p-0.5 rounded-full bg-indigo-500 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 mb-2">
                  Balanced 30 Qs
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Classic corporate benchmark used by TCS, Infosys, and Capgemini: Pronunciation, Fluency, Listening MCQs, Grammar correction, Story &amp; Speech.
                </p>
              </button>
            </div>
          </div>

          {/* Difficulty Tier */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Difficulty Calibration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["Mixed", "Easy", "Medium", "Hard"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setConfig({ ...config, difficulty: tier })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    config.difficulty === tier
                      ? "border-indigo-500 bg-indigo-500/20 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              &quot;Mixed&quot; matches real proctored corporate assessments with adaptive difficulty scaling.
            </p>
          </div>

          {/* Listening Voice Accent */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Synthesized Audio Accent
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["American English", "British English", "Indian English"] as const).map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => setConfig({ ...config, accent: acc })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    config.accent === acc
                      ? "border-indigo-500 bg-indigo-500/20 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {acc.replace(" English", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Test Timer Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 20, 25, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setConfig({ ...config, durationMinutes: mins })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                    config.durationMinutes === mins
                      ? "border-indigo-500 bg-indigo-500/20 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {mins} Mins
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            Apply &amp; Restart Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
