"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Target,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  ShieldCheck,
  Eye,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function TestBuilderPage() {
  const router = useRouter();

  // Wizard Step: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("UP Police SI Full Mock Test 02");
  const [category, setCategory] = useState("UP_POLICE");
  const [description, setDescription] = useState("Comprehensive UPSI exam simulation with sectional qualifiers.");
  const [difficulty, setDifficulty] = useState("MEDIUM");

  // Timing Mode
  const [timingMode, setTimingMode] = useState<"OVERALL" | "SECTIONAL">("OVERALL");
  const [totalDurationMinutes, setTotalDurationMinutes] = useState(120);

  // Marking
  const [marksPerCorrect, setMarksPerCorrect] = useState(2.5);
  const [negativeMarks, setNegativeMarks] = useState(0.0);

  // Navigation
  const [allowBackNavigation, setAllowBackNavigation] = useState(true);
  const [sectionLock, setSectionLock] = useState(false);

  // Sections
  const [sections, setSections] = useState([
    { name: "सामान्य हिन्दी (General Hindi)", questionCount: 40, durationMinutes: 30 },
    { name: "मूलविधि / संविधान / GK", questionCount: 40, durationMinutes: 30 },
    { name: "संख्यात्मक योग्यता (Maths)", questionCount: 40, durationMinutes: 30 },
    { name: "तार्किक परीक्षा (Reasoning)", questionCount: 40, durationMinutes: 30 },
  ]);

  // Question Selection Mode
  const [questionSelectionMode, setQuestionSelectionMode] = useState<"RANDOM" | "MANUAL">("RANDOM");
  const [randomConfig, setRandomConfig] = useState({
    easyPercent: 20,
    mediumPercent: 60,
    hardPercent: 20,
  });

  const totalQuestions = sections.reduce((sum, s) => sum + Number(s.questionCount), 0);
  const totalMarks = totalQuestions * marksPerCorrect;

  const handleAddSection = () => {
    setSections([...sections, { name: "New Section", questionCount: 25, durationMinutes: 15 }]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: string, value: any) => {
    const updated = [...sections];
    (updated[index] as any)[field] = value;
    setSections(updated);
  };

  const handlePublishTest = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        title,
        category,
        description,
        totalQuestions,
        totalMarks,
        totalDurationMinutes,
        marksPerCorrect,
        negativeMarks,
        sectionalTiming: timingMode === "SECTIONAL",
        sectionLock,
        allowBackNavigation,
        difficulty,
        sections,
      };

      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish test");

      setSuccessMessage("Test created successfully! Redirecting to Exams Catalog...");
      setTimeout(() => {
        router.push("/exams");
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save and publish test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-200">
            <span>Admin Test Builder &bull; Dynamic Exam Config</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create &amp; Publish Mock Examination
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Design realistic competitive tests with custom sections, timers, negative marking, and questions
          </p>
        </div>

        <Link href="/admin">
          <button className="text-xs font-semibold text-slate-600 hover:text-black">
            &larr; Back to Admin Dashboard
          </button>
        </Link>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
        <button
          onClick={() => setCurrentStep(1)}
          className={`py-2 rounded-xl border transition-all ${
            currentStep === 1
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-white text-slate-700 border-slate-200"
          }`}
        >
          1. Exam Details
        </button>
        <button
          onClick={() => setCurrentStep(2)}
          className={`py-2 rounded-xl border transition-all ${
            currentStep === 2
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-white text-slate-700 border-slate-200"
          }`}
        >
          2. Sections &amp; Qs
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className={`py-2 rounded-xl border transition-all ${
            currentStep === 3
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-white text-slate-700 border-slate-200"
          }`}
        >
          3. Timing &amp; Marks
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          className={`py-2 rounded-xl border transition-all ${
            currentStep === 4
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-white text-slate-700 border-slate-200"
          }`}
        >
          4. Preview &amp; Publish
        </button>
      </div>

      {/* Error / Success Feedback */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* STEP 1: EXAM BASIC DETAILS */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base">Step 1: Exam &amp; Target Category</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Test Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SSC CHSL Tier-I Mock Test 02"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Exam Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="SSC">Staff Selection Commission (SSC)</option>
                  <option value="UP_POLICE">UP Police / UPSI</option>
                  <option value="RAILWAY">Railway RRB</option>
                  <option value="BANKING">Banking (IBPS / SBI)</option>
                  <option value="CUSTOM">Custom Competitive Blueprint</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none"
                >
                  <option value="EASY">Easy (Foundation / Beginners)</option>
                  <option value="MEDIUM">Medium (Actual Exam Standard)</option>
                  <option value="HARD">Hard (Advanced Qualifying Level)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description &amp; Overview</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
            >
              <span>Next: Configure Sections</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONFIGURE SECTIONS & QUESTIONS */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Step 2: Dynamic Exam Sections</h3>
              <p className="text-xs text-slate-500">Configure each subject section and question allotment</p>
            </div>
            <button
              onClick={handleAddSection}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                <div className="sm:col-span-6">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Section #{idx + 1} Name</label>
                  <input
                    type="text"
                    value={sec.name}
                    onChange={(e) => handleSectionChange(idx, "name", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Questions</label>
                  <input
                    type="number"
                    value={sec.questionCount}
                    onChange={(e) => handleSectionChange(idx, "questionCount", Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={sec.durationMinutes}
                    onChange={(e) => handleSectionChange(idx, "durationMinutes", Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  {sections.length > 1 && (
                    <button
                      onClick={() => handleRemoveSection(idx)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Random Question Generator Config */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Random Question Selection from Approved Bank (Req 31)</span>
            </div>
            <p className="text-slate-600">
              Distribute difficulty across questions selected from the Question Bank:
            </p>
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="bg-white p-2.5 rounded-lg border border-blue-200 text-center">
                <span className="text-[10px] text-slate-500 font-sans block">Easy (20%)</span>
                <span className="font-bold text-slate-800">{Math.round(totalQuestions * 0.2)} Qs</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-200 text-center">
                <span className="text-[10px] text-slate-500 font-sans block">Medium (60%)</span>
                <span className="font-bold text-slate-800">{Math.round(totalQuestions * 0.6)} Qs</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-200 text-center">
                <span className="text-[10px] text-slate-500 font-sans block">Hard (20%)</span>
                <span className="font-bold text-slate-800">{Math.round(totalQuestions * 0.2)} Qs</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
            >
              <span>Next: Timing &amp; Marking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TIMING & MARKING RULES */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Step 3: Timing &amp; Marking Scheme</h3>

          <div className="space-y-4">
            {/* Timing Mode Selection */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Timing Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setTimingMode("OVERALL")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    timingMode === "OVERALL"
                      ? "bg-blue-50 border-blue-600 ring-2 ring-blue-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">Overall Test Timer</div>
                  <div className="text-xs text-slate-500 mt-1">Single countdown for entire test (SSC standard)</div>
                </div>

                <div
                  onClick={() => setTimingMode("SECTIONAL")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    timingMode === "SECTIONAL"
                      ? "bg-blue-50 border-blue-600 ring-2 ring-blue-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">Sectional Timer (Mandatory)</div>
                  <div className="text-xs text-slate-500 mt-1">Per-section timer with auto-submit (Banking / Tier-2)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Total Duration (Minutes)</label>
                <input
                  type="number"
                  value={totalDurationMinutes}
                  onChange={(e) => setTotalDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Marks per Correct (+)</label>
                <input
                  type="number"
                  step="0.5"
                  value={marksPerCorrect}
                  onChange={(e) => setMarksPerCorrect(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono text-emerald-700 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Negative Marking (-)</label>
                <input
                  type="number"
                  step="0.25"
                  value={negativeMarks}
                  onChange={(e) => setNegativeMarks(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl font-mono text-red-700 font-bold"
                />
              </div>
            </div>

            {/* Navigation & Section Locking */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
              <span className="font-bold text-slate-800 block">Candidate Navigation Controls</span>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowBackNavigation}
                  onChange={(e) => setAllowBackNavigation(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-semibold text-slate-700">
                  Allow Back Navigation between Completed Sections
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sectionLock}
                  onChange={(e) => setSectionLock(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span className="font-semibold text-slate-700">
                  Enforce Sequential Section Locking (Cannot visit previous sections)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
            >
              &larr; Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-2"
            >
              <span>Next: Preview &amp; Publish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PREVIEW & PUBLISH */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Step 4: Summary &amp; Verification</h3>
              <p className="text-xs text-slate-500">Verify test specifications before making it live for students</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Ready to Publish
            </span>
          </div>

          {/* Blueprint Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-slate-900">{title}</h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  Category: {category} &bull; Difficulty: {difficulty}
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-lg font-black text-blue-700">{totalMarks} Marks</div>
                <div className="text-xs text-slate-500">{totalQuestions} Questions</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Duration:</span>
                <span className="font-bold text-slate-800 font-mono">{totalDurationMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Timing Mode:</span>
                <span className="font-bold text-slate-800">{timingMode}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Correct / Wrong:</span>
                <span className="font-bold text-slate-800 font-mono">+{marksPerCorrect} / -{negativeMarks}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Navigation:</span>
                <span className="font-bold text-slate-800">{sectionLock ? "Sequential Lock" : "Free"}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Configured Sections:</span>
              <div className="flex flex-wrap gap-2">
                {sections.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-medium"
                  >
                    {s.name} ({s.questionCount} Qs &bull; {s.durationMinutes}m)
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
            >
              &larr; Back
            </button>

            <button
              onClick={handlePublishTest}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              {loading ? (
                <span>Publishing to Platform...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Test for Students</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
