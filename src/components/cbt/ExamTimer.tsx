"use client";

import React, { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { formatSecondsToHHMMSS } from "@/lib/exam/timer";

interface ExamTimerProps {
  initialRemainingSeconds: number;
  onExpire?: () => void;
  isPaused?: boolean;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  initialRemainingSeconds,
  onExpire,
  isPaused = false,
}) => {
  const [seconds, setSeconds] = useState<number>(initialRemainingSeconds);

  useEffect(() => {
    setSeconds(initialRemainingSeconds);
  }, [initialRemainingSeconds]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onExpire]);

  const isLowTime = seconds <= 300 && seconds > 0; // <= 5 mins

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded border font-mono text-sm tracking-wider font-semibold select-none transition-colors ${
        isLowTime
          ? "bg-red-950/40 text-red-400 border-red-800 animate-pulse"
          : "bg-slate-800/80 text-white border-slate-700"
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4 text-red-400" />
      ) : (
        <Clock className="w-4 h-4 text-slate-400" />
      )}
      <span className="text-xs uppercase tracking-normal text-slate-400 font-sans mr-0.5">
        Time Left:
      </span>
      <span className="tabular-nums text-base">{formatSecondsToHHMMSS(seconds)}</span>
    </div>
  );
};
