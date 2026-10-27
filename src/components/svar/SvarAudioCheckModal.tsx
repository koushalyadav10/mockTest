"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, Mic, CheckCircle2, AlertCircle, X, Play, Square } from "lucide-react";
import { speechService } from "@/lib/svar/speechService";

interface SvarAudioCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SvarAudioCheckModal: React.FC<SvarAudioCheckModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [speakerTested, setSpeakerTested] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [micStatus, setMicStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [audioLevel, setAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const testRef = useRef<{ stream: MediaStream; stopTest: () => void } | null>(null);

  useEffect(() => {
    return () => {
      if (testRef.current) {
        testRef.current.stopTest();
      }
      speechService.stopListeningAudio();
    };
  }, []);

  if (!isOpen) return null;

  const handleTestSpeaker = () => {
    setIsPlayingSample(true);
    speechService.playListeningScript(
      "Audio check successful. Welcome to the Accenture and SVAR Spoken English Assessment platform.",
      {
        accent: "American English",
        onStart: () => setIsPlayingSample(true),
        onEnd: () => {
          setIsPlayingSample(false);
          setSpeakerTested(true);
        },
      }
    );
  };

  const handleStartMicTest = async () => {
    setMicStatus("testing");
    setErrorMessage("");
    try {
      const res = await speechService.testMicrophone((level) => {
        setAudioLevel(level);
        if (level > 20) {
          setMicStatus("success");
        }
      });
      testRef.current = res;
    } catch (err: any) {
      console.error(err);
      setMicStatus("error");
      setErrorMessage(
        err.name === "NotAllowedError"
          ? "Microphone access was denied. Please allow microphone permissions in your browser URL bar to proceed."
          : "Microphone hardware was not detected. Please verify your headset or mic connection."
      );
    }
  };

  const handleStopMicTest = () => {
    if (testRef.current) {
      testRef.current.stopTest();
      testRef.current = null;
    }
    setAudioLevel(0);
  };

  const canProceed = speakerTested && (micStatus === "success" || audioLevel > 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 text-slate-100 relative">
        <button
          onClick={() => {
            handleStopMicTest();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Hardware &amp; Audio Diagnostic</h2>
            <p className="text-xs text-slate-400">Verify your speaker clarity and microphone level before testing</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Step 1: Speaker Check */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                1. Speaker / Headphone Check
              </span>
              {speakerTested && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Working
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Click the button below to play a synthesized voice sample. Ensure your volume is comfortable.
            </p>
            <button
              onClick={handleTestSpeaker}
              disabled={isPlayingSample}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                isPlayingSample
                  ? "bg-indigo-600/50 text-indigo-200 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
              }`}
            >
              {isPlayingSample ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" /> Playing Audio...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Play Audio Sample
                </>
              )}
            </button>
          </div>

          {/* Step 2: Microphone Check */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                2. Microphone &amp; Speech Input
              </span>
              {micStatus === "success" && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Click Start Test and speak into your mic (e.g. &quot;Testing one two three&quot;). Check the VU meter level.
            </p>

            {/* VU Meter */}
            <div className="mb-3">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Input Signal Level:</span>
                <span className="font-mono font-bold text-indigo-400">{audioLevel}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-75 ${
                    audioLevel > 60
                      ? "bg-emerald-500"
                      : audioLevel > 20
                      ? "bg-indigo-500"
                      : "bg-slate-600"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, audioLevel))}%` }}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="mb-3 flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {micStatus !== "testing" ? (
                <button
                  onClick={handleStartMicTest}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition"
                >
                  <Mic className="w-4 h-4" /> Start Microphone Test
                </button>
              ) : (
                <button
                  onClick={handleStopMicTest}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition"
                >
                  <Square className="w-4 h-4" /> Stop Test
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            {canProceed
              ? "All hardware checks passed."
              : "Complete both audio checks to proceed."}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleStopMicTest();
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleStopMicTest();
                if (onSuccess) onSuccess();
                onClose();
              }}
              disabled={!canProceed}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition shadow-lg ${
                canProceed
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              Confirm &amp; Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
