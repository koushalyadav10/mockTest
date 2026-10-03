"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MathRenderer } from "@/components/math/MathRenderer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save, Trash2, CheckCircle2, FileText, Sparkles } from "lucide-react";

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/questions/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.question) setQuestion(data.question);
      })
      .catch((err) => console.error("Error fetching question:", err))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await fetch(`/api/questions/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });
      router.push("/question-bank");
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this question?")) {
      await fetch(`/api/questions/${params.id}`, { method: "DELETE" });
      router.push("/question-bank");
    }
  };

  if (loading || !question) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-sm text-slate-500">
        Loading question details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/question-bank">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-mono">
              Question #{question.questionNumber}
            </h1>
            <p className="text-xs text-slate-500">
              {question.subject} &bull; {question.topic}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete
          </Button>

          <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Editor Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-xs">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Question Content</label>
          <textarea
            rows={4}
            value={question.questionText}
            onChange={(e) => setQuestion({ ...question, questionText: e.target.value })}
            className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
          />
        </div>

        {/* Live KaTeX Preview */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500">Live Equation &amp; Font Preview</label>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm sm:text-base leading-relaxed text-slate-900">
            <MathRenderer text={question.questionText} />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Options &amp; Correct Answer
          </label>
          {question.options.map((opt: any, idx: number) => (
            <div
              key={opt.id || idx}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                opt.isCorrect ? "bg-emerald-50 border-emerald-400" : "bg-slate-50 border-slate-200"
              }`}
            >
              <input
                type="radio"
                name="correctOptionRadio"
                checked={opt.isCorrect}
                onChange={() => {
                  const nextOpts = question.options.map((o: any) => ({
                    ...o,
                    isCorrect: o.id === opt.id,
                  }));
                  setQuestion({ ...question, options: nextOpts });
                }}
                className="h-4 w-4 text-emerald-600 cursor-pointer"
              />
              <span className="font-bold font-mono text-xs w-5">{opt.label}.</span>
              <input
                type="text"
                value={opt.text}
                onChange={(e) => {
                  const nextOpts = [...question.options];
                  nextOpts[idx].text = e.target.value;
                  setQuestion({ ...question, options: nextOpts });
                }}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm bg-white"
              />
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-700">Detailed Solution Explanation</label>
          <textarea
            rows={3}
            value={question.explanation || ""}
            onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
            className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
