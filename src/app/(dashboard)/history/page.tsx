"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { History, FileCheck2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HistoryPage() {
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.recentTests) setRecentTests(data.recentTests);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Examination Attempt History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review past mock tests, score trends, and answer keys
        </p>
      </div>

      {recentTests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No test history available</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            All your scheduled exams, submitted mock tests, and practice drills will be logged here with complete question-by-question solutions.
          </p>
          <div className="pt-2">
            <Link href="/exams">
              <Button variant="primary" size="md">
                Take a Mock Exam
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
          {recentTests.map((t) => {
            const isUnstarted = t.status === "NOT_STARTED";
            const isRunning = t.status === "RUNNING";
            const isHeld = Boolean(t.isHeld);
            const isEvaluated = t.status === "EVALUATED" && !isHeld;

            const dateStr = t.completedAt
              ? new Date(t.completedAt).toLocaleDateString()
              : t.startedAt
              ? new Date(t.startedAt).toLocaleDateString()
              : "Recently";

            return (
              <div
                key={t.id}
                className="p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      {t.mode}
                    </span>
                    {isUnstarted && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        ⏳ Scheduled / Not Started
                      </span>
                    )}
                    {isRunning && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        ⏱️ In Progress
                      </span>
                    )}
                    {isHeld && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        📋 Result on Hold
                      </span>
                    )}
                    {isEvaluated && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✅ Evaluated
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {isUnstarted ? (
                      <span>Admit Pass Issued &bull; Waiting for examination room schedule</span>
                    ) : isRunning ? (
                      <span>Started on {dateStr} &bull; Examination session currently active</span>
                    ) : isHeld ? (
                      <span>Submitted on {dateStr} &bull; Scorecard under faculty review</span>
                    ) : (
                      <span>
                        Attempted: {t.attempted}/{t.totalQuestions} questions &bull; Completed on {dateStr}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    {isUnstarted ? (
                      <>
                        <div className="text-base font-mono font-bold text-slate-400">
                          -- / {t.totalMarks}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">Pending Entry</div>
                      </>
                    ) : isRunning ? (
                      <>
                        <div className="text-base font-mono font-bold text-blue-600">
                          Ongoing
                        </div>
                        <div className="text-xs text-blue-500 font-medium">In Progress</div>
                      </>
                    ) : isHeld ? (
                      <>
                        <div className="text-base font-mono font-bold text-amber-600">
                          Score Locked
                        </div>
                        <div className="text-xs text-amber-600 font-medium">Pending Release</div>
                      </>
                    ) : (
                      <>
                        <div className="text-base font-mono font-bold text-slate-900">
                          {t.score} / {t.totalMarks}
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold font-mono">
                          {t.accuracy}% Accuracy
                        </div>
                      </>
                    )}
                  </div>

                  {isUnstarted ? (
                    <Link href={`/exams/${t.examConfigId || t.id}`}>
                      <Button variant="outline" size="sm" className="font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        Enter Room &rarr;
                      </Button>
                    </Link>
                  ) : isRunning ? (
                    <Link href={`/mock/${t.id}/test`}>
                      <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 font-bold">
                        Resume Exam &rarr;
                      </Button>
                    </Link>
                  ) : isHeld ? (
                    <Link href={`/mock/${t.id}/result`}>
                      <Button variant="outline" size="sm" className="font-semibold text-amber-800 border-amber-200 hover:bg-amber-50">
                        Check Status &rarr;
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/mock/${t.id}/result`}>
                      <Button variant="outline" size="sm" className="font-semibold">
                        View Solutions &rarr;
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
