"use client";

import React from "react";
import { Heart, Sparkles, Trophy, Coffee, ArrowRight, Star, Smile, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface SumanResultMotivationCardProps {
  candidateName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  accuracy: number;
}

export const SumanResultMotivationCard: React.FC<SumanResultMotivationCardProps> = ({
  candidateName,
  score,
  totalMarks,
  percentage,
  accuracy,
}) => {
  const isHigh = percentage >= 70;
  const isMid = percentage >= 45 && percentage < 70;

  return (
    <div
      className={`rounded-3xl p-5 sm:p-7 border-2 shadow-sm transition-all relative overflow-hidden ${
        isHigh
          ? "bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 border-pink-300"
          : isMid
          ? "bg-gradient-to-br from-pink-50/90 via-purple-50/80 to-blue-50/80 border-purple-200"
          : "bg-gradient-to-br from-amber-50/90 via-rose-50/80 to-pink-50/80 border-rose-200"
      }`}
    >
      {/* Decorative ambient backdrop */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>A Personal Message for Suman</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200 text-[11px] font-bold shadow-2xs">
              {isHigh ? "🌟 Outstanding Performance" : isMid ? "🌸 Strong Consistent Effort" : "🌿 Practice & Resilience"}
            </span>
          </div>

          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <span>Accuracy:</span>
            <span className="font-mono font-black text-rose-600">{accuracy}%</span>
          </span>
        </div>

        {/* Dynamic Loving Message */}
        {/* Dynamic Loving Message + Suman's Custom Avatar */}
        <div className="flex items-start gap-3.5 sm:gap-4 pt-1">
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 shadow-md">
              <img
                src="/avatars/suman.jpg"
                alt="Suman"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] shadow-xs border-2 border-white">
              ⭐
            </span>
          </div>

          <div className="space-y-1.5 flex-1">
            {isHigh ? (
              <>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>WOW, Sunshine! Look at that score!</span>
                  <span className="text-xl">🎉✨</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  You totally nailed this test! Your hard work, sharp focus, and persistence are paying off so beautifully.
                  Treat yourself to something sweet today, you earned every single mark! I am so unbelievably proud of you! ❤️👑
                </p>
              </>
            ) : isMid ? (
              <>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>So proud of your hard work, Suman!</span>
                  <span className="text-xl">🌸💪</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  You gave this your honest effort, and that is what builds a true topper! Every question you missed today is
                  one less mistake in the real exam. Take a look at the solutions below, keep your head high, and remember
                  you are growing with every single test. You've got this! 💕
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Hey my girl, take a deep breath!</span>
                  <span className="text-xl">🌿🤗</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  Tough papers are meant to train us, not judge us! This test just showed us where we can easily gain extra marks.
                  Drink a glass of cold water, take a small 10-minute break, and smile. You have so much potential, and I am
                  always right here cheering for you! 💖✨
                </p>
              </>
            )}
          </div>
        </div>

        {/* Loving Action Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-200/90 text-xs text-slate-700 font-semibold">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Tip: Take a gentle 5-minute break before going through the question solutions below.</span>
          </div>

          <Link href="/dashboard">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Back to Study Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
