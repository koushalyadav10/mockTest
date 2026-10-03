"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  PlayCircle,
  FileCheck2,
  Clock,
  Sparkles,
  Shuffle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/Button";

interface OneClickMockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneClickMockModal: React.FC<OneClickMockModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [examConfigs, setExamConfigs] = useState<any[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/exams")
        .then((res) => res.json())
        .then((data) => {
          const list = data.exams || data.configs || [];
          if (list.length > 0) {
            setExamConfigs(list);
            setSelectedConfigId(list[0].id);
          }
        })
        .catch((e) => console.error("Failed to load configs", e));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLaunchMock = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examConfigId: selectedConfigId || undefined,
          mode: "MOCK",
          questionCountLimit: questionCount,
        }),
      });

      const data = await res.json();
      if (data.success && data.testAttemptId) {
        router.push(`/mock/${data.testAttemptId}`);
      } else {
        alert(data.error || "Failed to create mock test.");
      }
    } catch (e: any) {
      alert("Error starting mock test: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedConfig = examConfigs.find((c) => c.id === selectedConfigId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">One-Click Mock Generator</h3>
              <p className="text-xs text-slate-400">
                Instant authentic CBT session from Question Bank
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Target Exam Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Target SSC Examination
            </label>
            <select
              value={selectedConfigId}
              onChange={(e) => setSelectedConfigId(e.target.value)}
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              {examConfigs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.code}) - {c.totalDurationMinutes} mins
                </option>
              ))}
            </select>
          </div>

          {/* Question Count Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Test Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    questionCount === count
                      ? "bg-blue-50 border-blue-600 text-blue-700 font-bold ring-1 ring-blue-600"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-base font-mono">{count} Qs</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {count === 25 ? "Sprint (15m)" : count === 50 ? "Half Mock (30m)" : "Full Exam (60m)"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Exam Engine Features */}
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Engine Verification Parameters
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Marking Scheme:</span>
              <span className="font-mono font-bold text-slate-800">
                +{selectedConfig?.marksPerCorrect || 2.0} / -{selectedConfig?.negativeMarks || 0.5} negative
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Authoritative Server Timer:</span>
              <span className="font-mono font-bold text-slate-800">
                Active &bull; Resumes across reloads
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Option Scrambling:</span>
              <span className="font-mono font-bold text-slate-800">
                Safe stableId preservation
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleLaunchMock}
            disabled={loading}
            className="shadow-xs font-bold"
          >
            {loading ? "Initializing CBT Engine..." : "Launch CBT Mock Exam"}
          </Button>
        </div>
      </div>
    </div>
  );
};
