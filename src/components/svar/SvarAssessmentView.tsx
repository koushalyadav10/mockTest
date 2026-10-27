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
  VolumeX,
  Shield,
  Layers,
  ChevronRight,
  LogOut,
  Info,
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

  // Modals
  const [showAudioCheck, setShowAudioCheck] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
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

  // Browser capability warning
  const [capabilities, setCapabilities] = useState<any>(null);

  // Toggle Fullscreen helper
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
    const caps = checkSpeechCapabilities();
    setCapabilities(caps);

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
        console.warn("Recording warning:", err);
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
        // In repeat sentences / sentence builds: trigger beep buzzer after audio prompt ends!
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
          // Synthesize proctor beep buzzer and auto start recording!
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
          ? `You have answered ${answeredCount} of ${total} questions. Are you sure you want to finish and generate your Accenture/SVAR diagnostic scorecard?`
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
      <div className="flex items-center justify-center min-h-[500px] text-slate-400">
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Proctored Top Bar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        {/* Brand & Candidate Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-sm">
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                Accenture Versant &amp; SVAR
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 uppercase">
                  Accenture Special
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Candidate: <span className="text-slate-200 font-semibold">{candidateName}</span> • Proctored Spoken CBT Engine
            </p>
          </div>
        </div>

        {/* Center Timer */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold transition-all shadow-md ${
              isUrgent
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse"
                : "bg-slate-950/80 border-slate-800 text-indigo-300"
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{timerStr}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowAudioCheck(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Audio Hardware Check"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Sound Check
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
            title="Assessment Settings"
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
            title="Practice History"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Past Attempts</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition"
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
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Exit Assessment"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Sub-Section Progress Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 overflow-x-auto flex items-center gap-2 scrollbar-none">
        {uniqueSections.map((secId) => {
          const secDef = SVAR_SECTIONS.find((s) => s.id === secId);
          const qCountInSec = questions.filter((q) => q.sectionId === secId).length;
          const answeredInSec = questions.filter(
            (q) => q.sectionId === secId && (userAnswers[q.id]?.transcript || userAnswers[q.id]?.selectedOptionIndex !== undefined)
          ).length;
          const isCurrentSec = currentQ.sectionId === secId;

          return (
            <button
              key={secId}
              onClick={() => {
                const targetIdx = questions.findIndex((q) => q.sectionId === secId);
                if (targetIdx !== -1) setCurrentQIndex(targetIdx);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                isCurrentSec
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                  : answeredInSec === qCountInSec
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              <span>{secDef?.icon || "🎙️"}</span>
              <span>{secDef?.accentureEquivalent || secDef?.title.split("—")[1] || secId}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isCurrentSec ? "bg-white/20 text-white" : "bg-slate-800 text-slate-300"
                }`}
              >
                {answeredInSec}/{qCountInSec}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Examination Workspace */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question Workspace (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-5 sm:p-6 shadow-xl flex-1 flex flex-col">
            {/* Question Top Info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300">
                  {currentQ.sectionId.replace(/_/g, " ").toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800/60 text-slate-400">
                  {currentQ.difficulty}
                </span>
              </div>

              {isQuestionAnswered && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Response Captured
                </span>
              )}
            </div>

            {/* Instruction / Strategic AI Tip */}
            {currentQ.tip && (
              <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-300">Accenture AI Scoring Tip: </strong>
                  <span>{currentQ.tip}</span>
                </div>
              </div>
            )}

            {/* Section Specific Prompts */}

            {/* 1. Reading: Display Sentence clearly */}
            {currentQ.sectionId === "reading" && (
              <div className="my-auto py-6 text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Read the following sentence aloud clearly:
                </span>
                <p className="text-xl sm:text-2xl font-bold text-white max-w-2xl mx-auto leading-relaxed">
                  &quot;{currentQ.targetText}&quot;
                </p>
                {currentQ.stressNote && (
                  <p className="text-xs text-indigo-300 italic">
                    Word Stress Note: {currentQ.stressNote}
                  </p>
                )}
              </div>
            )}

            {/* 2. Repeat Sentences: Audio Prompt -> Beep -> Repeat */}
            {currentQ.sectionId === "repeat_sentences" && (
              <div className="my-auto py-6 text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Listen to the sentence. After the beep, repeat it ditto:
                </span>
                <div className="flex flex-col items-center justify-center gap-3">
                  <button
                    onClick={handlePlayAudioPrompt}
                    disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition shadow-lg ${
                      isPlayingAudioPrompt
                        ? "bg-indigo-600 text-white animate-pulse cursor-wait"
                        : replaysRemaining <= 0
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                    }`}
                  >
                    {isPlayingAudioPrompt ? (
                      <>
                        <Volume2 className="w-5 h-5 animate-spin" /> Playing Audio Prompt...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" /> Play Audio Prompt ({replaysRemaining} replay left)
                      </>
                    )}
                  </button>
                  <span className="text-[11px] text-slate-400">
                    💡 The microphone will automatically activate right after the beep tone!
                  </span>
                </div>
              </div>
            )}

            {/* 3. Short Answers: Audio Question -> Direct 1-2 words */}
            {currentQ.sectionId === "short_answers" && (
              <div className="my-auto py-6 text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Listen to the question. Answer directly in one or two words only:
                </span>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 max-w-xl mx-auto">
                  <p className="text-lg font-bold text-white mb-3">
                    {currentQ.questionText}
                  </p>
                  <button
                    onClick={handlePlayAudioPrompt}
                    disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                    className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
                  >
                    <Volume2 className="w-4 h-4" /> Listen Audio ({replaysRemaining} left)
                  </button>
                </div>
              </div>
            )}

            {/* 4. Sentence Builds: 3 Jumbled fragments */}
            {currentQ.sectionId === "sentence_builds" && (
              <div className="my-auto py-6 text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Rearrange the 3 fragments mentally and speak the correct sentence:
                </span>
                <div className="flex flex-wrap items-center justify-center gap-3 max-w-xl mx-auto">
                  {currentQ.jumbledFragments?.map((frag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-xl text-base font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 shadow-md"
                    >
                      {frag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handlePlayAudioPrompt}
                  disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                  className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 transition"
                >
                  <Volume2 className="w-4 h-4" /> Listen Jumbled Audio ({replaysRemaining} left)
                </button>
              </div>
            )}

            {/* 5. Story Retelling: 30s prep -> summarize story */}
            {currentQ.sectionId === "story_retelling" && (
              <div className="my-auto py-4 space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Listen to the short narrative, prepare for 30s, then retell the story:
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 max-w-xl mx-auto flex flex-col items-center gap-3">
                  <button
                    onClick={handlePlayAudioPrompt}
                    disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
                  >
                    <Play className="w-4 h-4" /> Play Narrative Audio ({replaysRemaining} left)
                  </button>

                  {/* 30s Prep countdown */}
                  <div className="flex items-center gap-3 mt-1">
                    {prepSecondsRemaining !== null ? (
                      <span className="text-sm font-mono font-bold text-amber-400 animate-pulse">
                        ⏳ Preparation Time Remaining: {prepSecondsRemaining}s
                      </span>
                    ) : (
                      <button
                        onClick={handleStartPrepTimer}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition"
                      >
                        ⏱ Start 30s Prep Timer
                      </button>
                    )}
                  </div>
                </div>

                {currentQ.storyPrompt && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] max-w-xl mx-auto">
                    <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                      <span className="text-slate-400 block font-bold">1. Character</span>
                      <span className="text-indigo-300 font-semibold">{currentQ.storyPrompt.character}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                      <span className="text-slate-400 block font-bold">2. Setting</span>
                      <span className="text-slate-200">{currentQ.storyPrompt.setting}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                      <span className="text-slate-400 block font-bold">3. Conflict</span>
                      <span className="text-rose-300">{currentQ.storyPrompt.conflict}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                      <span className="text-slate-400 block font-bold">4. Resolution</span>
                      <span className="text-emerald-300">{currentQ.storyPrompt.resolution}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. Open Speaking: Topic -> 45-60s speaking */}
            {currentQ.sectionId === "open_speaking" && (
              <div className="my-auto py-4 space-y-4">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Spontaneous Speaking Topic (Speak for 45 to 60 seconds):
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 max-w-xl mx-auto">
                    &quot;{currentQ.openTopic}&quot;
                  </h3>
                </div>

                {/* 30s Prep timer */}
                <div className="flex justify-center">
                  {prepSecondsRemaining !== null ? (
                    <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                      ⏳ Prep Countdown: {prepSecondsRemaining}s remaining
                    </span>
                  ) : (
                    <button
                      onClick={handleStartPrepTimer}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition"
                    >
                      ⏱ Start 30s Prep Timer
                    </button>
                  )}
                </div>

                {currentQ.prepFormulaTips && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs max-w-xl mx-auto space-y-1.5">
                    <span className="font-bold text-indigo-400 block mb-1">
                      💡 PREP Framework Speaking Blueprint:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div><strong className="text-white">P (Point):</strong> {currentQ.prepFormulaTips.point}</div>
                      <div><strong className="text-white">R (Reason):</strong> {currentQ.prepFormulaTips.reason}</div>
                      <div><strong className="text-white">E (Example):</strong> {currentQ.prepFormulaTips.example}</div>
                      <div><strong className="text-white">P (Summary):</strong> {currentQ.prepFormulaTips.summary}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7 & 8: Listening & Grammar MCQs */}
            {(currentQ.sectionId === "listening_comp" || currentQ.sectionId === "grammar_correction") && (
              <div className="my-auto py-4 space-y-4">
                {currentQ.audioScript && (
                  <div className="text-center">
                    <button
                      onClick={handlePlayAudioPrompt}
                      disabled={isPlayingAudioPrompt || replaysRemaining <= 0}
                      className="flex items-center gap-2 mx-auto px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/20"
                    >
                      <Play className="w-4 h-4" /> Play Audio Dialogue ({replaysRemaining} left)
                    </button>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 max-w-xl mx-auto">
                  <p className="text-sm font-bold text-white mb-4">
                    {currentQ.questionText}
                  </p>

                  <div className="space-y-2">
                    {currentQ.options?.map((opt, oIdx) => {
                      const isSelected = currentAnswer.selectedOptionIndex === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(oIdx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/20 text-white"
                              : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold font-mono text-[11px] ${
                              isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Speech Recording Console (For all Spoken sections) */}
            {currentQ.sectionId !== "listening_comp" && currentQ.sectionId !== "grammar_correction" && (
              <div className="mt-auto pt-4 border-t border-slate-800/80">
                {/* Visualizer & Record button */}
                <div className="flex flex-col items-center gap-3">
                  {/* VU volume level meter */}
                  {isRecording && (
                    <div className="w-full max-w-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Mic Volume Level:</span>
                        <span className="font-mono text-emerald-400 font-bold">{audioLevel}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-75"
                          style={{ width: `${Math.min(100, Math.max(5, audioLevel))}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Big Record Button */}
                  <div className="flex items-center gap-4">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Mic className="w-5 h-5 group-hover:scale-110 transition" />
                        <span>{activeRecordedAudioUrl ? "Re-record Response" : "Record Your Voice"}</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-extrabold bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/40 transition-all animate-pulse hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Square className="w-5 h-5" />
                        <span>Stop Recording ({recordingDuration}s)</span>
                      </button>
                    )}

                    {/* Voice Replay button */}
                    {activeRecordedAudioUrl && !isRecording && (
                      <button
                        onClick={() => {
                          const a = new Audio(activeRecordedAudioUrl);
                          a.play();
                        }}
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition cursor-pointer"
                        title="Listen to what you just spoke"
                      >
                        <Play className="w-4 h-4" /> Replay Your Voice
                      </button>
                    )}
                  </div>

                  {/* Real-time speech telemetry */}
                  {isRecording && (
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300 font-mono">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> {recordingDuration}s
                      </span>
                      <span
                        className={`flex items-center gap-1.5 font-bold font-mono ${
                          liveWpm >= 115 && liveWpm <= 160 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        ⚡ {liveWpm} WPM (Ideal: 125-145)
                      </span>
                      {liveFillerCount > 0 && (
                        <span className="flex items-center gap-1 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 animate-bounce">
                          <AlertCircle className="w-3 h-3" /> {liveFillerCount} Filler Detected!
                        </span>
                      )}
                    </div>
                  )}

                  {/* Live speech recognition transcription */}
                  {liveTranscript && (
                    <div className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Live Speech Recognition:
                      </span>
                      <p className="text-slate-100 font-mono">
                        {liveTranscript}
                      </p>
                    </div>
                  )}

                  {/* Pronunciation word tags preview if already evaluated */}
                  {currentAnswer.wordDiffs && currentAnswer.wordDiffs.length > 0 && !isRecording && (
                    <div className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Pronunciation Word Match ({currentAnswer.accuracy ?? 0}% fidelity):
                        </span>
                        <span className="text-[11px] text-emerald-400 font-bold">
                          {(currentAnswer.accuracy ?? 0) >= 75 ? "Clear Articulation" : "Needs Syllable Drill"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentAnswer.wordDiffs.map((diff, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              diff.status === "matched"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : diff.status === "missing"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 line-through"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {diff.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleFinishTest(false)}
                    className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-600/30 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Navigator & Strategy Box (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Question Navigator Palette */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Question Navigator
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-400">
                {Object.keys(userAnswers).length} / {questions.length} Answered
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isAnswered =
                  !!userAnswers[q.id]?.transcript ||
                  userAnswers[q.id]?.selectedOptionIndex !== undefined;
                const isCurrent = idx === currentQIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center ${
                      isCurrent
                        ? "bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-105"
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
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <span>Pending</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={() => handleFinishTest(false)}
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
            >
              End Test &amp; View Scorecard
            </button>
          </div>

          {/* Accenture Versant Cheatsheet & Secret Hacks Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Accenture Versant Secret Hacks</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block font-semibold mb-0.5">Repeat Sentences:</strong>
                If you forget a word in between, never pause or say &quot;um&quot;! Continue speaking naturally; Versant gives partial marks for flow but 0 for pauses.
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block font-semibold mb-0.5">Short Answer Questions:</strong>
                Strictly 1-2 words only! (e.g. &quot;At a beach&quot;). Never frame full explanations.
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <strong className="text-white block font-semibold mb-0.5">Story Retelling Arc:</strong>
                Lock the 4 anchors in mind: Character Name &rarr; Setting &rarr; Conflict &rarr; Resolution.
              </div>
            </div>
          </div>
        </div>
      </div>

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
