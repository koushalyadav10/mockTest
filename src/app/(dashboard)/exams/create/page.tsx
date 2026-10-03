"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Trash2, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CreateExamPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: `SSC_CUSTOM_${Date.now()}`,
    title: "SSC CPO 2026 Tier-1 Mock Exam",
    description: "Configurable Staff Selection Commission examination pattern",
    category: "SSC",
    mode: "TIER_1",
    totalQuestions: 100,
    totalMarks: 200,
    totalDurationMinutes: 60,
    marksPerCorrect: 2.0,
    negativeMarks: 0.5,
    sectionalTiming: false,
    sectionLock: false,
    navigationRules: "FREE",
    questionShuffle: true,
    optionShuffle: true,
    sections: [
      { name: "General Intelligence & Reasoning", questionCount: 25 },
      { name: "General Knowledge & Awareness", questionCount: 25 },
      { name: "Quantitative Aptitude", questionCount: 25 },
      { name: "English Comprehension", questionCount: 25 },
    ],
  });

  const handleAddSection = () => {
    setForm({
      ...form,
      sections: [
        ...form.sections,
        { name: `Section ${form.sections.length + 1}`, questionCount: 25 },
      ],
    });
  };

  const handleRemoveSection = (index: number) => {
    setForm({
      ...form,
      sections: form.sections.filter((_, idx) => idx !== index),
    });
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/exams");
      }
    } catch (err) {
      console.error("Error creating exam config:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link href="/exams">
          <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Exam Configuration Engine
          </h1>
          <p className="text-xs text-slate-500">
            Define custom examination patterns, marking schemes, section rules, and timing
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveExam} className="space-y-6">
        {/* Core Metadata */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            General Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Exam Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Identifier Code
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="SSC">Staff Selection Commission (SSC)</option>
                <option value="RAILWAY">Railways (RRB NTPC/Group D)</option>
                <option value="BANKING">Banking (IBPS/SBI)</option>
                <option value="CUSTOM">Custom Practice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Examination Mode
              </label>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="TIER_1">Tier 1 (Preliminary)</option>
                <option value="TIER_2">Tier 2 (Mains)</option>
                <option value="PRACTICE">Practice Mode (Instant Feedback)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scoring & Duration Engine */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Scoring &amp; Timer Configuration
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Questions
              </label>
              <input
                type="number"
                value={form.totalQuestions}
                onChange={(e) =>
                  setForm({ ...form, totalQuestions: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Marks
              </label>
              <input
                type="number"
                value={form.totalMarks}
                onChange={(e) =>
                  setForm({ ...form, totalMarks: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marks per Correct (+)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.marksPerCorrect}
                onChange={(e) =>
                  setForm({ ...form, marksPerCorrect: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-emerald-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Negative Marks (-)
              </label>
              <input
                type="number"
                step="0.05"
                value={form.negativeMarks}
                onChange={(e) =>
                  setForm({ ...form, negativeMarks: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-red-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Duration (Minutes)
              </label>
              <input
                type="number"
                value={form.totalDurationMinutes}
                onChange={(e) =>
                  setForm({ ...form, totalDurationMinutes: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Navigation Rules
              </label>
              <select
                value={form.navigationRules}
                onChange={(e) => setForm({ ...form, navigationRules: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              >
                <option value="FREE">Free Navigation (Move anywhere)</option>
                <option value="SEQUENTIAL">Sequential Navigation (Strict)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="sectionLockCheck"
                checked={form.sectionLock}
                onChange={(e) => setForm({ ...form, sectionLock: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="sectionLockCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Lock Section on Expiry
              </label>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="shuffleCheck"
                checked={form.questionShuffle}
                onChange={(e) => setForm({ ...form, questionShuffle: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor="shuffleCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Shuffle Questions
              </label>
            </div>
          </div>
        </div>

        {/* Section Breakdown Builder */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Sections &amp; Question Distribution
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSection}>
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              Add Section
            </Button>
          </div>

          <div className="space-y-3">
            {form.sections.map((sec, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-mono text-xs font-bold text-slate-500 w-6">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={sec.name}
                  onChange={(e) => {
                    const next = [...form.sections];
                    next[idx].name = e.target.value;
                    setForm({ ...form, sections: next });
                  }}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Section Name"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={sec.questionCount}
                    onChange={(e) => {
                      const next = [...form.sections];
                      next[idx].questionCount = parseInt(e.target.value, 10);
                      setForm({ ...form, sections: next });
                    }}
                    className="w-20 px-2 py-1.5 border border-slate-300 rounded text-sm font-mono text-center"
                  />
                  <span className="text-xs text-slate-500">Qs</span>
                </div>
                {form.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/exams">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Exam Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
