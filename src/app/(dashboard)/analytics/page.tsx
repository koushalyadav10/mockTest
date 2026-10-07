"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, TrendingUp, Target, Clock, Award, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Performance Analytics &amp; Mastery
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical trends, attempt accuracy rates, and time allocation across mock exams
        </p>
      </div>

      {stats?.stats?.testsAttempted === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No Analytics Data Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Complete at least one CBT mock exam or practice session to build your personal mastery profile.
          </p>
          <div className="pt-2">
            <Link href="/exams">
              <Button variant="primary" size="md">
                Start a Mock Test
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Total Mock Exams</span>
              <span className="text-3xl font-bold font-mono text-slate-900">
                {stats?.stats?.testsAttempted || 0}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Questions Attempted</span>
              <span className="text-3xl font-bold font-mono text-blue-600">
                {stats?.stats?.questionsSolved || 0}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Average Accuracy</span>
              <span className="text-3xl font-bold font-mono text-emerald-600">
                {stats?.stats?.accuracy || 0}%
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Average Time / Question</span>
              <span className="text-3xl font-bold font-mono text-slate-800">
                {stats?.stats?.avgTimePerQuestion || 0}s
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
