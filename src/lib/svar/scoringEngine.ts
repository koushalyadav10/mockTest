/**
 * SVAR & Accenture 100-Point Transparent Scoring Engine
 * 
 * Accurately models the Mercer Mettl & Pearson Versant AI evaluation metrics:
 * - Word Order Sequence Fidelity (Repeat Sentences)
 * - Concise 1-2 Word Direct Answers (Questions)
 * - Sentence Syntactic Reconstruction (Sentence Builds)
 * - 4-Anchor Story Arc (Story Retelling: Character, Setting, Conflict, Resolution)
 * - PREP Framework Coherence (Open Spontaneous Speaking)
 * - Articulation, Word Stress & Punctuation Pauses (Reading)
 */

import { SvarQuestion } from "./svarQuestionBank";
import { FluencyAnalysis, WordDiffItem } from "./speechService";

const HISTORY_STORAGE_KEY = "svar_practice_assessment_history_v2";

export interface CandidateAnswer {
  transcript?: string;
  audioUrl?: string | null;
  selectedOptionIndex?: number;
  accuracy?: number;
  wordDiffs?: WordDiffItem[];
  fluency?: FluencyAnalysis;
  durationSeconds?: number;
}

export interface QuestionEvaluationResult {
  id: string;
  globalIndex: number;
  sectionId: string;
  sectionTitle: string;
  type: string;
  difficulty: string;
  prompt: string;
  audioScript?: string;
  targetText?: string;
  userAnswer: CandidateAnswer;
  score: number;
  maxScore: number;
  isCorrect: boolean;
  feedback: string;
  explanation?: string;
}

export interface AccentureReadiness {
  probabilityPercent: number;
  verdict: "High Probability (Strong Pass)" | "Moderate (Borderline)" | "At Risk (Needs Focused Drills)";
  color: string;
  badgeBg: string;
  passLikelihood: string;
}

export interface SectionScoreItem {
  title: string;
  score: number;
  max: number;
  percentage: number;
}

export interface StudyPlanDay {
  day: number;
  focus: string;
  drills: string[];
  durationMinutes: number;
}

export interface SvarEvaluationResult {
  attemptId: string;
  timestamp: string;
  formattedDate: string;
  mode: "accenture_versant" | "svar_corporate";
  totalScore: number;
  accentureReadiness: AccentureReadiness;
  cefrLevel: string;
  cefrDescription: string;
  ratingColor: string;
  timeTakenSeconds: number;
  avgWpm: number;
  totalFillers: number;
  avgAccuracy: number;
  strongestSkill: string;
  weakestSkill: string;
  sectionScores: Record<string, SectionScoreItem>;
  recommendations: string[];
  studyPlan: StudyPlanDay[];
  questionResults: QuestionEvaluationResult[];
}

export class ScoringEngine {
  /**
   * Evaluate full test attempt and produce pro-grade diagnostic report
   */
  static evaluateTest(
    questions: SvarQuestion[],
    answers: Record<string, CandidateAnswer>,
    totalTimeSeconds = 0,
    mode: "accenture_versant" | "svar_corporate" = "accenture_versant"
  ): SvarEvaluationResult {
    const questionResults: QuestionEvaluationResult[] = [];

    // Group questions by section
    const sectionTotals: Record<string, { earned: number; max: number; count: number; title: string }> = {};

    // Section weight distributions (Total 100 pts)
    const weights: Record<string, number> =
      mode === "accenture_versant"
        ? {
            reading: 15,
            repeat_sentences: 25,
            short_answers: 15,
            sentence_builds: 15,
            story_retelling: 15,
            open_speaking: 15,
          }
        : {
            reading: 20,
            repeat_sentences: 20,
            listening_comp: 15,
            grammar_correction: 15,
            story_retelling: 15,
            open_speaking: 15,
          };

    // Calculate count per section in the current test
    const sectionQuestionCounts: Record<string, number> = {};
    questions.forEach((q) => {
      sectionQuestionCounts[q.sectionId] = (sectionQuestionCounts[q.sectionId] || 0) + 1;
    });

    let totalWpmSum = 0;
    let totalWpmCount = 0;
    let totalFillers = 0;
    let totalWordAccuracySum = 0;
    let totalWordAccuracyCount = 0;

    questions.forEach((q, idx) => {
      const ans = answers[q.id] || {};
      const secId = q.sectionId;
      const secTotalWeight = weights[secId] || 15;
      const countInSec = sectionQuestionCounts[secId] || 1;
      const qMax = Math.round((secTotalWeight / countInSec) * 10) / 10;

      let qScore = 0;
      let isCorrect = false;
      let feedback = "";

      const spoken = (ans.transcript || "").trim().toLowerCase();
      const wpm = ans.fluency?.wpm || 0;
      const fillers = ans.fluency?.fillerCount || 0;
      totalFillers += fillers;

      if (wpm > 0) {
        totalWpmSum += wpm;
        totalWpmCount++;
      }

      // 1. Reading
      if (secId === "reading") {
        const accuracy = ans.accuracy ?? 0;
        totalWordAccuracySum += accuracy;
        totalWordAccuracyCount++;
        qScore = (accuracy / 100) * qMax;
        isCorrect = accuracy >= 70;
        if (accuracy >= 85) {
          feedback = "Excellent pronunciation, natural stress, and clear consonant endings.";
        } else if (accuracy >= 60) {
          feedback = "Good comprehension; minor consonant drops or mispronounced stress.";
        } else {
          feedback = "Low text fidelity. Speak more clearly and enunciate each syllable.";
        }
      }

      // 2. Repeat Sentences (Versant High-Weight)
      else if (secId === "repeat_sentences") {
        const accuracy = ans.accuracy ?? 0;
        totalWordAccuracySum += accuracy;
        totalWordAccuracyCount++;

        // Versant scoring secret: AI rewards continuous rhythm even with missing words; "um" drops score
        let flowMultiplier = 1.0;
        if (fillers > 0) flowMultiplier -= Math.min(0.3, fillers * 0.1);
        if (wpm >= 115 && wpm <= 165) flowMultiplier += 0.05;

        qScore = Math.min(qMax, (accuracy / 100) * qMax * flowMultiplier);
        isCorrect = accuracy >= 75 && fillers === 0;

        if (fillers > 0) {
          feedback = `Detected ${fillers} filler words ("um/uh"). Remember the Golden Hack: if you forget a word, never pause or say "um"—keep flow steady!`;
        } else if (accuracy >= 85) {
          feedback = "Flawless repetition and pristine word-order recall.";
        } else {
          feedback = `Word accuracy: ${accuracy}%. Focus on maintaining speech momentum after the beep.`;
        }
      }

      // 3. Short Answers (Versant Direct 1-2 words rule)
      else if (secId === "short_answers") {
        const expected = (q.expectedShortAnswer || []).map((e) => e.toLowerCase().trim());
        const hasMatchedKeyword = expected.some((exp) => {
          const regex = new RegExp(`\\b${exp}\\b`, "i");
          return regex.test(spoken) || spoken.includes(exp);
        });

        const wordCount = (ans.transcript || "").split(/\s+/).filter(Boolean).length;
        if (hasMatchedKeyword) {
          if (wordCount <= 4) {
            // Perfect concise direct answer
            qScore = qMax;
            isCorrect = true;
            feedback = "Spot on! Direct, concise 1-2 words answer strictly adhering to Versant guidelines.";
          } else {
            // Gave answer but in too long of a sentence
            qScore = qMax * 0.8;
            isCorrect = true;
            feedback = `Correct concept identified, but answer was too wordy (${wordCount} words). Versant strictly rewards concise 1-2 words.`;
          }
        } else {
          qScore = 0;
          isCorrect = false;
          feedback = `Incorrect or unrecognizable answer. Expected direct answer: "${expected.join('" or "')}".`;
        }
      }

      // 4. Sentence Builds (Syntactic Reordering)
      else if (secId === "sentence_builds") {
        const targetClean = (q.correctSentence || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
        const spokenClean = spoken.replace(/[^a-z0-9 ]/g, "").trim();

        if (spokenClean === targetClean) {
          qScore = qMax;
          isCorrect = true;
          feedback = "Perfect sentence construction with correct grammatical ordering.";
        } else {
          const acc = ans.accuracy ?? 0;
          qScore = (acc / 100) * qMax;
          isCorrect = acc >= 75;
          feedback = isCorrect
            ? "Accurate grammatical reconstruction with minor phrase timing differences."
            : `Expected sequence: "${q.correctSentence}".`;
        }
      }

      // 5. Story Retelling (4-Anchor Arc: Character, Setting, Conflict, Resolution)
      else if (secId === "story_retelling") {
        const prompt = q.storyPrompt;
        let anchorPoints = 0;

        if (prompt) {
          const charClean = prompt.character.toLowerCase();
          const firstCharName = charClean.split(" ")[0];
          if (spoken.includes(firstCharName)) anchorPoints += 1;

          // Check for conflict keywords
          const conflictWords = prompt.conflict.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
          const hasConflict = conflictWords.some((w) => spoken.includes(w));
          if (hasConflict) anchorPoints += 1;

          // Check for resolution keywords
          const resWords = prompt.resolution.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
          const hasRes = resWords.some((w) => spoken.includes(w));
          if (hasRes) anchorPoints += 1;
        }

        const wordCount = (ans.transcript || "").split(/\s+/).filter(Boolean).length;
        const volumeFactor = Math.min(1.0, wordCount / 40); // 40+ words expected in 30s
        const anchorFactor = anchorPoints / 3;

        qScore = Math.min(qMax, ((anchorFactor * 0.6) + (volumeFactor * 0.4)) * qMax);
        isCorrect = anchorPoints >= 2 && wordCount >= 30;

        feedback =
          anchorPoints >= 2
            ? `Well-structured summary capturing ${anchorPoints}/3 core story milestones (Character, Conflict, Resolution).`
            : "Missing key story arc anchors. Remember the formula: Who (Character) -> Where (Setting) -> What went wrong (Conflict) -> How it resolved (Solution).";
      }

      // 6. Open Speaking (PREP Framework: Point, Reason, Example, Point Summary)
      else if (secId === "open_speaking") {
        const wordCount = (ans.transcript || "").split(/\s+/).filter(Boolean).length;
        const duration = ans.durationSeconds || 0;

        // PREP keywords
        const prepKeywords = ["believe", "opinion", "firstly", "because", "reason", "for example", "instance", "therefore", "in conclusion"];
        const prepHits = prepKeywords.filter((k) => spoken.includes(k)).length;

        const volumeScore = Math.min(1.0, wordCount / 50); // ~50+ words in 45-60s
        const durationScore = Math.min(1.0, duration / 35);
        const structureScore = Math.min(1.0, prepHits / 3);

        qScore = Math.min(qMax, ((volumeScore * 0.4) + (durationScore * 0.3) + (structureScore * 0.3)) * qMax);
        if (fillers >= 3) qScore = Math.max(0, qScore - qMax * 0.2);

        isCorrect = wordCount >= 40 && prepHits >= 1;
        feedback =
          wordCount >= 45
            ? "Comprehensive spontaneous speech adhering to clear structure and solid elaboration."
            : "Response was slightly brief. Use the PREP Framework (Point -> Reason -> Real-world Example -> Conclusion) to comfortably fill 45 seconds.";
      }

      // 7. Listening Comprehension (MCQs)
      else if (secId === "listening_comp") {
        isCorrect = ans.selectedOptionIndex === q.correctAnswer;
        qScore = isCorrect ? qMax : 0;
        feedback = isCorrect
          ? "Correct analytical interpretation of spoken audio."
          : `Incorrect. Expected Option ${String.fromCharCode(65 + (q.correctAnswer ?? 0))}.`;
      }

      // 8. Grammar Correction (MCQs)
      else if (secId === "grammar_correction") {
        isCorrect = ans.selectedOptionIndex === q.correctAnswer;
        qScore = isCorrect ? qMax : 0;
        feedback = isCorrect
          ? "Grammatically sound selection."
          : (q.rule || `Incorrect. Expected Option ${String.fromCharCode(65 + (q.correctAnswer ?? 0))}.`);
      }

      // Record question result
      const promptText =
        q.targetText ||
        q.audioScript ||
        q.questionText ||
        q.openTopic ||
        (q.jumbledFragments ? q.jumbledFragments.join(" / ") : "Spoken prompt");

      questionResults.push({
        id: q.id,
        globalIndex: idx + 1,
        sectionId: q.sectionId,
        sectionTitle: q.sectionId.replace(/_/g, " ").toUpperCase(),
        type: q.type,
        difficulty: q.difficulty,
        prompt: promptText,
        audioScript: q.audioScript,
        targetText: q.targetText || q.correctSentence,
        userAnswer: ans,
        score: Math.round(qScore * 10) / 10,
        maxScore: qMax,
        isCorrect,
        feedback,
        explanation: q.tip || q.rule || q.stressNote || "",
      });

      // Accumulate into section score
      if (!sectionTotals[secId]) {
        sectionTotals[secId] = {
          earned: 0,
          max: 0,
          count: 0,
          title: q.sectionId.replace(/_/g, " ").toUpperCase(),
        };
      }
      sectionTotals[secId].earned += qScore;
      sectionTotals[secId].max += qMax;
      sectionTotals[secId].count += 1;
    });

    // Build finalized section breakdown normalized to 100
    const sectionScores: Record<string, SectionScoreItem> = {};
    let totalScoreRaw = 0;

    Object.keys(sectionTotals).forEach((secId) => {
      const item = sectionTotals[secId];
      const normalizedScore = Math.min(item.max, Math.round(item.earned * 10) / 10);
      const percentage = item.max > 0 ? Math.round((normalizedScore / item.max) * 100) : 0;
      sectionScores[secId] = {
        title: item.title,
        score: normalizedScore,
        max: item.max,
        percentage,
      };
      totalScoreRaw += normalizedScore;
    });

    const totalScore = Math.min(100, Math.max(0, Math.round(totalScoreRaw)));

    // CEFR Level Mapping
    let cefrLevel = "B1 (Intermediate)";
    let cefrDescription =
      "Can comprehend standard spoken communication and express simple coherent responses with minor grammatical hesitations.";
    let ratingColor = "#f59e0b"; // Amber

    if (totalScore >= 88) {
      cefrLevel = "C2 (Mastery / Native Spoken Fluency)";
      cefrDescription =
        "Flawless articulation, near-zero filler words, effortless phrase structure, and natural corporate conversational pacing.";
      ratingColor = "#10b981"; // Emerald
    } else if (totalScore >= 75) {
      cefrLevel = "C1 (Advanced Corporate Professional)";
      cefrDescription =
        "Fluent and spontaneous expression with natural cadence. High structural integrity and minimal pause latency.";
      ratingColor = "#22c55e"; // Green
    } else if (totalScore >= 62) {
      cefrLevel = "B2 (Vantage / Upper Intermediate)";
      cefrDescription =
        "Solid conversational competence. Can communicate with sufficient spontaneity for professional client interaction.";
      ratingColor = "#3b82f6"; // Blue
    } else if (totalScore >= 45) {
      cefrLevel = "B1 (Threshold / Intermediate)";
      cefrDescription =
        "Communicates core ideas with minor grammatical slips and moderate pause hesitations. Requires pace stabilization.";
      ratingColor = "#f59e0b"; // Amber
    } else {
      cefrLevel = "A2 (Waystage / Pre-Intermediate)";
      cefrDescription =
        "Basic verbal comprehension; speech exhibits noticeable pause friction and fragmented clause formation.";
      ratingColor = "#ef4444"; // Red
    }

    // Accenture Readiness Index
    let accentureReadiness: AccentureReadiness;
    if (totalScore >= 75) {
      accentureReadiness = {
        probabilityPercent: Math.min(99, Math.round(75 + (totalScore - 75) * 0.96)),
        verdict: "High Probability (Strong Pass)",
        color: "#10b981",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        passLikelihood:
          "Outstanding! Your fluency, short answer precision, and memory retention align directly with Accenture's cut-off standards.",
      };
    } else if (totalScore >= 60) {
      accentureReadiness = {
        probabilityPercent: Math.round(55 + (totalScore - 60) * 1.25),
        verdict: "Moderate (Borderline)",
        color: "#f59e0b",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        passLikelihood:
          "Competitive, but on the boundary. Drill Repeat Sentences and eliminate filler words to secure a decisive pass.",
      };
    } else {
      accentureReadiness = {
        probabilityPercent: Math.max(20, Math.round(totalScore * 0.7)),
        verdict: "At Risk (Needs Focused Drills)",
        color: "#ef4444",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        passLikelihood:
          "Currently below safe clearing margins. Follow the 14-day study plan below to build speaking momentum.",
      };
    }

    // Identify Strongest & Weakest Skill
    const skillList = Object.keys(sectionScores).map((k) => ({
      name: sectionScores[k].title,
      pct: sectionScores[k].percentage,
    }));
    skillList.sort((a, b) => b.pct - a.pct);
    const strongestSkill = skillList[0]?.name || "Reading";
    const weakestSkill = skillList[skillList.length - 1]?.name || "Repeat Sentences";

    // Recommendations
    const recommendations: string[] = [];
    if (totalFillers >= 3) {
      recommendations.push(
        `Eliminate Filler Words: You used "${totalFillers}" fillers. Replace "um/uh" with a 1-second silent breath. Accenture AI penalizes fillers by up to 25%.`
      );
    }
    if (weakestSkill.includes("REPEAT")) {
      recommendations.push(
        "Accenture Repeat Sentences Secret: The AI checks word order. If you miss a word, never pause or repeat yourself; continue speaking with natural cadence."
      );
    }
    if (weakestSkill.includes("SHORT")) {
      recommendations.push(
        "Short Answers Rule: Speak only 1-2 words directly without framing full sentences (e.g. 'At a beach', not 'I think we find sand at a beach')."
      );
    }
    if (weakestSkill.includes("STORY")) {
      recommendations.push(
        "Story Arc Template: Always mention: 1. Character Name, 2. The Setting, 3. The Conflict, and 4. The Final Resolution."
      );
    }
    if (recommendations.length < 3) {
      recommendations.push(
        "Pacing Calibration: Maintain a steady 130 WPM speech rate. Speaking too fast clips consonants; speaking too slow signals hesitancy."
      );
    }

    // 14-Day Study Plan
    const studyPlan: StudyPlanDay[] = [
      {
        day: 1,
        focus: "Baseline Calibration & Sound Check",
        drills: ["Shadow 15 Reading sentences", "Check mic distance (chin height, 2 fingers away)"],
        durationMinutes: 20,
      },
      {
        day: 2,
        focus: "Repeat Sentences Momentum Drill",
        drills: ["Listen to 20 sentences and repeat without 'um'", "Practice the 3-word chunking memory technique"],
        durationMinutes: 25,
      },
      {
        day: 3,
        focus: "Short Answer Precision",
        drills: ["Complete 25 rapid-fire 1-2 word questions", "Train instinct to omit introductory fluff"],
        durationMinutes: 20,
      },
      {
        day: 4,
        focus: "Sentence Builds Grammatical Reconstruction",
        drills: ["Practice unscrambling 15 jumbled 3-phrase fragments mentally in under 2 seconds"],
        durationMinutes: 20,
      },
      {
        day: 5,
        focus: "Story Retelling 4-Anchor Formula",
        drills: ["Listen to 5 audio stories", "Lock Character -> Setting -> Conflict -> Resolution in memory"],
        durationMinutes: 30,
      },
      {
        day: 6,
        focus: "Open Speaking PREP Framework",
        drills: ["Deliver 3 spontaneous topics using Point -> Reason -> Example -> Point Summary"],
        durationMinutes: 25,
      },
      {
        day: 7,
        focus: "Full-Length Proctored Mock Test #1",
        drills: ["Run complete 6-section assessment in full screen with no interruptions"],
        durationMinutes: 30,
      },
      {
        day: 8,
        focus: "Filler Word Eradication",
        drills: ["Record yourself speaking for 60 seconds with strict zero 'um/uh/like' policy"],
        durationMinutes: 20,
      },
      {
        day: 9,
        focus: "Pace Metronome Stabilization (125-145 WPM)",
        drills: ["Read complex corporate paragraphs matching steady 130 WPM cadence"],
        durationMinutes: 20,
      },
      {
        day: 10,
        focus: "Listening Comprehension & Acoustic Clues",
        drills: ["Practice listening to British and American native dialogues at 1.1x speed"],
        durationMinutes: 25,
      },
      {
        day: 11,
        focus: "Repeat Sentences High-Difficulty Drill",
        drills: ["16 complex compound sentences with technical vocabulary"],
        durationMinutes: 25,
      },
      {
        day: 12,
        focus: "Spontaneous Fluency Expansion",
        drills: ["Practice impromptu speaking on abstract workplace topics (e.g. AI in Business)"],
        durationMinutes: 25,
      },
      {
        day: 13,
        focus: "Full-Length Proctored Mock Test #2",
        drills: ["Target score >= 80% to ensure safe Accenture clearance margin"],
        durationMinutes: 30,
      },
      {
        day: 14,
        focus: "Pre-Assessment Mindset & Voice Warm-up",
        drills: ["Vocal cord warm-ups (lip trills)", "Review golden answer templates"],
        durationMinutes: 15,
      },
    ];

    const avgWpm = totalWpmCount > 0 ? Math.round(totalWpmSum / totalWpmCount) : 130;
    const avgAccuracy = totalWordAccuracyCount > 0 ? Math.round(totalWordAccuracySum / totalWordAccuracyCount) : 85;

    const evaluationResult: SvarEvaluationResult = {
      attemptId: "svar_" + Date.now(),
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      mode,
      totalScore,
      accentureReadiness,
      cefrLevel,
      cefrDescription,
      ratingColor,
      timeTakenSeconds: totalTimeSeconds,
      avgWpm,
      totalFillers,
      avgAccuracy,
      strongestSkill,
      weakestSkill,
      sectionScores,
      recommendations,
      studyPlan,
      questionResults,
    };

    // Save to history
    this.saveToHistory(evaluationResult);

    return evaluationResult;
  }

  static saveToHistory(result: SvarEvaluationResult): void {
    if (typeof window === "undefined") return;
    try {
      const existing = this.getHistory();
      const updated = [result, ...existing].slice(0, 30);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to persist SVAR history to localStorage", e);
    }
  }

  static getHistory(): SvarEvaluationResult[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  static clearHistory(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }
}
