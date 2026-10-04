"use client";

import React, { useEffect, useState, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { formatSecondsToHHMMSS } from "@/lib/exam/timer";

interface ExamTimerProps {
  initialRemainingSeconds: number;
  onExpire?: () => void;
  isPaused?: boolean;
  timerKey?: string;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  initialRemainingSeconds,
  onExpire,
  isPaused = false,
  timerKey = "active_cbt_session",
}) => {
  const [seconds, setSeconds] = useState<number>(Math.max(0, initialRemainingSeconds));
  const targetEndTimeRef = useRef<number>(0);
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Synchronize target expiration timestamp and save to sessionStorage for resilience
  useEffect(() => {
    if (initialRemainingSeconds <= 0) return;

    const storageKey = `cbt_exam_end_timestamp_${timerKey}`;
    let endTimestamp: number | null = null;

    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        // Only use stored timestamp if valid and within expected reasonable bounds
        if (!isNaN(parsed) && parsed > Date.now()) {
          endTimestamp = parsed;
        }
      }
    }

    if (!endTimestamp) {
      endTimestamp = Date.now() + initialRemainingSeconds * 1000;
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(storageKey, endTimestamp.toString());
        } catch (e) {}
      }
    }

    targetEndTimeRef.current = endTimestamp;
    const remaining = Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000));
    setSeconds(remaining);
    hasExpiredRef.current = false;
    isInitializedRef.current = true;
  }, [initialRemainingSeconds, timerKey]);

  // High-precision non-drifting timer with Background Web Worker
  useEffect(() => {
    if (isPaused) return;

    const tick = () => {
      if (targetEndTimeRef.current <= 0) return;
      const now = Date.now();
      const diffMs = targetEndTimeRef.current - now;
      const remaining = Math.max(0, Math.ceil(diffMs / 1000));
      setSeconds(remaining);

      if (remaining <= 0) {
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          if (onExpireRef.current) {
            onExpireRef.current();
          }
        }
      }
    };

    // Immediate tick
    tick();

    // 1. Background Web Worker: Completely immune to tab backgrounding / browser throttling
    let worker: Worker | null = null;
    try {
      if (typeof window !== "undefined" && typeof Worker !== "undefined") {
        const workerBlob = new Blob(
          [
            `let timer = null;
            self.onmessage = function(e) {
              if (e.data === 'START') {
                if (timer) clearInterval(timer);
                timer = setInterval(function() {
                  self.postMessage('TICK');
                }, 300);
              } else if (e.data === 'STOP') {
                if (timer) clearInterval(timer);
                timer = null;
              }
            };`,
          ],
          { type: "application/javascript" }
        );
        const workerUrl = URL.createObjectURL(workerBlob);
        worker = new Worker(workerUrl);
        worker.onmessage = () => {
          tick();
        };
        worker.postMessage("START");
        URL.revokeObjectURL(workerUrl);
      }
    } catch (workerErr) {
      console.warn("Web worker fallback for timer:", workerErr);
    }

    // 2. Main thread high-frequency interval fallback
    const interval = setInterval(tick, 250);

    // 3. Instant synchronization on window focus, blur, visibility change, and page show
    const handleSync = () => {
      tick();
    };

    window.addEventListener("focus", handleSync);
    window.addEventListener("blur", handleSync);
    window.addEventListener("pageshow", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    return () => {
      clearInterval(interval);
      if (worker) {
        try {
          worker.postMessage("STOP");
          worker.terminate();
        } catch (e) {}
      }
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("blur", handleSync);
      window.removeEventListener("pageshow", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, [isPaused]);

  const isLowTime = seconds <= 300 && seconds > 0; // <= 5 mins

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm tracking-wider font-semibold select-none transition-all shadow-2xs ${
        isLowTime
          ? "bg-red-950/60 text-red-300 border-red-700/80 animate-pulse"
          : "bg-slate-800/90 text-white border-slate-700/80"
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
      ) : (
        <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
      )}
      <span className="text-xs uppercase tracking-normal text-slate-300 font-sans font-medium mr-0.5">
        TIME LEFT:
      </span>
      <span className="tabular-nums text-base font-bold text-white tracking-widest">
        {formatSecondsToHHMMSS(seconds)}
      </span>
    </div>
  );
};
