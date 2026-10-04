"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Zap, PlayCircle, Target, CheckCircle2, Sparkles } from "lucide-react";

export default function QuickPracticePage() {
  const router = useRouter();
  const [subject, setSubject] = useState("ALL");
  const [topic, setTopic] = useState("ALL");
  const [count, setCount] = useState(10);
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartPractice = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject !== "ALL" ? subject : undefined,
          topic: topic !== "ALL" ? topic : undefined,
          count,
        }),
      });
      if (res.status === 401) {
        router.push("/login?callbackUrl=/practice");
        return;
      }
      const data = await res.json();
      if (data.testAttemptId) {
        router.push(`/mock/${data.testAttemptId}/test?instantFeedback=${instantFeedback}`);
      }
    } catch (e) {
      console.error("Practice setup failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
          <Zap className="w-3.5 h-3.5 text-blue-600" /> Interactive Learning Mode
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Quick Practice Session
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Target specific subjects and topics with instant step-by-step KaTeX explanations
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
        {/* Subject Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Target Subject
          </label>
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setTopic("ALL");
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Subjects (Comprehensive Mix)</option>
            <option value="General Intelligence">General Intelligence &amp; Reasoning</option>
            <option value="Quantitative Aptitude">Quantitative Aptitude (Mathematics)</option>
            <option value="English Language">English Language Comprehension</option>
            <option value="General Awareness">General Awareness &amp; Static GK</option>
          </select>
        </div>

        {/* Question Count */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Question Count
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                  count === n
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {n} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Instant Feedback Toggle */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-900 block">
              Instant Solution Feedback
            </span>
            <span className="text-xs text-slate-500 block">
              Immediately show whether your answer was correct with step-by-step solution
            </span>
          </div>

          <button
            type="button"
            onClick={() => setInstantFeedback(!instantFeedback)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              instantFeedback ? "bg-blue-600" : "bg-slate-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                instantFeedback ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Launch Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full shadow-xs"
          onClick={handleStartPractice}
          isLoading={isLoading}
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          <span>Begin Practice Session</span>
        </Button>
      </div>
    </div>
  );
}
