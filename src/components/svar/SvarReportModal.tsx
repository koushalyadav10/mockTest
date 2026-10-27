"use client";

import React, { useState } from "react";
import {
  Award,
  Printer,
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Play,
  Sparkles,
  Clock,
  Gauge,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SvarEvaluationResult } from "@/lib/svar/scoringEngine";

interface SvarReportModalProps {
  isOpen: boolean;
  report: SvarEvaluationResult | null;
  candidateName?: string;
  onRetake: () => void;
  onClose: () => void;
}

export const SvarReportModal: React.FC<SvarReportModalProps> = ({
  isOpen,
  report,
  candidateName = "Candidate",
  onRetake,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"summary" | "questions" | "study_plan">("summary");
  const [expandedQId, setExpandedQId] = useState<string | null>(null);
  const [activePlayingAudio, setActivePlayingAudio] = useState<string | null>(null);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handlePlayVoice = (audioUrl?: string | null, qId?: string) => {
    if (!audioUrl) return;
    if (activePlayingAudio === qId) {
      setActivePlayingAudio(null);
      return;
    }
    const audio = new Audio(audioUrl);
    setActivePlayingAudio(qId || "current");
    audio.play();
    audio.onended = () => setActivePlayingAudio(null);
    audio.onerror = () => setActivePlayingAudio(null);
  };

  const mins = Math.floor(report.timeTakenSeconds / 60);
  const secs = report.timeTakenSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">SVAR &amp; Accenture Assessment Scorecard</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {report.mode === "accenture_versant" ? "Accenture Versant Mode" : "SVAR Corporate Standard"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Candidate: <strong className="text-slate-200">{candidateName}</strong> • {report.formattedDate} • Corporate Spoken Benchmark
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab("summary")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === "summary"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            📊 Score Summary &amp; Diagnosis
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === "questions"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            📝 Question-by-Question Review ({report.questionResults.length})
          </button>
          <button
            onClick={() => setActiveTab("study_plan")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === "study_plan"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            🎯 14-Day Accenture Study Plan
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "summary" && (
            <>
              {/* Scorecard Hero Banner */}
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 p-6 flex flex-col md:flex-row items-center gap-6">
                <div
                  className="w-28 h-28 shrink-0 rounded-full border-4 flex flex-col items-center justify-center shadow-xl shadow-indigo-950/50"
                  style={{ borderColor: report.ratingColor }}
                >
                  <span className="text-3xl font-black" style={{ color: report.ratingColor }}>
                    {report.totalScore}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
                    OUT OF 100
                  </span>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 border" style={{ borderColor: report.ratingColor, color: report.ratingColor }}>
                    CEFR Proficiency: {report.cefrLevel}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Overall Spoken English: {report.totalScore >= 70 ? "Corporate Ready (Pass)" : report.totalScore >= 55 ? "Developing Competence" : "Requires Focused Training"}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    {report.cefrDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      Time Taken: <strong>{mins}m {secs}s</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                      Pace: <strong>{report.avgWpm} WPM</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Accuracy: <strong>{report.avgAccuracy}%</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Fillers (&quot;um/uh&quot;): <strong>{report.totalFillers}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Accenture Readiness Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Accenture Communication Round Readiness</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${report.accentureReadiness.badgeBg}`}>
                    {report.accentureReadiness.verdict} ({report.accentureReadiness.probabilityPercent}% Probability)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {report.accentureReadiness.passLikelihood}
                </p>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${report.accentureReadiness.probabilityPercent}%`,
                      backgroundColor: report.accentureReadiness.color,
                    }}
                  />
                </div>
              </div>

              {/* Section-wise Progress Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Section Diagnostic Breakdown (100 Points Total)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(report.sectionScores).map(([secId, sec]) => (
                    <div key={secId} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-200">{sec.title}</span>
                        <span className="font-bold font-mono text-indigo-400">
                          {sec.score} / {sec.max} pts ({sec.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${sec.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Diagnostic Insights & Recommendations */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  AI Evaluator Recommendations &amp; Strategic Hacks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase">Strongest Competency</span>
                    <p className="text-xs font-semibold text-white mt-0.5">{report.strongestSkill}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <span className="text-[11px] font-bold text-rose-400 uppercase">Primary Growth Area</span>
                    <p className="text-xs font-semibold text-white mt-0.5">{report.weakestSkill}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {report.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "questions" && (
            <div className="space-y-3">
              {report.questionResults.map((q) => {
                const isExpanded = expandedQId === q.id;
                const hasVoiceAudio = !!q.userAnswer.audioUrl;
                const wordDiffs = q.userAnswer.wordDiffs || [];

                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition"
                  >
                    <div
                      onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            q.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {q.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-white">Q{q.globalIndex}</span>
                            <span className="text-[11px] text-indigo-400 font-semibold">{q.sectionTitle}</span>
                            <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.2 rounded bg-slate-800">
                              {q.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 line-clamp-1 max-w-xl">
                            {q.prompt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-bold text-slate-200">
                          {q.score} / {q.maxScore} pts
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3 text-xs">
                        {/* Audio / Prompt details */}
                        {q.audioScript && (
                          <div>
                            <span className="text-[11px] font-bold uppercase text-slate-400">Audio Script (What was played):</span>
                            <p className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 mt-1 italic">
                              &quot;{q.audioScript}&quot;
                            </p>
                          </div>
                        )}

                        {q.targetText && (
                          <div>
                            <span className="text-[11px] font-bold uppercase text-slate-400">Expected Response / Target Text:</span>
                            <p className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 mt-1">
                              {q.targetText}
                            </p>
                          </div>
                        )}

                        {/* Spoken candidate transcript */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold uppercase text-slate-400">What You Spoke (Candidate Transcript):</span>
                            {hasVoiceAudio && (
                              <button
                                onClick={() => handlePlayVoice(q.userAnswer.audioUrl, q.id)}
                                className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
                              >
                                <Play className="w-3 h-3" />
                                {activePlayingAudio === q.id ? "Playing Voice..." : "Replay Your Recording"}
                              </button>
                            )}
                          </div>
                          <p className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 font-mono">
                            {q.userAnswer.transcript || "(No speech recorded)"}
                          </p>
                        </div>

                        {/* Word Alignment Diff */}
                        {wordDiffs.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold uppercase text-slate-400 mb-1.5 block">
                              Pronunciation Alignment:
                            </span>
                            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                              {wordDiffs.map((diff, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                    diff.status === "matched"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : diff.status === "missing"
                                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 line-through"
                                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  }`}
                                >
                                  {diff.word}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Evaluator Feedback */}
                        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200">
                          <span className="font-bold flex items-center gap-1.5 mb-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            AI Evaluator Feedback:
                          </span>
                          <p>{q.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "study_plan" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs text-indigo-200">
                <span className="font-bold text-white block text-sm mb-1">
                  Accenture Communication Test 14-Day Preparation Blueprint
                </span>
                Follow this day-by-day structured routine to build speech momentum, eliminate filler words, and clear the automated Versant AI cut-off with confidence.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.studyPlan.map((day) => (
                  <div key={day.day} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-600 text-white">
                        DAY {day.day}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{day.durationMinutes} Mins Daily</span>
                    </div>
                    <h5 className="text-xs font-bold text-white mb-2">{day.focus}</h5>
                    <ul className="space-y-1">
                      {day.drills.map((drill, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Results automatically synced to your ExamForge AI student profile.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onRetake();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Assessment
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
