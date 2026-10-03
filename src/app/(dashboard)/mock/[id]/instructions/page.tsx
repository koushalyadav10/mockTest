"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BookmarkCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function ExamInstructionsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [declared, setDeclared] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    fetch(`/api/tests/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.testAttempt) setTest(data);
      })
      .catch((err) => console.error("Error loading instructions:", err))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleStartExam = async () => {
    if (!declared) return;
    try {
      setIsStarting(true);
      const res = await fetch(`/api/tests/${params.id}/start`, {
        method: "POST",
      });
      if (res.ok) {
        router.push(`/mock/${params.id}/test`);
      }
    } catch (e) {
      console.error("Failed to start exam:", e);
    } finally {
      setIsStarting(false);
    }
  };

  if (loading || !test) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-sm text-slate-500">
        Loading instructions...
      </div>
    );
  }

  const { testAttempt, examConfig } = test;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            Official CBT Candidate Instructions
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {examConfig.title}
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-700 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
          <div>
            Duration: <strong className="text-slate-900">{examConfig.totalDurationMinutes} mins</strong>
          </div>
          <span>•</span>
          <div>
            Total Qs: <strong className="text-slate-900">{testAttempt.totalQuestions}</strong>
          </div>
          <span>•</span>
          <div>
            Max Marks: <strong className="text-slate-900">{examConfig.totalMarks}</strong>
          </div>
        </div>
      </div>

      {/* Main Instructions Body */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs text-slate-800 text-sm leading-relaxed">
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base">General Instructions:</h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 text-xs sm:text-sm">
            <li>
              The clock will be set at the server. The countdown timer at the top right corner of the screen will display the remaining time available for you to complete the examination.
            </li>
            <li>
              When the timer reaches zero, the examination will end automatically. You do not need to click &apos;Submit&apos; once the timer runs out.
            </li>
            <li>
              Marking Scheme: For each correct response, you will be awarded{" "}
              <strong className="text-emerald-700">+{examConfig.marksPerCorrect} marks</strong>. For each wrong response,{" "}
              <strong className="text-red-600">-{examConfig.negativeMarks} marks</strong> will be deducted as negative marking. Unattempted questions incur no penalty.
            </li>
            <li>
              Do not close the browser tab or window. If you experience an accidental reload, your responses are preserved and the exam will resume with the server timer.
            </li>
          </ol>
        </div>

        {/* Question Palette Symbols Explanation */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 text-base">Navigating to a Question:</h3>
          <p className="text-xs text-slate-600">
            The Question Palette displayed on the right side of the screen will show the status of each question using one of the following symbols:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <span className="w-7 h-7 rounded border border-slate-300 bg-white text-slate-700 font-bold flex items-center justify-center font-mono">
                01
              </span>
              <span>You have not visited the question yet.</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-red-200 bg-red-50/50">
              <span className="w-7 h-7 rounded bg-red-500 text-white font-bold flex items-center justify-center font-mono">
                02
              </span>
              <span>You have visited the question but have not answered it.</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
              <span className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center font-mono">
                03
              </span>
              <span>You have answered the question.</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-purple-200 bg-purple-50/50">
              <span className="w-7 h-7 rounded bg-purple-600 text-white font-bold flex items-center justify-center font-mono">
                04
              </span>
              <span>You have NOT answered the question, but have marked it for review.</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 sm:col-span-2">
              <span className="w-7 h-7 rounded bg-indigo-700 text-white font-bold flex items-center justify-center font-mono relative">
                05
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              <span>The question is answered AND marked for review (evaluated in scoring).</span>
            </div>
          </div>
        </div>

        {/* Keyboard Navigation Shortcuts */}
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-slate-900 text-base">Keyboard Shortcuts:</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono">
              <strong>1, 2, 3, 4</strong>: Select Options A, B, C, D
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono">
              <strong>N / Enter</strong>: Save &amp; Next
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono">
              <strong>P</strong>: Previous
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono">
              <strong>M</strong>: Mark for Review
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-mono">
              <strong>C</strong>: Clear Response
            </span>
          </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="pt-4 border-t border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={declared}
              onChange={(e) => setDeclared(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
            />
            <span className="text-xs sm:text-sm text-slate-700">
              I have read and understood all the instructions given above. I declare that I will strictly abide by the rules and instructions of this examination.
            </span>
          </label>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!declared}
          isLoading={isStarting}
          onClick={handleStartExam}
          className="shadow-sm font-bold px-8"
        >
          <span>I am ready to begin</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
