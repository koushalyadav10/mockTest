"use client";

import React, { useState, useEffect } from "react";
import { Maximize2, Minimize2, CheckCircle2, RefreshCw, WifiOff, ShieldCheck } from "lucide-react";
import { ExamTimer } from "./ExamTimer";
import { formatCleanChapterTitle } from "@/lib/exam/tag-parser";

interface ExamHeaderProps {
  examTitle: string;
  activeSectionName: string;
  remainingSeconds: number;
  syncStatus: "SAVED" | "SYNCING" | "OFFLINE";
  candidateName?: string;
  candidateRollNumber?: string;
  onTimerExpire: () => void;
  timerKey?: string;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  examTitle,
  activeSectionName,
  remainingSeconds,
  syncStatus,
  candidateName = "Aditya Sharma",
  candidateRollNumber = "SSC2026-CHSL-88491",
  onTimerExpire,
  timerKey,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenAlert, setFullscreenAlert] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active && isFullscreen) {
        // User exited fullscreen during test
        setFullscreenAlert(true);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
      setFullscreenAlert(false);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <header className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none shadow-md z-30">
        {/* Left: Exam and Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold tracking-tight text-white text-base sm:text-lg">
              {formatCleanChapterTitle(examTitle)}
            </span>
          </div>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded font-medium hidden md:inline">
            Section: {activeSectionName}
          </span>
        </div>

        {/* Center: Realtime Auto-Save Status */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
          {syncStatus === "SAVED" && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Responses saved</span>
            </>
          )}
          {syncStatus === "SYNCING" && (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              <span className="text-slate-300">Syncing responses...</span>
            </>
          )}
          {syncStatus === "OFFLINE" && (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300">Offline — cached locally</span>
            </>
          )}
        </div>

        {/* Right: Timer, Fullscreen & Candidate Details */}
        <div className="flex items-center gap-3">
          <ExamTimer
            initialRemainingSeconds={remainingSeconds}
            onExpire={onTimerExpire}
            timerKey={timerKey}
          />

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Examination Mode"}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Stu. ID :</span>
            <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {candidateRollNumber.replace("SSC2026-CHSL-", "").replace("EF-", "")}
            </span>
          </div>
        </div>
      </header>

      {/* Fullscreen Exit Warning Alert */}
      {fullscreenAlert && (
        <div className="bg-amber-900/90 text-amber-100 px-4 py-2 text-xs flex items-center justify-between border-b border-amber-700 animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>
              <strong>Notice:</strong> You exited full-screen mode. For an authentic exam experience and to prevent distractions, please return to full-screen mode.
            </span>
          </div>
          <button
            onClick={() => {
              toggleFullscreen();
              setFullscreenAlert(false);
            }}
            className="bg-amber-800 hover:bg-amber-700 text-white font-semibold px-3 py-1 rounded text-xs transition-colors"
          >
            Re-enter Full Screen
          </button>
        </div>
      )}
    </>
  );
};
