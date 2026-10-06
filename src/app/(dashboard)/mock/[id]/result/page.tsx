"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScoreOverviewCard } from "@/components/result/ScoreOverviewCard";
import { SubjectPerformanceCard } from "@/components/result/SubjectPerformanceCard";
import { WeakTopicDiagnosis } from "@/components/result/WeakTopicDiagnosis";
import { KnowledgeSpeedMatrix } from "@/components/result/KnowledgeSpeedMatrix";
import { QuestionReviewList } from "@/components/result/QuestionReviewList";
import { Button } from "@/components/ui/Button";
import {
  Printer,
  RefreshCw,
  Layers,
  Sparkles,
  Award,
  AlertCircle,
  BookmarkCheck,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function ExamResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [practiceLoading, setPracticeLoading] = useState<string | null>(null);
  const [isPublishingResults, setIsPublishingResults] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/tests/${params.id}/result`)
      .then((res) => res.json())
      .then((data) => {
        setResultData(data);
      })
      .catch((err) => console.error("Error loading result:", err))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handlePublishResults = async (examConfigId: string) => {
    try {
      setIsPublishingResults(true);
      setPublishFeedback(null);
      const res = await fetch(`/api/exams/${examConfigId}/publish-results`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setPublishFeedback("Results have been published and are now visible to all students!");
        // Refresh local state
        setResultData((prev: any) => ({
          ...prev,
          testAttempt: {
            ...prev.testAttempt,
            isHeldForStudents: false,
          },
        }));
      } else {
        alert(data.error || "Failed to publish results");
      }
    } catch (e: any) {
      alert("Error publishing results: " + e.message);
    } finally {
      setIsPublishingResults(false);
    }
  };

  const handleStartSpecializedPractice = async (mode: "MISTAKES" | "MARKED" | "UNATTEMPTED") => {
    try {
      setPracticeLoading(mode);
      const res = await fetch("/api/practice/specialized", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, attemptId: params.id }),
      });
      const data = await res.json();
      if (data.success && data.testAttemptId) {
        router.push(`/mock/${data.testAttemptId}`);
      } else {
        alert(data.message || data.error || "No eligible questions found for this practice mode.");
      }
    } catch (e: any) {
      alert("Failed to start specialized practice session: " + e.message);
    } finally {
      setPracticeLoading(null);
    }
  };

  if (loading || !resultData) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-sm text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        Generating comprehensive diagnostic performance evaluation...
      </div>
    );
  }

  // Student Held Screen: Instructor evaluation in progress
  if (resultData.isHeld) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-5 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
          <BookmarkCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Test Submitted Successfully!
          </h2>
          <p className="text-xs text-slate-500">
            Candidate: <strong>{resultData.candidateName}</strong> &bull; Examination: {resultData.examTitle}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs leading-relaxed font-medium text-left space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span>📋 Scorecard Held by Instructor</span>
          </p>
          <p className="text-[11px] text-amber-900">
            The official scorecard, ranking percentile, and detailed solutions for this examination are currently under
            instructor review. They will be published to your portal or sent via email as soon as evaluation is completed.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/exams">
            <Button variant="primary" size="md" className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              Return to Examination Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { testAttempt, evaluation, topicPerformance, knowledgeSpeedMatrix, questions } = resultData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Instructor Result Release Bar */}
      {testAttempt?.isHeldForStudents && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-sm font-bold flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-white" />
              <span>Results are currently ON HOLD for students</span>
            </div>
            <p className="text-xs text-amber-100">
              Students see &quot;Evaluation in Progress&quot;. Click below when ready to make scorecards and solutions public.
            </p>
          </div>

          <Button
            onClick={() => handlePublishResults(testAttempt.examConfigId)}
            disabled={isPublishingResults}
            className="bg-white hover:bg-amber-50 text-amber-900 font-extrabold text-xs shadow-xs px-4 py-2"
          >
            {isPublishingResults ? "Publishing..." : "🚀 Publish Results to All Students"}
          </Button>
        </div>
      )}

      {publishFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <BookmarkCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{publishFeedback}</span>
        </div>
      )}

      {/* Top Banner with Print / Export */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1 border border-emerald-200">
            <Award className="w-3.5 h-3.5" /> Examination Evaluated Server-Side
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Performance Analytics &amp; Result Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {testAttempt.examTitle} &bull; Candidate: {testAttempt.candidateName} &bull; Completed on{" "}
            {new Date(testAttempt.completedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="border-slate-300 text-slate-700"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print / Save as PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="border-slate-300 text-slate-700"
          >
            &larr; Back
          </Button>

          <Link href="/admin?tab=SUBMISSIONS">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
            >
              <Award className="w-3.5 h-3.5 mr-1.5" />
              Admin Leaderboard
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Score Overview Banner */}
      <ScoreOverviewCard
        finalScore={evaluation.finalScore}
        totalMarks={testAttempt.totalMarks}
        rawScore={evaluation.rawScore}
        negativeMarksTotal={evaluation.negativeMarksTotal}
        accuracy={evaluation.accuracy}
        attemptRate={evaluation.attemptRate}
        totalQuestions={evaluation.totalQuestions}
        attemptedCount={evaluation.attemptedCount}
        correctCount={evaluation.correctCount}
        incorrectCount={evaluation.incorrectCount}
        unattemptedCount={evaluation.unattemptedCount}
        totalTimeSeconds={evaluation.totalTimeSeconds}
        averageTimeSeconds={evaluation.averageTimePerQuestionSeconds}
      />

      {/* Action Strip: Specialized Practice Triggers */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Targeted Remedial Practice Sessions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reinforce concepts while the questions are fresh in your memory.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => handleStartSpecializedPractice("MISTAKES")}
            disabled={Boolean(practiceLoading) || evaluation.incorrectCount === 0}
            className="p-3.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all disabled:opacity-40 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Retry Incorrect ({evaluation.incorrectCount})
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Fix misconceptions without penalty
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleStartSpecializedPractice("MARKED")}
            disabled={Boolean(practiceLoading) || evaluation.markedCount === 0}
            className="p-3.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all disabled:opacity-40 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Practice Marked ({evaluation.markedCount})
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Review flagged questions with timer
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleStartSpecializedPractice("UNATTEMPTED")}
            disabled={Boolean(practiceLoading) || evaluation.unattemptedCount === 0}
            className="p-3.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-all disabled:opacity-40 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Solve Unattempted ({evaluation.unattemptedCount})
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Questions you ran out of time on
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. 2D Knowledge vs Speed Matrix */}
      {knowledgeSpeedMatrix && <KnowledgeSpeedMatrix matrix={knowledgeSpeedMatrix} />}

      {/* 3. Statistically Validated Weak Topic Diagnosis */}
      <WeakTopicDiagnosis topics={topicPerformance} />

      {/* 4. Subject-wise Cards Breakdown */}
      <SubjectPerformanceCard breakdown={evaluation.subjectBreakdown} />

      {/* 5. Question-by-Question Solutions Review */}
      <QuestionReviewList questions={questions} />
    </div>
  );
}
