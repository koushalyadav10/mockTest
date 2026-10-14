"use client";

import React, { useMemo } from "react";
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
} from "lucide-react";
import Link from "next/link";

interface SumanLoveDashboardCardProps {
  user: any;
  stats: {
    testsAttempted: number;
    averageScore: number;
    accuracy: number;
    bestScore: number;
  };
}

const ROTATING_GREETINGS = [
  {
    title: "Hey, Sunshine! ☀️",
    message: "Ready for today's challenge? You're doing amazing, one little step at a time! 💕",
    emoji: "🌸",
    tag: "Morning Sunshine",
  },
  {
    title: "Welcome back, Superstar! ✨",
    message: "Your dedication inspires me every single day. Trust your preparation and go crush it! 💫",
    emoji: "⭐",
    tag: "Daily Inspiration",
  },
  {
    title: "Your hard work is building something big! 🏛️",
    message: "Every question you solve today is a brick in your future success. I believe in you with all my heart! 💖",
    emoji: "💎",
    tag: "Belief & Power",
  },
  {
    title: "Good morning, Beautiful! 🌷",
    message: "Take a deep breath, keep that lovely smile, and let your genius do the magic today! ✨",
    emoji: "🌷",
    tag: "Calm & Confident",
  },
  {
    title: "Hey Champion! 🏆",
    message: "Consistency is your superpower. Give this session your best, and remember I'm always cheering for you! 🌟",
    emoji: "👑",
    tag: "Queen Energy",
  },
  {
    title: "Stay calm, stay bright! 🌿",
    message: "Mistakes are just stepping stones to mastery. Relax your shoulders and enjoy the learning journey! 💕",
    emoji: "🕊️",
    tag: "Gentle Reminder",
  },
  {
    title: "Proud of you, my girl! 💖",
    message: "Whatever today's score is, your effort makes you my number one hero. Let's do this! 🚀",
    emoji: "❤️",
    tag: "Always In Your Corner",
  },
];

export const SumanLoveDashboardCard: React.FC<SumanLoveDashboardCardProps> = ({ user, stats }) => {
  // Deterministic daily rotating greeting based on day of year
  const greeting = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = Math.abs(dayOfYear) % ROTATING_GREETINGS.length;
    return ROTATING_GREETINGS[index];
  }, []);

  const testsCount = stats.testsAttempted || 0;
  
  // Milestone levels
  const currentLevel = useMemo(() => {
    if (testsCount >= 10) return { title: "UP PET Topper 🏆", next: "Master of All Subjects", target: 15, current: testsCount };
    if (testsCount >= 5) return { title: "Consistency Queen 👑", next: "UP PET Topper (10 Tests)", target: 10, current: testsCount };
    if (testsCount >= 2) return { title: "Dedicated Achiever 🌸", next: "Consistency Queen (5 Tests)", target: 5, current: testsCount };
    return { title: "Curious Learner 🌱", next: "Dedicated Achiever (2 Tests)", target: 2, current: testsCount };
  }, [testsCount]);

  const progressPercent = Math.min(100, Math.round((currentLevel.current / currentLevel.target) * 100));

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50/95 via-pink-50/90 to-purple-50/90 border-2 border-pink-300/80 p-5 sm:p-7 shadow-sm transition-all">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-400/15 via-rose-300/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-gradient-to-tr from-amber-300/10 to-rose-300/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Top Header: Rotating Love Greeting & Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-200/70 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Special Corner for Suman</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200 text-[11px] font-bold shadow-2xs">
                {greeting.tag}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1 flex items-center gap-2">
              <span>{greeting.title}</span>
              <span className="text-xl">{greeting.emoji}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-2xl">
              {greeting.message}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-pink-200 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 fill-pink-500 text-pink-500 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Study Streak</span>
              <span className="text-xs font-black text-rose-950 font-mono">1 Day Active 🔥</span>
            </div>
          </div>
        </div>

        {/* Her Study Journey Metrics Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Her Learning Journey &amp; Milestones</span>
            </span>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full">
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

        {/* Pinned Note from Boyfriend / Study Partner */}
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-pink-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-100 to-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4 text-rose-500" />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>Friendly Care Reminder:</span>
                <span className="text-pink-500 font-normal">❤️</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take a sip of water, relax your eyes for 2 minutes after every paper, and trust the process. You are capable of amazing things!
              </p>
            </div>
          </div>

          <Link href="/exams?board=UPSSSC_PET">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
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
