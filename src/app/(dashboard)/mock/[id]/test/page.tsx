"use client";

import React, { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExamHeader } from "@/components/cbt/ExamHeader";
import { SectionTabs, SectionTabItem } from "@/components/cbt/SectionTabs";
import { QuestionCard } from "@/components/cbt/QuestionCard";
import { QuestionPalette, PaletteItem } from "@/components/cbt/QuestionPalette";
import { ExamFooter } from "@/components/cbt/ExamFooter";
import { SubmitConfirmModal } from "@/components/cbt/SubmitConfirmModal";
import { ProctoringWarningModal } from "@/components/cbt/ProctoringWarningModal";
import { TestAccessGateModal, CandidateIdentity } from "@/components/cbt/TestAccessGateModal";
import { ResponseState } from "@/lib/exam/state-machine";
import { Maximize, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { isAssignedExam } from "@/lib/exam/tag-parser";

interface QuestionData {
  responseId: string;
  orderIndex: number;
  questionId: string;
  questionNumber: number;
  subject: string;
  topic: string;
  difficulty: string;
  questionText: string;
  hasVisualContent: boolean;
  visualType?: string;
  imageUrl?: string | null;
  source?: string;
  questionType?: string;
  directionText?: string | null;
  options: { stableId: string; displayLabel: string; text: string }[];
  selectedOptionStableId: string | null;
  responseState: ResponseState;
  timeSpentSeconds: number;
  correctOptionStableId?: string | null;
  explanation?: string | null;
}

function CBTExaminationTestContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const instantFeedback = searchParams.get("instantFeedback") === "true";

  const [testData, setTestData] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQ = questions[currentIndex];
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [sections, setSections] = useState<SectionTabItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<"SAVED" | "SYNCING" | "OFFLINE">("SAVED");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Instant Feedback & Question-level live speed timer (Freezes once marked)
  const [isInstantFeedbackActive, setIsInstantFeedbackActive] = useState(instantFeedback);
  const [questionTimeSeconds, setQuestionTimeSeconds] = useState(0);
  const currentQuestionTimeRef = useRef(0);

  useEffect(() => {
    if (!currentQ) return;

    const recordedTime = currentQ.timeSpentSeconds || 0;
    currentQuestionTimeRef.current = recordedTime;
    setQuestionTimeSeconds(recordedTime);

    // If answer is already marked, lock the timer at solve time and DO NOT tick!
    if (currentQ.selectedOptionStableId) {
      return;
    }

    // Unanswered: start ticking upward every second
    const interval = setInterval(() => {
      currentQuestionTimeRef.current += 1;
      setQuestionTimeSeconds(currentQuestionTimeRef.current);
    }, 1000);

    return () => {
      clearInterval(interval);
      // Persist elapsed time to question state so navigation preserves it
      const elapsed = currentQuestionTimeRef.current;
      setQuestions((prevQuestions) => {
        if (!prevQuestions[currentIndex] || prevQuestions[currentIndex].selectedOptionStableId) {
          return prevQuestions;
        }
        const copy = [...prevQuestions];
        copy[currentIndex] = {
          ...copy[currentIndex],
          timeSpentSeconds: elapsed,
        };
        return copy;
      });
    };
  }, [currentIndex, currentQ?.questionId, Boolean(currentQ?.selectedOptionStableId)]);

  // Refs for zero-latency proctoring checks during state transitions
  const isSubmitModalOpenRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const isAuthGateOpenRef = useRef(false);
  const showFullscreenModalRef = useRef(true);
  const isProctoringActiveRef = useRef(true);

  // Keep refs in sync with state
  useEffect(() => {
    isSubmitModalOpenRef.current = isSubmitModalOpen;
  }, [isSubmitModalOpen]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  // Candidate Access & Identity State
  const [candidate, setCandidate] = useState<CandidateIdentity | null>(null);
  const [isAuthGateOpen, setIsAuthGateOpen] = useState(false);

  useEffect(() => {
    isAuthGateOpenRef.current = isAuthGateOpen;
  }, [isAuthGateOpen]);

  useEffect(() => {
    const stored = sessionStorage.getItem(`exam_candidate_auth_${params.id}`);
    if (stored) {
      try {
        setCandidate(JSON.parse(stored));
      } catch (e) {}
    } else {
      setIsAuthGateOpen(true);
    }
  }, [params.id]);

  // Fullscreen & Anti-Cheat Proctoring States
  const [showFullscreenModal, setShowFullscreenModal] = useState(true);
  const [isProctoringWarningOpen, setIsProctoringWarningOpen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [lastViolationTime, setLastViolationTime] = useState("");

  useEffect(() => {
    showFullscreenModalRef.current = showFullscreenModal;
  }, [showFullscreenModal]);

  const enterFullscreen = () => {
    if (typeof document !== "undefined" && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setShowFullscreenModal(false);
    setIsProctoringWarningOpen(false);
  };

  const recordViolation = async (type: string, count: number) => {
    try {
      await fetch(`/api/tests/${params.id}/violation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          violationCount: count,
          sectionName: currentQ?.subject,
          questionNumber: currentIndex + 1,
        }),
      });
    } catch (e) {}
  };

  // Anti-Cheat Tab Switch & Window Focus Monitor
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        isProctoringActiveRef.current &&
        !showFullscreenModalRef.current &&
        !isSubmittingRef.current &&
        !isSubmitModalOpenRef.current &&
        !isAuthGateOpenRef.current
      ) {
        const time = new Date().toLocaleTimeString();
        setLastViolationTime(time);
        setViolationCount((prev) => {
          const next = prev + 1;
          recordViolation("TAB_SWITCH", next);
          return next;
        });
        setIsProctoringWarningOpen(true);
      }
    };

    const handleFullscreenChange = () => {
      const inFull = Boolean(document.fullscreenElement);
      // Never trigger when user is submitting or confirm modal is open
      if (
        !inFull &&
        isProctoringActiveRef.current &&
        !showFullscreenModalRef.current &&
        !isSubmittingRef.current &&
        !isSubmitModalOpenRef.current &&
        !isAuthGateOpenRef.current
      ) {
        const time = new Date().toLocaleTimeString();
        setLastViolationTime(time);
        setViolationCount((prev) => {
          const next = prev + 1;
          recordViolation("FULLSCREEN_EXIT", next);
          return next;
        });
        setIsProctoringWarningOpen(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Load Test Data
  const loadTest = useCallback(async () => {
    try {
      const res = await fetch(`/api/tests/${params.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.testAttempt.status === "EVALUATED") {
        router.push(`/mock/${params.id}/result`);
        return;
      }

      setTestData(data);
      setQuestions(data.questions);

      // Security: If exam is an assigned test or official exam mode, students NEVER see instant answers!
      const isAssigned = isAssignedExam(data.examConfig) || data.examConfig?.mode === "EXAM";
      if (isAssigned) {
        setIsInstantFeedbackActive(false);
      }

      // Build Section Tabs from Exam Config or Questions
      if (data.examConfig.sections && data.examConfig.sections.length > 0) {
        setSections(
          data.examConfig.sections.map((s: any) => ({
            id: s.id,
            name: s.name,
            questionCount: s.questionCount,
            isLocked: s.isLocked || false,
          }))
        );
      } else {
        const uniqueSubjects = Array.from(
          new Set(data.questions.map((q: any) => q.subject))
        );
        setSections(
          uniqueSubjects.map((subj: any) => ({
            id: subj,
            name: subj,
            questionCount: data.questions.filter((q: any) => q.subject === subj).length,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load CBT test:", err);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  // Auto-synchronize Active Section Tab with Current Question Subject
  useEffect(() => {
    if (currentQ && sections.length > 0) {
      const targetIdx = sections.findIndex(
        (s) => s.name.toLowerCase().trim() === currentQ.subject.toLowerCase().trim()
      );
      if (targetIdx !== -1 && targetIdx !== activeSectionIndex) {
        setActiveSectionIndex(targetIdx);
      }
    }
  }, [currentIndex, currentQ, sections, activeSectionIndex]);

  // Handle Section Tab Click -> Smooth Jump to that Section's first Question
  const handleSelectSection = (idx: number) => {
    setActiveSectionIndex(idx);
    const targetSection = sections[idx];
    if (targetSection) {
      const targetQIndex = questions.findIndex(
        (q) => q.subject.toLowerCase().trim() === targetSection.name.toLowerCase().trim()
      );
      if (targetQIndex !== -1) {
        setCurrentIndex(targetQIndex);
      }
    }
  };

  // Auto-Save Response to Server
  const persistResponse = async (
    qId: string,
    optStableId: string | null,
    action: "VISIT" | "SELECT_OPTION" | "CLEAR_RESPONSE" | "MARK_FOR_REVIEW" | "SAVE_AND_NEXT"
  ) => {
    setSyncStatus("SYNCING");
    try {
      const res = await fetch(`/api/tests/${params.id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: qId,
          selectedOptionStableId: optStableId,
          action,
          timeSpentIncrementSeconds: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to auto-save");
      setSyncStatus("SAVED");
    } catch (err) {
      console.warn("Auto-save offline:", err);
      setSyncStatus("OFFLINE");
    }
  };

  // Mark question visited when landing on it
  useEffect(() => {
    if (currentQ && currentQ.responseState === "NOT_VISITED") {
      setQuestions((prev) => {
        const next = [...prev];
        next[currentIndex] = { ...currentQ, responseState: "NOT_ANSWERED" };
        return next;
      });
      persistResponse(currentQ.questionId, currentQ.selectedOptionStableId, "VISIT");
    }
  }, [currentIndex]);

  // Handle Option Selection
  const handleSelectOption = (stableId: string) => {
    if (!currentQ) return;
    const nextList = [...questions];
    const isMarked =
      currentQ.responseState === "MARKED_FOR_REVIEW" ||
      currentQ.responseState === "ANSWERED_AND_MARKED_FOR_REVIEW";

    // Freeze timer at current seconds when marked
    const finalSolveTime = currentQ.selectedOptionStableId
      ? (currentQ.timeSpentSeconds || questionTimeSeconds)
      : (currentQuestionTimeRef.current || questionTimeSeconds || 1);

    nextList[currentIndex] = {
      ...currentQ,
      selectedOptionStableId: stableId,
      responseState: isMarked ? "ANSWERED_AND_MARKED_FOR_REVIEW" : "ANSWERED",
      timeSpentSeconds: finalSolveTime,
    };
    setQuestions(nextList);
    setQuestionTimeSeconds(finalSolveTime);
    persistResponse(currentQ.questionId, stableId, "SELECT_OPTION");
  };

  // Clear Response
  const handleClearResponse = () => {
    if (!currentQ) return;
    const nextList = [...questions];
    const isMarked =
      currentQ.responseState === "MARKED_FOR_REVIEW" ||
      currentQ.responseState === "ANSWERED_AND_MARKED_FOR_REVIEW";

    nextList[currentIndex] = {
      ...currentQ,
      selectedOptionStableId: null,
      responseState: isMarked ? "MARKED_FOR_REVIEW" : "NOT_ANSWERED",
    };
    setQuestions(nextList);
    persistResponse(currentQ.questionId, null, "CLEAR_RESPONSE");
  };

  // Mark for Review & Next
  const handleMarkForReview = () => {
    if (!currentQ) return;
    const nextList = [...questions];
    const hasOpt = Boolean(currentQ.selectedOptionStableId);
    nextList[currentIndex] = {
      ...currentQ,
      responseState: hasOpt ? "ANSWERED_AND_MARKED_FOR_REVIEW" : "MARKED_FOR_REVIEW",
    };
    setQuestions(nextList);
    persistResponse(currentQ.questionId, currentQ.selectedOptionStableId, "MARK_FOR_REVIEW");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Save & Next
  const handleSaveAndNext = () => {
    if (!currentQ) return;
    persistResponse(currentQ.questionId, currentQ.selectedOptionStableId, "SAVE_AND_NEXT");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Previous
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Final Submission with guaranteed max 3.5-second completion
  const handleFinalSubmit = async () => {
    try {
      isSubmittingRef.current = true;
      isProctoringActiveRef.current = false;
      setIsSubmitting(true);
      setIsSubmitModalOpen(false);
      setIsProctoringWarningOpen(false);

      // Fail-safe redirect timer: guarantees transition to scorecard even on slow networks
      const redirectTimer = setTimeout(() => {
        if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
          try { document.exitFullscreen(); } catch (e) {}
        }
        window.location.href = `/mock/${params.id}/result`;
      }, 3500);

      const controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), 3000);

      try {
        await fetch(`/api/tests/${params.id}/submit`, {
          method: "POST",
          signal: controller.signal,
        });
      } catch (fetchErr) {
        console.warn("Submit API fetch finished or timed out, proceeding to scorecard:", fetchErr);
      } finally {
        clearTimeout(abortTimer);
        clearTimeout(redirectTimer);
        if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
          try { await document.exitFullscreen(); } catch (e) {}
        }
        window.location.href = `/mock/${params.id}/result`;
      }
    } catch (e) {
      console.error("Submission failed:", e);
      if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
        try { document.exitFullscreen(); } catch (err) {}
      }
      window.location.href = `/mock/${params.id}/result`;
    }
  };

  if (loading || !testData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f8fa]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Initializing Exam Session...</p>
        </div>
      </div>
    );
  }

  const { testAttempt, examConfig } = testData;

  // Build Palette Items with subjects for section filtering
  const paletteItems: PaletteItem[] = questions.map((q, idx) => ({
    index: idx,
    questionNumber: idx + 1,
    state: q.responseState,
    isActive: idx === currentIndex,
    subject: q.subject,
  }));

  const answeredCount = questions.filter(
    (q) => q.responseState === "ANSWERED" || q.responseState === "ANSWERED_AND_MARKED_FOR_REVIEW"
  ).length;

  const notAnsweredCount = questions.filter(
    (q) => q.responseState === "NOT_ANSWERED" || q.responseState === "NOT_VISITED"
  ).length;

  const markedCount = questions.filter(
    (q) => q.responseState === "MARKED_FOR_REVIEW" || q.responseState === "ANSWERED_AND_MARKED_FOR_REVIEW"
  ).length;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f6f8] text-slate-800 font-sans">
      {/* Top Authoritative CBT Header */}
      <ExamHeader
        examTitle={examConfig.title}
        activeSectionName={currentQ?.subject || "General Section"}
        remainingSeconds={testAttempt.remainingSeconds}
        syncStatus={syncStatus}
        candidateName={candidate?.name || testData?.candidate?.name || "Candidate"}
        candidateRollNumber={candidate?.rollNumber || testData?.candidate?.studentRollNo || "EF-100179719"}
        onTimerExpire={handleFinalSubmit}
        timerKey={params.id}
      />

      {/* Synchronized Section Navigation Tabs */}
      {sections.length > 1 && (
        <SectionTabs
          sections={sections}
          activeSectionIndex={activeSectionIndex}
          onSelectSection={handleSelectSection}
          allowSwitching={!examConfig.sectionLock}
        />
      )}

      {/* Main Split Body: Question Area (Flex-1) + Right Sidebar Question Palette (300px - 330px) */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Left/Center: Question Card */}
        <main className="flex-1 p-3 sm:p-5 overflow-hidden flex flex-col bg-[#f4f6f8]">
          {currentQ && (
            <QuestionCard
              questionNumber={currentIndex + 1}
              questionText={currentQ.questionText}
              subject={currentQ.subject}
              topic={currentQ.topic}
              marksPerCorrect={examConfig.marksPerCorrect}
              negativeMarks={examConfig.negativeMarks}
              hasVisualContent={currentQ.hasVisualContent}
              imageUrl={currentQ.imageUrl}
              source={currentQ.source}
              questionType={currentQ.questionType}
              visualType={currentQ.visualType}
              directionText={currentQ.directionText}
              options={currentQ.options}
              selectedOptionStableId={currentQ.selectedOptionStableId}
              onSelectOption={handleSelectOption}
              questionTimeSeconds={questionTimeSeconds}
              isInstantFeedbackActive={isInstantFeedbackActive}
              onToggleInstantFeedback={setIsInstantFeedbackActive}
              correctOptionStableId={currentQ.correctOptionStableId}
              explanation={currentQ.explanation}
            />
          )}
        </main>

        {/* Right: Section-Aware Question Palette (Zero empty margins) */}
        <aside className="hidden lg:flex flex-col w-[300px] xl:w-[330px] shrink-0 h-full border-l border-slate-200 bg-[#f8f9fa] overflow-hidden">
          <QuestionPalette
            items={paletteItems}
            currentSectionName={currentQ?.subject}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </aside>
      </div>

      {/* Bottom Action Footer */}
      <ExamFooter
        onPrevious={handlePrevious}
        onClearResponse={handleClearResponse}
        onMarkForReview={handleMarkForReview}
        onSaveAndNext={handleSaveAndNext}
        onSubmitPrompt={() => setIsSubmitModalOpen(true)}
        isFirstQuestion={currentIndex === 0}
        isLastQuestion={currentIndex === questions.length - 1}
        hasSelectedOption={Boolean(currentQ?.selectedOptionStableId)}
        onToggleMobilePalette={() => setIsMobilePaletteOpen(true)}
        currentQuestionNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />

      {/* Mobile Question Palette Drawer (Slide-Up Bottom Sheet) */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-slate-950/75 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border-t border-slate-300 animate-in slide-in-from-bottom duration-200">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Question Palette ({questions.length} Questions)</span>
              </div>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-md text-xs font-semibold bg-slate-800"
              >
                Close ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 bg-[#f8f9fa]">
              <QuestionPalette
                items={paletteItems}
                currentSectionName={currentQ?.subject}
                onSelectQuestion={(idx) => {
                  setCurrentIndex(idx);
                  setIsMobilePaletteOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Initial Launch Prompt Modal */}
      {showFullscreenModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Proctored Examination Mode</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                ExamForge AI enforces an authentic CBT environment. The test will open in full-screen mode to prevent tab switches.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-600 text-left border border-slate-200 space-y-1">
              <div>&bull; Navigating away or switching tabs will be logged as a violation.</div>
              <div>&bull; Authoritative countdown timer runs uninterrupted.</div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={enterFullscreen}
              className="w-full justify-center font-bold text-sm shadow-md"
            >
              <Maximize className="w-4 h-4 mr-2" />
              Enter Fullscreen &amp; Start Test
            </Button>
          </div>
        </div>
      )}

      {/* Anti-Cheat Focus Loss Warning Modal (matching Screenshot 5) */}
      <ProctoringWarningModal
        isOpen={isProctoringWarningOpen}
        violationCount={violationCount}
        maxViolations={3}
        warningDurationSeconds={10}
        onResumeTest={() => setIsProctoringWarningOpen(false)}
        onAutoSubmit={handleFinalSubmit}
      />

      {/* Final Submission Summary & Confirmation Dialog */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleFinalSubmit}
        isSubmitting={isSubmitting}
        summary={{
          total: questions.length,
          answered: answeredCount,
          notAnswered: notAnsweredCount,
          markedForReview: markedCount,
        }}
      />

      {/* Submitting Progress Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Evaluating Examination</h3>
              <p className="text-xs text-slate-500 mt-1">Calculating negative marks, accuracy &amp; percentile...</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      )}

      {/* Candidate Verification Gate Modal (if opened directly without prior auth) */}
      <TestAccessGateModal
        testId={params.id}
        examTitle={examConfig?.title || "SSC CBT Examination"}
        isOpen={isAuthGateOpen}
        onAuthorized={(c) => {
          setCandidate(c);
          setIsAuthGateOpen(false);
          enterFullscreen();
        }}
      />
    </div>
  );
}

export default function CBTExaminationTestPage(props: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#f6f8fa]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Initializing Exam Session...</p>
          </div>
        </div>
      }
    >
      <CBTExaminationTestContent {...props} />
    </Suspense>
  );
}
