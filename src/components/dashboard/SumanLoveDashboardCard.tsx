"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Heart,
  Sparkles,
  Flame,
  Trophy,
  Target,
  Coffee,
  Star,
  CheckCircle2,
  Smile,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Clock,
  Shuffle,
} from "lucide-react";
import Link from "next/link";
import { SUMAN_THEMES, SumanTheme, getDefaultSumanTheme } from "@/lib/suman-corner-themes";

interface SumanLoveDashboardCardProps {
  user: any;
  stats: {
    testsAttempted: number;
    averageScore: number;
    accuracy: number;
    bestScore: number;
  };
}

export const SumanLoveDashboardCard: React.FC<SumanLoveDashboardCardProps> = ({ user, stats }) => {
  const [activeData, setActiveData] = useState<{
    theme: SumanTheme;
    mode: "AUTO" | "PINNED";
    customTitle: string | null;
    customMessage: string | null;
    timeSlot: string;
  }>(() => {
    const fallbackTheme = getDefaultSumanTheme(0);
    return {
      theme: fallbackTheme,
      mode: "AUTO",
      customTitle: null,
      customMessage: null,
      timeSlot: "Daily Love & Motivation",
    };
  });

  const [cycleOffset, setCycleOffset] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch server configuration
  useEffect(() => {
    fetch(`/api/user/suman-corner?offset=${cycleOffset}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.activeTheme) {
          setActiveData({
            theme: data.activeTheme,
            mode: data.mode,
            customTitle: data.customTitle,
            customMessage: data.customMessage,
            timeSlot: data.timeSlot,
          });
        }
      })
      .catch(() => {});
  }, [cycleOffset]);

  const theme = activeData.theme;
  const testsCount = stats.testsAttempted || 0;

  // Milestone levels
  const currentLevel = useMemo(() => {
    if (testsCount >= 10)
      return { title: "UP PET Topper 🏆", next: "Master of All Subjects", target: 15, current: testsCount };
    if (testsCount >= 5)
      return { title: "Consistency Queen 👑", next: "UP PET Topper (10 Tests)", target: 10, current: testsCount };
    if (testsCount >= 2)
      return { title: "Dedicated Achiever 🌸", next: "Consistency Queen (5 Tests)", target: 5, current: testsCount };
    return { title: "Curious Learner 🌱", next: "Dedicated Achiever (2 Tests)", target: 2, current: testsCount };
  }, [testsCount]);

  const progressPercent = Math.min(100, Math.round((currentLevel.current / currentLevel.target) * 100));

  const handleNextTheme = () => {
    setIsRefreshing(true);
    setCycleOffset((prev) => (prev + 1) % SUMAN_THEMES.length);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden ${theme.gradientBg} ${theme.borderClass} p-5 sm:p-7 shadow-sm transition-all duration-300`}
    >
      {/* Decorative Ambient Background Glows */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${theme.glowColor1} rounded-full blur-3xl pointer-events-none`}
      />
      <div
        className={`absolute bottom-0 left-10 w-64 h-64 bg-gradient-to-tr ${theme.glowColor2} rounded-full blur-2xl pointer-events-none`}
      />

      <div className="relative z-10 space-y-5">
        {/* Top Header: Rotating Love Greeting & Tag + Suman's Custom Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-200/60 pb-4">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
            {/* Suman Avatar with Themed Overlay Badge */}
            <div className="relative shrink-0">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr ${theme.badgeBg} shadow-md`}
              >
                <img
                  src="/avatars/suman.jpg"
                  alt="Suman"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Theme Badge (e.g. 🐒 for Bandariya, 🥟 for Moti, ☀️ for Sunshine, 👑 for Queen) */}
              <span
                className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r ${theme.badgeBg} text-white flex items-center justify-center text-xs shadow-xs border-2 border-white select-none`}
                title={theme.name}
              >
                {theme.avatarBadge.slice(0, 2)}
              </span>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.pillGradient} text-white text-xs font-black uppercase tracking-wider shadow-xs`}
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Special Corner for Suman</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200 text-[11px] font-bold shadow-2xs">
                  {theme.tag}
                </span>

                {activeData.mode === "PINNED" ? (
                  <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-300 text-[10px] font-black tracking-wide">
                    📌 Pinned by Admin
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{activeData.timeSlot}</span>
                  </span>
                )}
              </div>

              <h2 className={`text-xl sm:text-2xl font-black ${theme.titleColor} tracking-tight pt-0.5 flex items-center gap-2 flex-wrap`}>
                <span>{activeData.customTitle || theme.title}</span>
                <span className="text-xl sm:text-2xl">{theme.emoji}</span>
              </h2>

              <p className={`text-xs sm:text-sm ${theme.textColor} leading-relaxed font-medium max-w-2xl`}>
                {activeData.customMessage || theme.message}
              </p>
            </div>
          </div>

          {/* Right Area: Study Streak + Surprise Me Shuffle Button */}
          <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto">
            {/* Shuffle / Surprise Me Button */}
            <button
              type="button"
              onClick={handleNextTheme}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 hover:text-pink-600 border border-slate-200 shadow-2xs text-xs font-bold transition-all flex items-center gap-1.5"
              title="Next cute note / change theme"
            >
              <Shuffle className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-pink-500" : ""}`} />
              <span className="hidden sm:inline">Surprise Note</span>
            </button>

            {/* Streak Indicator */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-pink-200 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4 fill-pink-500 text-pink-500 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Study Streak</span>
                <span className="text-xs font-black text-rose-950 font-mono">1 Day Active 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Her Study Journey Metrics Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Her Learning Journey &amp; Milestones</span>
            </span>
            <span className="text-[11px] font-bold text-rose-800 bg-white/90 border border-pink-200 px-2.5 py-0.5 rounded-full shadow-2xs">
              Current Rank: {currentLevel.title}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Stat 1: Tests Taken */}
            <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Tests Completed</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono text-slate-900">{testsCount}</span>
                <span className="text-[10px] text-pink-600 font-semibold">papers</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">✓ Every test counts!</span>
            </div>

            {/* Stat 2: Best Score */}
            <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Personal Best Score</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono text-rose-600">{stats.bestScore || "--"}</span>
                <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
              </div>
              <span className="text-[10px] text-rose-700 font-semibold block">🏆 New heights ahead</span>
            </div>

            {/* Stat 3: Accuracy */}
            <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Overall Accuracy</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono text-indigo-600">{stats.accuracy}%</span>
              </div>
              <span className="text-[10px] text-indigo-700 font-semibold block">🎯 Sharp precision</span>
            </div>

            {/* Stat 4: Next Milestone */}
            <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block">Next Milestone</span>
              <div className="text-xs font-black text-purple-900 truncate" title={currentLevel.next}>
                {currentLevel.next}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Note & Care Reminder */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-pink-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${theme.badgeBg} text-white flex items-center justify-center shrink-0 shadow-2xs text-base`}
            >
              <span>{theme.careIconEmoji}</span>
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>{theme.careReminderTitle}</span>
                <span className="text-pink-500 font-normal">❤️</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {theme.careReminderText}
              </p>
            </div>
          </div>

          <Link href="/exams?board=UPSSSC_PET">
            <button
              type="button"
              className={`w-full sm:w-auto px-4 py-2 rounded-xl ${theme.pillGradient} hover:opacity-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0`}
            >
              <span>Start UP PET Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
