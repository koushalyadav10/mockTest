"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
  BookOpen,
  Play,
  Shuffle,
  Sparkles,
  Users,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Zap,
} from "lucide-react";

interface ChapterHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: {
    id: string;
    code: string;
    title: string;
    description: string;
    totalQuestions: number;
    totalDurationMinutes: number;
    marksPerCorrect: number;
    negativeMarks: number;
  } | null;
  isAdmin: boolean;
  onStartSession: (options: {
    examId: string;
    subtopicFilter?: string;
    examFilter?: string;
    shuffle?: boolean;
    instantFeedback?: boolean;
    broadcastToStudents?: boolean;
  }) => void;
  isLoading?: boolean;
}

// Chapter specific types dictionary
const CHAPTER_TYPES: Record<string, string[]> = {
  Percentage: [
    "Basic Questions",
    "AB Rule",
    "Perimeter, Area & Volume",
    "Successive Percentage Change",
    "Ratio Method",
    "Series Concept",
    "Price-Consumption & Expenditure",
    "Income-Expenditure & Savings",
    "Based on Alligation",
    "Passing/Failure in Exam",
    "Based on Election",
    "Venn Diagram",
    "Miscellaneous",
  ],
  "Profit & Loss": [
    "Basic Questions",
    "Difference Between SP & CP",
    "CP of X = SP of Y",
    "Profit/Loss = CP/SP of Articles",
    "Profit/Loss on Selling Price",
    "Butterfly Concept",
    "Number of Articles",
    "Average Concept (Same CP)",
    "When SP is Same",
    "Dishonest Shopkeeper",
    "Char Minar Concept",
    "Based on Alligation",
    "Miscellaneous",
  ],
  Discount: [
    "Basic Questions",
    "Buy X Get Y Free",
    "Equivalent Discount (Two Successive)",
    "Equivalent Discount (Three Successive)",
    "Series Concept",
    "Mumtaz Concept",
    "Miscellaneous",
  ],
  "Simple Interest": [
    "Basic Questions",
    "Concept of Time",
    "Rate X% Higher or Lower",
    "Munni Method",
    "Based on Alligation",
    "Concept of Total SI",
    "Concept of Equal SI",
    "Installment",
    "Miscellaneous",
  ],
  "Compound Interest": [
    "Based on 2 Cycle",
    "Based on 3 & 4 Cycle",
    "Time in Fraction",
    "Difference of CI & SI for 2 & 3 Cycle",
    "Combination of CI and SI",
    "How to Find Rate",
    "How to Find Time",
    "Principal Becomes N Times",
    "Installment",
  ],
  Train: [
    "Passing Pole, Bridge or Platform",
    "Two Trains Opposite Direction",
    "Two Trains Same Direction",
    "Train Crosses Running Persons",
    "Train Crosses Person in Another Train",
    "Miscellaneous",
  ],
  "Time & Work": [
    "Based on Two Variables",
    "Based on Three Variables",
    "Alternate Days",
    "Leaving The Work",
    "Concept of Efficiency",
    "MDH Concept",
    "Concept of MWC",
    "Work & Wages",
  ],
  "Time & Distance": [
    "Basic Questions",
    "Speed Increased/Decreased",
    "Constant Distance & Total Time",
    "Average Speed",
    "Police and Thief",
    "Relative Speed",
  ],
  Average: [
    "Basic Questions",
    "Consecutive Natural Numbers",
    "Weighted Average",
    "Based on Inclusion",
    "Based on Exclusion",
    "Based on Replacement",
    "Wrongly Entered Data",
    "Cricket Problems",
  ],
};

const EXAM_FILTERS = ["ALL", "CHSL", "CGL", "CPO", "MTS", "Selection Post"];

export const ChapterHubModal: React.FC<ChapterHubModalProps> = ({
  isOpen,
  onClose,
  exam,
  isAdmin,
  onStartSession,
  isLoading = false,
}) => {
  if (!exam) return null;

  // Extract core topic name from title (e.g. "Profit & Loss" from "Chapter 2: Profit & Loss (लाभ और हानि)")
  const rawTitle = exam.title.replace(/^SSC Maths \(Aditya Ranjan\) — Chapter \d+:\s*/i, "");
  const topicName = rawTitle.split("(")[0].trim();

  // Options state
  const [typesList, setTypesList] = useState<string[]>(CHAPTER_TYPES[topicName] || [
    "Basic Questions",
    "Type-I",
    "Type-II",
    "Type-III",
    "Type-IV",
    "Miscellaneous",
  ]);
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedExam, setSelectedExam] = useState("ALL");
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  // Dynamically load real subtopics for this chapter
  React.useEffect(() => {
    if (!exam?.id) return;
    setBroadcastSuccess(null);
    fetch(`/api/exams/${exam.id}/subtopics`)
      .then((res) => res.json())
      .then((data) => {
        if (data.subtopics && Array.isArray(data.subtopics) && data.subtopics.length > 0) {
          setTypesList(data.subtopics);
        } else if (CHAPTER_TYPES[topicName]) {
          setTypesList(CHAPTER_TYPES[topicName]);
        }
      })
      .catch(() => {
        if (CHAPTER_TYPES[topicName]) {
          setTypesList(CHAPTER_TYPES[topicName]);
        }
      });
  }, [exam?.id, topicName]);

  const handleLaunch = (broadcast = false) => {
    onStartSession({
      examId: exam.id,
      subtopicFilter: selectedType !== "ALL" ? selectedType : undefined,
      examFilter: selectedExam !== "ALL" ? selectedExam : undefined,
      shuffle: shuffleQuestions,
      instantFeedback,
      broadcastToStudents: broadcast,
    });
  };

  const handleBroadcastToCandidates = async () => {
    try {
      setIsAssigning(true);
      setBroadcastSuccess(null);
      const res = await fetch("/api/exams/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          subtopicFilter: selectedType !== "ALL" ? selectedType : undefined,
          examFilter: selectedExam !== "ALL" ? selectedExam : undefined,
          shuffle: shuffleQuestions,
          instantFeedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastSuccess(data.message || "Test successfully assigned and made available to all candidates!");
        if (onStartSession) {
          onStartSession({
            examId: exam.id,
            broadcastToStudents: true,
          });
        }
      } else {
        alert(data.error || "Failed to assign test");
      }
    } catch (e: any) {
      alert("Error assigning test: " + e.message);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chapter Practice & Test Hub" maxWidth="xl">
      <div className="space-y-6 text-slate-800 font-sans">
        {/* Chapter Header Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
              Aditya Ranjan 6500+ TCS
            </span>
            <span className="text-xs text-slate-300 font-mono">
              {exam.totalQuestions} Authentic Questions
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            {exam.title.replace("SSC Maths (Aditya Ranjan) — ", "")}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
            <span>⏱️ {exam.totalDurationMinutes} Mins</span>
            <span>•</span>
            <span>🎯 +{exam.marksPerCorrect} / -{exam.negativeMarks} Marks</span>
            <span>•</span>
            <span>⚡ Sequential Order 1..{exam.totalQuestions}</span>
          </div>
        </div>

        {/* Learning Mode Checkbox (Visible to All) */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant Answer &amp; Solution (Learning Mode)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              When checked, clicking any option reveals whether it is Correct/Wrong with full explanation immediately.
            </p>
          </div>
          <input
            type="checkbox"
            checked={instantFeedback}
            onChange={(e) => setInstantFeedback(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Student View: Fast 1-Click Launch */}
        {!isAdmin && (
          <div className="pt-2">
            <Button
              onClick={() => handleLaunch(false)}
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs text-sm flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Full Chapter Practice ({exam.totalQuestions} Questions)</span>
            </Button>
          </div>
        )}

        {/* Admin Tools: Filters, Shuffling & Candidate Broadcast */}
        {isAdmin && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Admin Power Filters &amp; Assignment Controls
              </h4>
            </div>

            {/* Topic / Type-Wise Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Select Question Type / Subtopic:</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="ALL">All Types Combined (Whole Chapter)</option>
                {typesList.map((t, idx) => (
                  <option key={t} value={t}>
                    Type {idx + 1}: {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Exam Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Filter by Target Exam Shift:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EXAM_FILTERS.map((ef) => (
                  <button
                    key={ef}
                    type="button"
                    onClick={() => setSelectedExam(ef)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedExam === ef
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {ef === "ALL" ? "All Exams" : ef}
                  </button>
                ))}
              </div>
            </div>

            {/* Mix / Shuffle Toggle */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Shuffle / Mix Questions &amp; Options</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Randomizes the presentation sequence for diagnostic recall testing.
                </p>
              </div>
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Success notification for admin assignment */}
            {broadcastSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{broadcastSuccess}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => handleLaunch(false)}
                disabled={isLoading || isAssigning}
                className="py-3 text-slate-800 border-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Play className="w-3.5 h-3.5 fill-slate-800" />
                <span>Test for Self (Admin Preview)</span>
              </Button>

              <Button
                onClick={handleBroadcastToCandidates}
                disabled={isLoading || isAssigning}
                className="py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center justify-center gap-2"
              >
                <Users className="w-3.5 h-3.5 text-white" />
                <span>{isAssigning ? "Broadcasting..." : "Start Test for Other Candidates"}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
