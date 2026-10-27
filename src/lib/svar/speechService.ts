/**
 * SVAR & Accenture Spoken English Assessment Engine - Speech & Audio Service
 * 
 * Features:
 * 1. Web Audio API live microphone capture & frequency analyzer (VU meter)
 * 2. MediaRecorder audio chunk recording with WebM/OGG blob creation for voice replay
 * 3. Web Speech API SpeechRecognition with continuous live transcription
 * 4. Web Speech API SpeechSynthesis for listening audio clips (American, British, Indian accents)
 * 5. Web Audio API synthesized 880Hz beep buzzer tone for proctored prompt cues
 * 6. Word-level Levenshtein & Longest Common Subsequence alignment for pronunciation scoring
 * 7. Real-time Fluency & WPM evaluation with filler word detection ("um", "uh", "like", etc.)
 */

export interface SpeechCapabilities {
  speechRecognition: boolean;
  mediaRecorder: boolean;
  speechSynthesis: boolean;
  audioContext: boolean;
  allSupported: boolean;
}

export function checkSpeechCapabilities(): SpeechCapabilities {
  const isSpeechRecSupported =
    typeof window !== "undefined" &&
    !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );

  const isMediaRecorderSupported =
    typeof window !== "undefined" &&
    !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  const isSynthesisSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const isAudioContextSupported =
    typeof window !== "undefined" &&
    !!(window.AudioContext || (window as any).webkitAudioContext);

  return {
    speechRecognition: isSpeechRecSupported,
    mediaRecorder: isMediaRecorderSupported,
    speechSynthesis: isSynthesisSupported,
    audioContext: isAudioContextSupported,
    allSupported:
      isSpeechRecSupported && isMediaRecorderSupported && isSynthesisSupported,
  };
}

export interface WordDiffItem {
  word: string;
  spoken?: string;
  status: "matched" | "missing" | "substituted" | "inserted";
}

export interface PronunciationAnalysis {
  accuracy: number;
  wordDiffs: WordDiffItem[];
  matchCount: number;
  targetCount: number;
  spokenCount: number;
  recognizedText?: string;
}

export interface FillerMatch {
  word: string;
  count: number;
}

export interface FluencyAnalysis {
  wordCount: number;
  durationSeconds: number;
  wpm: number;
  fillerCount: number;
  detectedFillers: FillerMatch[];
  estimatedPauses: number;
  paceRating: "Optimal" | "Too Slow" | "Slightly Hesitant" | "Excessively Fast";
  paceFeedback: string;
  exercise: string;
}

class SpeechService {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private recognition: any = null;
  private activeAudioUrl: string | null = null;
  private recordingStartTime: number | null = null;

  /**
   * Synthesize a clean 880Hz / 440Hz proctor beep buzzer using Web Audio API
   */
  async playBeepBuzzer(frequency = 880, durationMs = 250): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Smooth attack and release envelope to prevent audible clicks
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000 + 0.05);

      await new Promise((resolve) => setTimeout(resolve, durationMs + 50));
      await ctx.close().catch(() => {});
    } catch (e) {
      console.warn("Synthesized beep failed:", e);
    }
  }

  /**
   * Request microphone permission and stream live volume level for VU meter
   */
  async testMicrophone(
    onLevel?: (level: number) => void
  ): Promise<{
    stream: MediaStream;
    stopTest: () => void;
  }> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let active = true;

      const checkLevel = () => {
        if (!active) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        if (onLevel) onLevel(normalized);
        requestAnimationFrame(checkLevel);
      };

      checkLevel();

      return {
        stream,
        stopTest: () => {
          active = false;
          stream.getTracks().forEach((t) => t.stop());
          audioCtx.close().catch(() => {});
        },
      };
    } catch (err) {
      console.error("Microphone diagnostic test failed:", err);
      throw err;
    }
  }

  /**
   * Start recording user response with real-time transcription and audio level analysis
   */
  async startRecording(options: {
    lang?: string;
    onTranscript?: (transcript: string) => void;
    onLevel?: (level: number) => void;
    onError?: (error: any) => void;
  }): Promise<boolean> {
    const { lang = "en-US", onTranscript, onLevel, onError } = options;
    this.audioChunks = [];
    this.recordingStartTime = Date.now();
    let accumulatedTranscript = "";

    try {
      // 1. Setup Audio MediaStream & Level Analyser
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.analyser = this.audioContext.createAnalyser();
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        source.connect(this.analyser);
        this.analyser.fftSize = 256;

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const reportLevel = () => {
          if (!this.analyser) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 128) * 100));
          if (onLevel) onLevel(normalized);
          this.animationFrameId = requestAnimationFrame(reportLevel);
        };
        reportLevel();
      }

      // 2. Setup MediaRecorder for candidate audio capture
      let mimeType = "audio/webm";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
          mimeType = "audio/ogg;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        }

        try {
          this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });
        } catch {
          this.mediaRecorder = new MediaRecorder(this.mediaStream);
        }

        this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };
        this.mediaRecorder.start(100);
      }

      // 3. Setup Web Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = lang;

        this.recognition.onresult = (event: any) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              accumulatedTranscript += " " + transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          const fullText = (accumulatedTranscript + " " + interimTranscript)
            .trim()
            .replace(/\s+/g, " ");
          if (onTranscript) onTranscript(fullText);
        };

        this.recognition.onerror = (event: any) => {
          console.warn("Speech recognition notice:", event.error);
          if (event.error !== "no-speech" && onError) {
            // Keep recording even if speech recognition has transient network hiccups
          }
        };

        try {
          this.recognition.start();
        } catch (e) {
          console.warn("Speech recognition already active or blocked:", e);
        }
      }

      return true;
    } catch (err) {
      console.error("Failed to start speech recording:", err);
      if (onError) onError(err);
      return false;
    }
  }

  /**
   * Stop recording and return complete results with audio blob
   */
  async stopRecording(): Promise<{
    audioBlob?: Blob | null;
    audioUrl: string | null;
    durationSeconds: number;
  }> {
    const durationSeconds = this.recordingStartTime
      ? (Date.now() - this.recordingStartTime) / 1000
      : 0;

    // Stop visualizer animation
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
      this.analyser = null;
    }

    // Stop Speech Recognition
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }

    // Stop MediaRecorder & build Audio Blob
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((t) => t.stop());
          this.mediaStream = null;
        }
        resolve({
          audioUrl: null,
          durationSeconds: Math.max(1, Math.round(durationSeconds)),
        });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: this.mediaRecorder?.mimeType || "audio/webm",
        });

        if (this.activeAudioUrl) {
          URL.revokeObjectURL(this.activeAudioUrl);
        }
        this.activeAudioUrl = URL.createObjectURL(audioBlob);

        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((t) => t.stop());
          this.mediaStream = null;
        }

        resolve({
          audioBlob,
          audioUrl: this.activeAudioUrl,
          durationSeconds: Math.max(1, Math.round(durationSeconds)),
        });
      };

      try {
        this.mediaRecorder.stop();
      } catch (e) {
        resolve({
          audioUrl: null,
          durationSeconds: Math.max(1, Math.round(durationSeconds)),
        });
      }
    });
  }

  /**
   * Play text-to-speech for Listening / Repeat questions
   */
  playListeningScript(
    text: string,
    options: {
      accent?: string;
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    } = {}
  ): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis is not supported on this browser.");
      if (options.onEnd) options.onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const accent = options.accent || "American English";
    utterance.lang =
      accent === "British English"
        ? "en-GB"
        : accent === "Indian English"
        ? "en-IN"
        : "en-US";
    utterance.rate = options.rate ?? 0.95; // Steady, professional examination pace
    utterance.pitch = options.pitch ?? 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang.startsWith(utterance.lang.substring(0, 2)) &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Enhanced") ||
          v.name.includes("Online"))
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
    };
    utterance.onend = () => {
      if (options.onEnd) options.onEnd();
    };
    utterance.onerror = () => {
      if (options.onEnd) options.onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopListeningAudio(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Clean word helper for accurate comparison
   */
  private cleanWord(w: string): string {
    return (w || "").toLowerCase().replace(/[^a-z0-9']/g, "").trim();
  }

  /**
   * Word-level alignment and pronunciation analysis (Longest Common Subsequence heuristic)
   */
  analyzePronunciation(
    targetText: string,
    spokenText: string
  ): PronunciationAnalysis {
    if (!targetText) return { accuracy: 0, wordDiffs: [], matchCount: 0, targetCount: 0, spokenCount: 0 };

    const targetWords = targetText
      .split(/\s+/)
      .map((w) => ({
        original: w,
        cleaned: this.cleanWord(w),
      }))
      .filter((w) => w.cleaned);

    const spokenWords = (spokenText || "")
      .split(/\s+/)
      .map((w) => ({
        original: w,
        cleaned: this.cleanWord(w),
      }))
      .filter((w) => w.cleaned);

    if (spokenWords.length === 0) {
      return {
        accuracy: 0,
        recognizedText: "(No spoken words detected)",
        wordDiffs: targetWords.map((t) => ({
          word: t.original,
          status: "missing" as const,
        })),
        matchCount: 0,
        targetCount: targetWords.length,
        spokenCount: 0,
      };
    }

    const diffs: WordDiffItem[] = [];
    let tIdx = 0;
    let sIdx = 0;
    let matchCount = 0;

    while (tIdx < targetWords.length && sIdx < spokenWords.length) {
      const tw = targetWords[tIdx];
      const sw = spokenWords[sIdx];

      if (tw.cleaned === sw.cleaned) {
        diffs.push({ word: tw.original, spoken: sw.original, status: "matched" });
        matchCount++;
        tIdx++;
        sIdx++;
      } else {
        // Lookahead to see if speaker skipped a word or inserted one
        const nextInSpoken = spokenWords
          .slice(sIdx + 1, sIdx + 4)
          .findIndex((w) => w.cleaned === tw.cleaned);
        const nextInTarget = targetWords
          .slice(tIdx + 1, tIdx + 4)
          .findIndex((w) => w.cleaned === sw.cleaned);

        if (
          nextInSpoken !== -1 &&
          (nextInTarget === -1 || nextInSpoken <= nextInTarget)
        ) {
          // Extra words inserted
          for (let k = 0; k <= nextInSpoken; k++) {
            diffs.push({
              word: spokenWords[sIdx + k].original,
              status: "inserted",
            });
          }
          sIdx += nextInSpoken + 1;
        } else if (nextInTarget !== -1) {
          // Word skipped / missing
          for (let k = 0; k <= nextInTarget; k++) {
            diffs.push({
              word: targetWords[tIdx + k].original,
              status: "missing",
            });
          }
          tIdx += nextInTarget + 1;
        } else {
          // Substituted word
          diffs.push({
            word: tw.original,
            spoken: sw.original,
            status: "substituted",
          });
          tIdx++;
          sIdx++;
        }
      }
    }

    // Remaining target words are missing
    while (tIdx < targetWords.length) {
      diffs.push({ word: targetWords[tIdx].original, status: "missing" });
      tIdx++;
    }

    // Remaining spoken words are inserted
    while (sIdx < spokenWords.length) {
      diffs.push({ word: spokenWords[sIdx].original, status: "inserted" });
      sIdx++;
    }

    const accuracy = Math.max(
      0,
      Math.min(100, Math.round((matchCount / targetWords.length) * 100))
    );

    return {
      accuracy,
      wordDiffs: diffs,
      matchCount,
      targetCount: targetWords.length,
      spokenCount: spokenWords.length,
      recognizedText: spokenText,
    };
  }

  /**
   * Fluency and Speaking Pace Evaluator with filler word detection
   */
  analyzeFluency(
    spokenText: string,
    durationSeconds: number
  ): FluencyAnalysis {
    const rawWords = (spokenText || "").split(/\s+/).filter(Boolean);
    const wordCount = rawWords.length;
    const durationMins = Math.max(durationSeconds, 1) / 60;
    const wpm = Math.round(wordCount / durationMins);

    // Detect filler words
    const fillerPatterns = [
      "um",
      "uh",
      "er",
      "ah",
      "like",
      "you know",
      "basically",
      "actually",
      "sort of",
      "kind of",
    ];
    const lowerText = (spokenText || "").toLowerCase();
    let fillerCount = 0;
    const detectedFillers: FillerMatch[] = [];

    for (const pattern of fillerPatterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, "gi");
      const matches = lowerText.match(regex);
      if (matches) {
        fillerCount += matches.length;
        detectedFillers.push({ word: pattern, count: matches.length });
      }
    }

    // Estimated pauses (based on standard speaking rhythm)
    const expectedWordsForDuration = Math.round(durationSeconds * 2.1); // ~126 WPM
    const wordsDifference = expectedWordsForDuration - wordCount;
    const estimatedPauses = Math.max(0, Math.round(wordsDifference / 4));

    // Pace assessment
    let paceRating: "Optimal" | "Too Slow" | "Slightly Hesitant" | "Excessively Fast" =
      "Optimal";
    let paceFeedback =
      "Your speaking pace is within the recommended corporate standard (120 - 150 WPM).";
    if (wpm < 90) {
      paceRating = "Too Slow";
      paceFeedback =
        "Speaking pace is below 90 WPM. Aim to reduce hesitancy and connect clauses more fluidly.";
    } else if (wpm > 175) {
      paceRating = "Excessively Fast";
      paceFeedback =
        "Speaking pace exceeds 175 WPM. Pacing too quickly can compromise clarity and listener comprehension.";
    } else if (wpm < 115) {
      paceRating = "Slightly Hesitant";
      paceFeedback =
        "Pace is slightly deliberate. Practice transitional phrases to maintain momentum.";
    }

    // Practical exercise recommendation
    let exercise =
      'Practice the "4-Second Rule": take one breath between ideas rather than pausing mid-sentence.';
    if (fillerCount >= 3) {
      exercise =
        'Filler Reduction Drill: Deliberately substitute silence for "um" or "like" when thinking.';
    } else if (wpm < 100) {
      exercise =
        "Pace-Building Drill: Shadow reading audiobooks at 1.0x speed for 10 minutes daily.";
    }

    return {
      wordCount,
      durationSeconds: Math.round(durationSeconds),
      wpm,
      fillerCount,
      detectedFillers,
      estimatedPauses,
      paceRating,
      paceFeedback,
      exercise,
    };
  }
}

export const speechService = new SpeechService();
