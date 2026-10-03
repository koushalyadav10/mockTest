export type MasteryStatus = "WEAK" | "MODERATE" | "STRONG" | "NOT_ENOUGH_DATA";

export type MatrixQuadrant =
  | "MASTERED" // High Accuracy, Fast Speed
  | "OVERTHINKING" // High Accuracy, Slow Speed
  | "RUSHING" // Low Accuracy, Fast Speed
  | "CRITICAL_GAP" // Low Accuracy, Slow Speed
  | "UNEVALUATED"; // Insufficient attempts (< 3)

export interface TopicPerformance {
  subject: string;
  topic: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  accuracy: number; // 0 - 100%
  averageTimeSeconds: number;
  masteryStatus: MasteryStatus;
  isWeakTopic: boolean; // True ONLY if attempted >= 3 AND accuracy < 65%
  confidenceMessage: string;
  recommendedPracticeCount: number;
  matrixQuadrant: MatrixQuadrant;
}

export interface KnowledgeSpeedMatrix {
  benchmarkSeconds: number; // Default: 50s for SSC CBT
  accuracyThreshold: number; // Default: 70%
  quadrants: {
    mastered: TopicPerformance[];
    overthinking: TopicPerformance[];
    rushing: TopicPerformance[];
    criticalGap: TopicPerformance[];
    unevaluated: TopicPerformance[];
  };
  summary: {
    totalTopics: number;
    masteredCount: number;
    overthinkingCount: number;
    rushingCount: number;
    criticalGapCount: number;
    unevaluatedCount: number;
  };
}

export const MIN_ATTEMPTS_FOR_DIAGNOSIS = 3;
export const DEFAULT_SPEED_BENCHMARK_SECONDS = 50;
export const DEFAULT_ACCURACY_THRESHOLD = 70;

export function analyzeTopicPerformance(
  questionsWithResults: {
    subject: string;
    topic: string;
    isAttempted: boolean;
    isCorrect: boolean;
    timeSpentSeconds?: number;
  }[],
  options: {
    minAttemptsThreshold?: number;
    benchmarkSeconds?: number;
    accuracyThreshold?: number;
  } = {}
): TopicPerformance[] {
  const minAttempts = options.minAttemptsThreshold ?? MIN_ATTEMPTS_FOR_DIAGNOSIS;
  const benchmarkSec = options.benchmarkSeconds ?? DEFAULT_SPEED_BENCHMARK_SECONDS;
  const accThreshold = options.accuracyThreshold ?? DEFAULT_ACCURACY_THRESHOLD;

  const map: Record<
    string,
    {
      subject: string;
      topic: string;
      total: number;
      attempted: number;
      correct: number;
      incorrect: number;
      totalTimeSeconds: number;
    }
  > = {};

  for (const q of questionsWithResults) {
    const key = `${q.subject}___${q.topic}`;
    if (!map[key]) {
      map[key] = {
        subject: q.subject,
        topic: q.topic,
        total: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        totalTimeSeconds: 0,
      };
    }
    const item = map[key];
    item.total++;
    item.totalTimeSeconds += q.timeSpentSeconds || 0;

    if (q.isAttempted) {
      item.attempted++;
      if (q.isCorrect) {
        item.correct++;
      } else {
        item.incorrect++;
      }
    }
  }

  const results: TopicPerformance[] = [];

  for (const item of Object.values(map)) {
    const unattempted = item.total - item.attempted;
    const accuracy =
      item.attempted > 0
        ? Number(((item.correct / item.attempted) * 100).toFixed(1))
        : 0;

    const avgTime =
      item.attempted > 0
        ? Math.round(item.totalTimeSeconds / item.attempted)
        : item.total > 0
        ? Math.round(item.totalTimeSeconds / item.total)
        : 0;

    // Statistically sound diagnostic threshold:
    // Requires >= 3 attempts before diagnosing weakness or mastery.
    let masteryStatus: MasteryStatus;
    let isWeakTopic = false;
    let confidenceMessage = "";
    let quadrant: MatrixQuadrant = "UNEVALUATED";

    if (item.attempted < minAttempts) {
      masteryStatus = "NOT_ENOUGH_DATA";
      isWeakTopic = false;
      confidenceMessage = `Requires at least ${minAttempts} attempts for diagnostic confidence (current: ${item.attempted})`;
      quadrant = "UNEVALUATED";
    } else {
      confidenceMessage = `Diagnosis based on ${item.attempted} attempts (${accuracy}% accuracy)`;
      if (accuracy < 65) {
        masteryStatus = "WEAK";
        isWeakTopic = true;
      } else if (accuracy >= 80) {
        masteryStatus = "STRONG";
        isWeakTopic = false;
      } else {
        masteryStatus = "MODERATE";
        isWeakTopic = false;
      }

      // 2D Knowledge vs Speed Matrix classification
      const isAccurate = accuracy >= accThreshold;
      const isFast = avgTime <= benchmarkSec;

      if (isAccurate && isFast) {
        quadrant = "MASTERED";
      } else if (isAccurate && !isFast) {
        quadrant = "OVERTHINKING";
      } else if (!isAccurate && isFast) {
        quadrant = "RUSHING";
      } else {
        quadrant = "CRITICAL_GAP";
      }
    }

    const recommendedCount = isWeakTopic
      ? Math.max(10, (item.incorrect + 1) * 5)
      : masteryStatus === "NOT_ENOUGH_DATA"
      ? Math.max(5, (minAttempts - item.attempted) * 3)
      : 0;

    results.push({
      subject: item.subject,
      topic: item.topic,
      totalQuestions: item.total,
      attempted: item.attempted,
      correct: item.correct,
      incorrect: item.incorrect,
      unattempted,
      accuracy,
      averageTimeSeconds: avgTime,
      masteryStatus,
      isWeakTopic,
      confidenceMessage,
      recommendedPracticeCount: recommendedCount,
      matrixQuadrant: quadrant,
    });
  }

  // Sort: weak topics first, then not enough data, then by accuracy ascending
  return results.sort((a, b) => {
    if (a.isWeakTopic && !b.isWeakTopic) return -1;
    if (!a.isWeakTopic && b.isWeakTopic) return 1;
    return a.accuracy - b.accuracy;
  });
}

export function computeKnowledgeSpeedMatrix(
  topics: TopicPerformance[],
  options: {
    benchmarkSeconds?: number;
    accuracyThreshold?: number;
  } = {}
): KnowledgeSpeedMatrix {
  const benchmarkSeconds = options.benchmarkSeconds ?? DEFAULT_SPEED_BENCHMARK_SECONDS;
  const accuracyThreshold = options.accuracyThreshold ?? DEFAULT_ACCURACY_THRESHOLD;

  const mastered: TopicPerformance[] = [];
  const overthinking: TopicPerformance[] = [];
  const rushing: TopicPerformance[] = [];
  const criticalGap: TopicPerformance[] = [];
  const unevaluated: TopicPerformance[] = [];

  for (const t of topics) {
    switch (t.matrixQuadrant) {
      case "MASTERED":
        mastered.push(t);
        break;
      case "OVERTHINKING":
        overthinking.push(t);
        break;
      case "RUSHING":
        rushing.push(t);
        break;
      case "CRITICAL_GAP":
        criticalGap.push(t);
        break;
      default:
        unevaluated.push(t);
        break;
    }
  }

  return {
    benchmarkSeconds,
    accuracyThreshold,
    quadrants: {
      mastered,
      overthinking,
      rushing,
      criticalGap,
      unevaluated,
    },
    summary: {
      totalTopics: topics.length,
      masteredCount: mastered.length,
      overthinkingCount: overthinking.length,
      rushingCount: rushing.length,
      criticalGapCount: criticalGap.length,
      unevaluatedCount: unevaluated.length,
    },
  };
}
