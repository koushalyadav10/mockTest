"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function AppSplashScreen() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash screen on first visit of the session or fresh launch
    if (typeof window !== "undefined") {
      const shown = sessionStorage.getItem("app_splash_shown");
      if (!shown) {
        setVisible(true);
        sessionStorage.setItem("app_splash_shown", "true");

        const fadeTimer = setTimeout(() => {
          setFading(true);
        }, 1500);

        const removeTimer = setTimeout(() => {
          setVisible(false);
        }, 2100);

        return () => {
          clearTimeout(fadeTimer);
          clearTimeout(removeTimer);
        };
      }
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#020617] text-white transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Soft Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      <div className="absolute w-56 h-56 rounded-full bg-pink-500/15 blur-2xl pointer-events-none" />

      {/* Main Center Animated Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 animate-in zoom-in-95 duration-500">
        {/* Adorable Study Character Image with Ring and Pulse */}
        <div className="relative mb-6">
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-400 to-indigo-400 blur-sm opacity-70 animate-pulse" />
          <img
            src="/app-icon.png"
            alt="StudyBae"
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover shadow-2xl ring-4 ring-white/30"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 p-1.5 rounded-full shadow-lg border-2 border-white">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Dynamic App Title */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
          <span>StudyBae</span>
          <span className="text-pink-400">♥</span>
        </h1>

        {/* Motto from Image: Mock Tests • Real Progress • Together */}
        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-purple-200/90 tracking-wide">
          <span>Mock Tests</span>
          <span className="text-pink-400">♥</span>
          <span>Real Progress</span>
          <span className="text-pink-400">♥</span>
          <span>Together</span>
        </div>

        <p className="mt-1 text-[11px] text-slate-400 max-w-xs">
          Smart CBT Exam &amp; Mock Practice Platform
        </p>

        {/* Animated Loading Bar */}
        <div className="w-44 h-1.5 bg-white/10 rounded-full mt-7 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full animate-[progress_1.6s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
