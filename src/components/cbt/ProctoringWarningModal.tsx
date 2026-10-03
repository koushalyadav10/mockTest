"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

interface ProctoringWarningModalProps {
  isOpen: boolean;
  violationCount: number;
  maxViolations?: number;
  warningDurationSeconds?: number;
  onResumeTest: () => void;
  onAutoSubmit?: () => void;
}

export const ProctoringWarningModal: React.FC<ProctoringWarningModalProps> = ({
  isOpen,
  violationCount,
  maxViolations = 3,
  warningDurationSeconds = 10,
  onResumeTest,
  onAutoSubmit,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(warningDurationSeconds);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(warningDurationSeconds);
      return;
    }

    setSecondsRemaining(warningDurationSeconds);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (violationCount >= maxViolations && onAutoSubmit) {
            onAutoSubmit();
          } else {
            onResumeTest();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, warningDurationSeconds, violationCount, maxViolations, onResumeTest, onAutoSubmit]);

  if (!isOpen) return null;

  const isCritical = violationCount >= maxViolations;

  return (
    <div className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Exact UI from Reference Screenshot 5 */}
      <div className="text-center space-y-4 max-w-lg text-white font-serif">
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-white font-serif uppercase">
            FOCUS WARNING
          </h2>
          <div className="text-xs sm:text-sm font-sans text-slate-300 font-semibold">
            Violations: {violationCount}
          </div>
        </div>

        <p className="text-base sm:text-lg text-slate-200 font-serif leading-relaxed">
          Focus gained, wait {warningDurationSeconds} seconds to resume test
        </p>

        <div className="text-xl sm:text-2xl font-serif text-white pt-2">
          Please wait{" "}
          <span className="text-red-500 font-extrabold font-mono text-3xl mx-1 animate-pulse">
            {secondsRemaining}
          </span>{" "}
          seconds...
        </div>

        {isCritical && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/80 border border-red-700 text-xs text-red-200 font-sans font-semibold">
            Maximum violations reached ({violationCount}/{maxViolations}). The examination test session will now be finalized and auto-submitted.
          </div>
        )}

        <div className="pt-4 text-[11px] font-sans text-slate-400">
          Interaction is temporarily locked. Maintain test window focus to prevent further penalties.
        </div>
      </div>
    </div>
  );
};
