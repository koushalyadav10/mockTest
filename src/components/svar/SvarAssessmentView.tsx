"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  ArrowRight,
  ArrowLeft,
  Settings,
  History,
  Shield,
  Layers,
  ChevronRight,
  LogOut,
  X,
  ListFilter,
  Check,
} from "lucide-react";
import {
  SvarQuestion,
  SVAR_SECTIONS,
  generateTestQuestions,
} from "@/lib/svar/svarQuestionBank";
import { speechService, checkSpeechCapabilities } from "@/lib/svar/speechService";
import {
  ScoringEngine,
  CandidateAnswer,
  SvarEvaluationResult,
} from "@/lib/svar/scoringEngine";
import { SvarAudioCheckModal } from "./SvarAudioCheckModal";
import { SvarConfigModal, SvarTestConfig } from "./SvarConfigModal";
import { SvarHistoryModal } from "./SvarHistoryModal";
import { SvarReportModal } from "./SvarReportModal";

interface SvarAssessmentViewProps {
  candidateName?: string;
  onExit?: () => void;
}

export const SvarAssessmentView: React.FC<SvarAssessmentViewProps> = ({
  candidateName = "Candidate",
  onExit,
}) => {
  // Test Configuration
  const [testConfig, setTestConfig] = useState<SvarTestConfig>({
    mode: "accenture_versant",
    difficulty: "Mixed",
    accent: "American English",
    durationMinutes: 25,
  });

  // Modals & Drawers
  const [showAudioCheck, setShowAudioCheck] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [finalReport, setFinalReport] = useState<SvarEvaluationResult | null>(null);

  // Fullscreen Proctored State
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Test State
  const [questions, setQuestions] = useState<SvarQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, CandidateAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);

  // Recording & Speech State
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [activeRecordedAudioUrl, setActiveRecordedAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordTimerRef = useRef<any>(null);

  // Audio prompt & TTS state
  const [isPlayingAudioPrompt, setIsPlayingAudioPrompt] = useState(false);
  const [replaysUsedMap, setReplaysUsedMap] = useState<Record<string, number>>({});

  // Prep Countdown Timer (for Story Retelling & Open Speaking)
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState<number | null>(null);
  const prepTimerRef = useRef<any>(null);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Initialize fresh test questions
  const initializeTest = (cfg: SvarTestConfig) => {
    const generated = generateTestQuestions(cfg.mode, cfg.difficulty);
    setQuestions(generated.questions);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeft(cfg.durationMinutes * 60);
    setTimerActive(true);
    setTestStartTime(Date.now());
    setFinalReport(null);
    setShowReportModal(false);
    setReplaysUsedMap({});
    setLiveTranscript("");
    setActiveRecordedAudioUrl(null);
  };

  useEffect(() => {
    initializeTest(testConfig);
  }, []);

  // Main countdown timer
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
      handleFinishTest(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  const currentQ = questions[currentQIndex] || null;

  // Cleanup on question change
  useEffect(() => {
    if (isRecording) {
      handleStopRecording();
    }
    speechService.stopListeningAudio();
    setIsPlayingAudioPrompt(false);

    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
      setPrepSecondsRemaining(null);
    }

    if (currentQ && userAnswers[currentQ.id]) {
      const prevAns = userAnswers[currentQ.id];
      setLiveTranscript(prevAns.transcript || "");
      setActiveRecordedAudioUrl(prevAns.audioUrl || null);
    } else {
      setLiveTranscript("");
      setActiveRecordedAudioUrl(null);
    }
  }, [currentQIndex]);

  // Audio Recording Handlers
  const handleStartRecording = async () => {
    setLiveTranscript("");
    setIsRecording(true);
    setRecordingDuration(0);

    recordTimerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);

    const langCode =
      testConfig.accent === "British English"
        ? "en-GB"
        : testConfig.accent === "Indian English"
        ? "en-IN"
        : "en-US";

    await speechService.startRecording({
      lang: langCode,
      onTranscript: (txt) => {
        setLiveTranscript(txt);
      },
      onLevel: (lvl) => {
        setAudioLevel(lvl);
      },
      onError: (err) => {
        console.warn("Recording notice:", err);
      },
    });
  };

  const handleStopRecording = async () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setIsRecording(false);
    setAudioLevel(0);

    const result = await speechService.stopRecording();
    setActiveRecordedAudioUrl(result.audioUrl);

    if (currentQ) {
      const targetText =
        currentQ.targetText ||
        currentQ.correctSentence ||
        (currentQ.expectedShortAnswer ? currentQ.expectedShortAnswer[0] : "") ||
        "";
      const spokenText = liveTranscript || "";
      const duration = result.durationSeconds || recordingDuration || 1;

      const pronAnalysis = speechService.analyzePronunciation(targetText, spokenText);
      const fluAnalysis = speechService.analyzeFluency(spokenText, duration);

      setUserAnswers((prev) => ({
        ...prev,
        [currentQ.id]: {
          ...prev[currentQ.id],
          transcript: spokenText,
          audioUrl: result.audioUrl,
          durationSeconds: duration,
          accuracy: pronAnalysis.accuracy,
          wordDiffs: pronAnalysis.wordDiffs,
          fluency: fluAnalysis,
        },
      }));
    }
  };

  // Play audio prompt via TTS
  const handlePlayAudioPrompt = () => {
    if (!currentQ || (!currentQ.audioScript && !currentQ.questionText)) return;

    const maxReplays = testConfig.mode === "accenture_versant" ? 1 : 2;
    const currentReplays = replaysUsedMap[currentQ.id] || 0;
    if (currentReplays >= maxReplays) {
      alert(`You have reached the maximum allowed replays (${maxReplays}) for this question.`);
      return;
    }

    setIsPlayingAudioPrompt(true);
    setReplaysUsedMap((prev) => ({
      ...prev,
      [currentQ.id]: currentReplays + 1,
    }));

    const textToPlay = currentQ.audioScript || currentQ.questionText || "";
    speechService.playListeningScript(textToPlay, {
      accent: testConfig.accent,
      onStart: () => setIsPlayingAudioPrompt(true),
      onEnd: () => {
        setIsPlayingAudioPrompt(false);
        // In repeat sentences / sentence builds: trigger beep buzzer after audio ends!
        if (
          currentQ.sectionId === "repeat_sentences" ||
          currentQ.sectionId === "sentence_builds" ||
          currentQ.sectionId === "short_answers"
        ) {
          speechService.playBeepBuzzer().then(() => {
            handleStartRecording();
          });
        }
      },
    });
  };

  // Start 30s prep timer for Story Retelling / Open Speaking
  const handleStartPrepTimer = () => {
    if (prepTimerRef.current) return;
    setPrepSecondsRemaining(30);

    prepTimerRef.current = setInterval(() => {
      setPrepSecondsRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(prepTimerRef.current);
          prepTimerRef.current = null;
          speechService.playBeepBuzzer().then(() => {
            handleStartRecording();
          });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Option selection for Listening & Grammar MCQs
  const handleSelectOption = (idx: number) => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOptionIndex: idx,
      },
    }));
  };

  // Finish Assessment
  const handleFinishTest = (force = false) => {
    if (!force) {
      const answeredCount = Object.keys(userAnswers).length;
      const total = questions.length;
      const confirmMsg =
        answeredCount < total
          ? `You have completed ${answeredCount} of ${total} questions. Are you sure you want to finish and generate your diagnostic scorecard?`
          : "Are you ready to submit your assessment and view your final transparent scorecard?";
      if (!window.confirm(confirmMsg)) return;
    }

    setTimerActive(false);
    speechService.stopListeningAudio();

    const elapsed = testStartTime
      ? Math.round((Date.now() - testStartTime) / 1000)
      : testConfig.durationMinutes * 60 - timeLeft;

    const report = ScoringEngine.evaluateTest(
      questions,
      userAnswers,
      elapsed,
      testConfig.mode
    );
    setFinalReport(report);
    setShowReportModal(true);
  };

  const timerMins = Math.floor(timeLeft / 60);
  const timerSecs = timeLeft % 60;
  const timerStr = `${String(timerMins).padStart(2, "0")}:${String(timerSecs).padStart(2, "0")}`;
  const isUrgent = timeLeft < 180; // less than 3 mins

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-950 text-slate-400">
        <Sparkles className="w-6 h-6 animate-spin text-indigo-400 mr-2" /> Loading assessment engine...
      </div>
    );
  }

  const currentAnswer = userAnswers[currentQ.id] || {};
  const isQuestionAnswered =
    !!currentAnswer.transcript || currentAnswer.selectedOptionIndex !== undefined;
  const maxReplays = testConfig.mode === "accenture_versant" ? 1 : 2;
  const replaysRemaining = maxReplays - (replaysUsedMap[currentQ.id] || 0);

  // Group sections to show tabs
  const uniqueSections = Array.from(new Set(questions.map((q) => q.sectionId)));

  // Calculate live WPM & Fillers from live transcript
  const rawWords = (liveTranscript || "").split(/\s+/).filter(Boolean);
  const liveWpm =
    recordingDuration > 0
      ? Math.round(rawWords.length / (recordingDuration / 60))
      : 0;
  const fillerMatch = (liveTranscript || "").match(/\b(um|uh|er|like|you know)\b/gi);
  const liveFillerCount = fillerMatch ? fillerMatch.length : 0;

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none antialiased overflow-hidden">
      {/* 1. Proctored Top Bar (Compact & Full Visibility) */}
      <header className="h-14 shrink-0 px-3 sm:px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between z-30 backdrop-blur-md">
        {/* Brand & Candidate Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/30 text-white font-black text-xs">
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>Accenture Versant &amp; SVAR</span>
                <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[9px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 uppercase">
                  Accenture Special
                </span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Candidate: <span className="text-slate-200 font-semibold">{candidateName}</span> • Proctored CBT Mode
            </p>
          </div>
        </div>

        {/* Center Timer */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold transition-all shadow-sm ${
              isUrgent
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse"
                : "bg-slate-950 border-slate-800 text-indigo-300"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{timerStr}</span>
          </div>

          {/* Mobile Question Palette Trigger */}
          <button
            onClick={() => setShowMobilePalette(true)}
            className="lg:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/20 border border-indigo-500/30 text-indigo-300"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Q {currentQIndex + 1}/{questions.length}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAudioCheck(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Audio Hardware Check"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sound Check</span>
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">Settings</span>
          </button>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
            title="Past Practice Attempts"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">History</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition"
            title="Toggle Proctored Fullscreen"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" /> <span className="hidden md:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" /> <span className="hidden md:inline">Fullscreen</span>
              </>
            )}
          </button>
          {onExit && (
            <button
              onClick={() => {
                if (window.confirm("Return to main dashboard? Current progress will be saved in your test history.")) {
                  onExit();
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Exit Assessment"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. Sub-Section Progress Tabs (Clean Horizontal Scrollbar) */}
      <div className="h-11 shrink-0 bg-slate-900/60 border-b border-slate-800/80 px-3 sm:px-6 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {uniqueSections.map((secId) => {
          const secDef = SVAR_SECTIONS.find((s) => s.id === secId);
          const qCountInSec = questions.filter((q) => q.sectionId === secId).length;
          const answeredInSec = questions.filter(
            (q) => q.sectionId === secId && (userAnswers[q.id]?.transcript || userAnswers[q.id]?.selectedOptionIndex !== undefined)
          ).length;
          const isCurrentSec = currentQ.sectionId === secId;

          // Short title for sleek display
          const displayLabel = secDef?.accentureEquivalent || secDef?.title.split("—")[1] || secId;

          return (
            <button
              key={secId}
              onClick={() => {
                const targetIdx = questions.findIndex((q) => q.sectionId === secId);
                if (targetIdx !== -1) setCurrentQIndex(targetIdx);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap border shrink-0 ${
                isCurrentSec
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                  : answeredInSec === qCountInSec
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <span className="text-xs">{secDef?.icon || "🎙️"}</span>
              <span className="text-[11px]">{displayLabel}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                  isCurrentSec ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                }`}
              >
                {answeredInSec}/{qCountInSec}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Examination Workspace (Fits within 100vh on Desktop, Smooth Scroll on Mobile) */}
      <div className="flex-1 min-h-0 w-full p-2.5 sm:p-4 overflow-hidden">
        <div className="h-full w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3.5 overflow-hidden">
          
          {/* Left Column: Active Question Card (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0 rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl p-3.5 sm:p-5 shadow-2xl overflow-hidden">
            
            {/* Top row: Q index pill + Section name + Status */}
            <div className="shrink-0 flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-black bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-300">
                  {currentQ.sectionId.replace(/_/g, " ").toUpperCase()}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-800/60 text-slate-400">
                  {currentQ.difficulty}
                </span>
              </div>

              {isQuestionAnswered ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Recorded
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Unanswered</span>
              )}
            </div>

            {/* AI Strategic Tip (Compact Banner) */}
            {currentQ.tip && (
              <div className="shrink-0 mb-2 py-1.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[11px] text-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">
                  <strong className="text-amber-300 font-bold">Tip: </strong>
                  {currentQ.tip}
                </span>
              </div>
            )}

            {/* Prompt Display Area (Center aligned, flex-1 min-h-0 overflow-y-auto) */}
            <div className="flex-1 min-h-0 flex flex-col justify-center items-center text-center px-2 py-2 overflow-y-auto">
              {/* 1. Reading */}
              {currentQ.sectionId === "reading" && (
                <div className="space-y-3 max-w-2xl mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Read the following sentence aloud clearly into the microphone:
                  </span>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 leading-relaxed tracking-normal selection:bg-indigo-500 selection:text-white">
                    &quot;{currentQ.targetText}&quot;
                  </p>
                  {currentQ.stressNote && (
                    <p className="text-xs text-indigo-300/90 italic">
                      Word Stress: {currentQ.stressNote}
                    </p>
                  )}
                </div>
              )}

              {/* 2. Repeat Sentences */}
              {currentQ.sectionId === "repeat_sentences" && (
                <div className="space-y-3 max-w-xl mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Listen to the audio sentence. After the beep, repeat it ditto:
                  </span>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={handlePlayAudioPrompt}
                      disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                        isPlayingAudioPrompt
                          ? "bg-indigo-600 text-white animate-pulse cursor-wait"
                          : replaysRemaining <= 0
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                      }`}
                    >
                      {isPlayingAudioPrompt ? (
                        <>
                          <Volume2 className="w-4 h-4 animate-spin" /> Playing Audio Sentence...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Play Audio Prompt ({replaysRemaining} replay remaining)
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400">
                      💡 Mic automatically turns ON right after the proctor beep!
                    </span>
                  </div>
                </div>
              )}

              {/* 3. Short Answers */}
              {currentQ.sectionId === "short_answers" && (
                <div className="space-y-3 max-w-xl mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Listen to the question. Answer directly in one or two words only:
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <p className="text-base sm:text-lg font-bold text-white mb-2">
                      {currentQ.questionText}
                    </p>
                    <button
                      onClick={handlePlayAudioPrompt}
                      disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                      className="flex items-center gap-1.5 mx-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen Audio ({replaysRemaining} left)
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Sentence Builds */}
              {currentQ.sectionId === "sentence_builds" && (
                <div className="space-y-3 max-w-xl mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Rearrange the 3 fragments mentally and speak the correct sentence:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {currentQ.jumbledFragments?.map((frag, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl text-sm font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 shadow-md"
                      >
                        {frag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={handlePlayAudioPrompt}
                    disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                    className="flex items-center gap-1.5 mx-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen Jumbled Audio ({replaysRemaining} left)
                  </button>
                </div>
              )}

              {/* 5. Story Retelling */}
              {currentQ.sectionId === "story_retelling" && (
                <div className="space-y-3 max-w-xl mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Listen to the narrative story, prepare for 30s, then summarize it:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={handlePlayAudioPrompt}
                      disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/20"
                    >
                      <Play className="w-4 h-4" /> Play Narrative Audio ({replaysRemaining} left)
                    </button>

                    {prepSecondsRemaining !== null ? (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        ⏳ Prep: {prepSecondsRemaining}s
                      </span>
                    ) : (
                      <button
                        onClick={handleStartPrepTimer}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition"
                      >
                        ⏱ Start 30s Prep
                      </button>
                    )}
                  </div>

                  {currentQ.storyPrompt && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-[10px] w-full">
                      <div className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-800">
                        <span className="text-slate-400 block font-bold">1. Character</span>
                        <span className="text-indigo-300 font-semibold truncate block">{currentQ.storyPrompt.character}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-800">
                        <span className="text-slate-400 block font-bold">2. Setting</span>
                        <span className="text-slate-200 truncate block">{currentQ.storyPrompt.setting}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-800">
                        <span className="text-slate-400 block font-bold">3. Conflict</span>
                        <span className="text-rose-300 truncate block">{currentQ.storyPrompt.conflict}</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-950/50 border border-slate-800">
                        <span className="text-slate-400 block font-bold">4. Resolution</span>
                        <span className="text-emerald-300 truncate block">{currentQ.storyPrompt.resolution}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. Open Speaking */}
              {currentQ.sectionId === "open_speaking" && (
                <div className="space-y-3 max-w-xl mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Spontaneous Speaking Topic (Speak for 45 to 60 seconds):
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    &quot;{currentQ.openTopic}&quot;
                  </h3>

                  <div className="flex justify-center">
                    {prepSecondsRemaining !== null ? (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        ⏳ Prep: {prepSecondsRemaining}s remaining
                      </span>
                    ) : (
                      <button
                        onClick={handleStartPrepTimer}
                        className="px-3.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition"
                      >
                        ⏱ Start 30s Prep Timer
                      </button>
                    )}
                  </div>

                  {currentQ.prepFormulaTips && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 w-full space-y-1 text-left">
                      <span className="font-bold text-indigo-400 block">PREP Framework Guide:</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div><strong className="text-white">P:</strong> {currentQ.prepFormulaTips.point}</div>
                        <div><strong className="text-white">R:</strong> {currentQ.prepFormulaTips.reason}</div>
                        <div><strong className="text-white">E:</strong> {currentQ.prepFormulaTips.example}</div>
                        <div><strong className="text-white">P:</strong> {currentQ.prepFormulaTips.summary}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 7 & 8: Listening & Grammar MCQs */}
              {(currentQ.sectionId === "listening_comp" || currentQ.sectionId === "grammar_correction") && (
                <div className="space-y-3 max-w-xl mx-auto w-full">
                  {currentQ.audioScript && (
                    <button
                      onClick={handlePlayAudioPrompt}
                      disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                      className="flex items-center gap-1.5 mx-auto px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md"
                    >
                      <Play className="w-3.5 h-3.5" /> Play Dialogue ({replaysRemaining} left)
                    </button>
                  )}

                  <p className="text-sm font-bold text-white text-left">
                    {currentQ.questionText}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {currentQ.options?.map((opt, oIdx) => {
                      const isSelected = currentAnswer.selectedOptionIndex === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(oIdx)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center gap-2.5 transition ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/20 text-white"
                              : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold font-mono text-[10px] ${
                              isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="truncate">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Speech Console & Big Recording Button (Always visible without scrolling) */}
            {currentQ.sectionId !== "listening_comp" && currentQ.sectionId !== "grammar_correction" && (
              <div className="shrink-0 pt-2 border-t border-slate-800/80 flex flex-col items-center gap-2">
                
                {/* Real-time telemetry (VU meter, WPM, and Filler Word Detector) */}
                {isRecording && (
                  <div className="w-full flex items-center justify-between gap-3 text-xs max-w-md">
                    {/* VU Level bar */}
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Mic:</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-75"
                          style={{ width: `${Math.min(100, Math.max(5, audioLevel))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-300 font-bold">{recordingDuration}s</span>
                      <span
                        className={`font-mono font-bold ${
                          liveWpm >= 115 && liveWpm <= 160 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        ⚡ {liveWpm} WPM
                      </span>
                    </div>

                    {liveFillerCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                        ⚠️ Filler Detected!
                      </span>
                    )}
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      <span>{activeRecordedAudioUrl ? "Re-record Response" : "Record Your Voice"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40 transition-all animate-pulse hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop Recording ({recordingDuration}s)</span>
                    </button>
                  )}

                  {activeRecordedAudioUrl && !isRecording && (
                    <button
                      onClick={() => {
                        const a = new Audio(activeRecordedAudioUrl);
                        a.play();
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition cursor-pointer"
                      title="Replay candidate voice recording"
                    >
                      <Play className="w-3.5 h-3.5" /> Replay Voice
                    </button>
                  )}
                </div>

                {/* Live transcript single-line / 2-line box */}
                {liveTranscript && (
                  <div className="w-full max-h-12 overflow-y-auto px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-200">
                    <span className="text-slate-500 font-bold mr-1.5">Transcript:</span>
                    {liveTranscript}
                  </div>
                )}

                {/* Pronunciation Word Match Tags */}
                {currentAnswer.wordDiffs && currentAnswer.wordDiffs.length > 0 && !isRecording && (
                  <div className="w-full flex items-center justify-between text-[10px] px-2 py-1 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">
                      Word Fidelity: <strong className="text-white">{currentAnswer.accuracy ?? 0}%</strong>
                    </span>
                    <div className="flex flex-wrap gap-1 max-w-md justify-end">
                      {currentAnswer.wordDiffs.slice(0, 8).map((d, i) => (
                        <span
                          key={i}
                          className={`px-1.5 py-0.2 rounded text-[9px] font-medium ${
                            d.status === "matched"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : d.status === "missing"
                              ? "bg-rose-500/20 text-rose-300 line-through"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {d.word}
                        </span>
                      ))}
                      {currentAnswer.wordDiffs.length > 8 && (
                        <span className="text-[9px] text-slate-500">+{currentAnswer.wordDiffs.length - 8} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Card Navigation Footer */}
            <div className="shrink-0 pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleFinishTest(false)}
                    className="flex items-center gap-1.5 px-5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Submit Assessment</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Question Navigator & Strategy Box (4 cols - Desktop Only) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col h-full min-h-0 space-y-3 overflow-hidden">
            
            {/* Question Navigator Palette */}
            <div className="flex-1 min-h-0 flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl p-3.5 shadow-xl overflow-hidden">
              <div className="shrink-0 flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Question Navigator
                </h3>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  {Object.keys(userAnswers).length} / {questions.length} Answered
                </span>
              </div>

              {/* Scrollable Palette Grid */}
              <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-6 gap-1.5 pr-1 scrollbar-thin">
                {questions.map((q, idx) => {
                  const isAnswered =
                    !!userAnswers[q.id]?.transcript ||
                    userAnswers[q.id]?.selectedOptionIndex !== undefined;
                  const isCurrent = idx === currentQIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-8 rounded-lg text-xs font-bold font-mono transition flex items-center justify-center ${
                        isCurrent
                          ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-900 scale-105"
                          : isAnswered
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                          : "bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="shrink-0 flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                  <span>Pending</span>
                </div>
              </div>

              {/* End Test Button */}
              <button
                onClick={() => handleFinishTest(false)}
                className="shrink-0 w-full mt-2.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                End Test &amp; View Scorecard
              </button>
            </div>

            {/* Strategic Hacks Box (Compact) */}
            <div className="shrink-0 rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl p-3 shadow-xl space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Accenture Versant Scoring Hacks</span>
              </div>
              <p className="text-slate-300 leading-snug">
                • <strong>Repeat Sentences:</strong> Never say &quot;um&quot; if you miss a word. Continue speech rhythm.
              </p>
              <p className="text-slate-300 leading-snug">
                • <strong>Short Answers:</strong> Speak only 1–2 words directly (e.g. &quot;At a beach&quot;).
              </p>
              <p className="text-slate-300 leading-snug">
                • <strong>Story Arc:</strong> Mention Character &rarr; Setting &rarr; Conflict &rarr; Resolution.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Question Palette Bottom Sheet / Modal */}
      {showMobilePalette && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in">
          <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Question Navigator ({Object.keys(userAnswers).length}/{questions.length})
              </span>
              <button
                onClick={() => setShowMobilePalette(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-6 gap-2 py-4">
              {questions.map((q, idx) => {
                const isAnswered =
                  !!userAnswers[q.id]?.transcript ||
                  userAnswers[q.id]?.selectedOptionIndex !== undefined;
                const isCurrent = idx === currentQIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQIndex(idx);
                      setShowMobilePalette(false);
                    }}
                    className={`h-9 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center ${
                      isCurrent
                        ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                        : isAnswered
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-950 text-slate-400 border border-slate-800"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setShowMobilePalette(false);
                handleFinishTest(false);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
            >
              Finish Assessment &amp; Generate Scorecard
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <SvarAudioCheckModal
        isOpen={showAudioCheck}
        onClose={() => setShowAudioCheck(false)}
      />

      <SvarConfigModal
        isOpen={showConfigModal}
        currentConfig={testConfig}
        onClose={() => setShowConfigModal(false)}
        onApplyConfig={(cfg) => {
          setTestConfig(cfg);
          initializeTest(cfg);
        }}
      />

      <SvarHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSelectAttempt={(att) => {
          setFinalReport(att);
          setShowReportModal(true);
        }}
      />

      <SvarReportModal
        isOpen={showReportModal}
        report={finalReport}
        candidateName={candidateName}
        onRetake={() => initializeTest(testConfig)}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};
