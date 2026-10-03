export interface ScoringConfig {
  marksPerCorrect: number;
  negativeMarks: number;
  totalMarks?: number;
}

export interface QuestionEvaluationItem {
  questionId: string;
  selectedOptionStableId: string | null;
  correctOptionStableId: string | null;
  timeSpentSeconds: number;
  responseState: string;
  subject: string;
  topic: string;
}

export interface EvaluationResult {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  markedCount: number;
  rawScore: number;
  negativeMarksTotal: number;
  finalScore: number;
  accuracy: number; // percentage 0 - 100
  attemptRate: number; // percentage 0 - 100
  totalTimeSeconds: number;
  averageTimePerQuestionSeconds: number;
  fastestQuestion: { questionId: string; seconds: number } | null;
  slowestQuestion: { questionId: string; seconds: number } | null;
  subjectBreakdown: Record<
    string,
    {
      total: number;
      attempted: number;
      correct: number;
      incorrect: number;
      unattempted: number;
      score: number;
      accuracy: number;
      averageTimeSeconds: number;
    }
  >;
}

export function evaluateTestAttempt(
  items: QuestionEvaluationItem[],
  config: ScoringConfig
): EvaluationResult {
  const { marksPerCorrect, negativeMarks } = config;

  let attemptedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let markedCount = 0;
  let totalTime = 0;

  let fastest: { questionId: string; seconds: number } | null = null;
  let slowest: { questionId: string; seconds: number } | null = null;

  const subjectMap: Record<
    string,
    {
      total: number;
      attempted: number;
      correct: number;
      incorrect: number;
      unattempted: number;
      score: number;
      totalTime: number;
    }
  > = {};

  for (const item of items) {
    totalTime += item.timeSpentSeconds;

    // Track fastest & slowest attempted questions
    if (
      item.selectedOptionStableId &&
      (!fastest || item.timeSpentSeconds < fastest.seconds)
    ) {
      fastest = { questionId: item.questionId, seconds: item.timeSpentSeconds };
    }
    if (
      item.selectedOptionStableId &&
      (!slowest || item.timeSpentSeconds > slowest.seconds)
    ) {
      slowest = { questionId: item.questionId, seconds: item.timeSpentSeconds };
    }

    if (!subjectMap[item.subject]) {
      subjectMap[item.subject] = {
        total: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        score: 0,
        totalTime: 0,
      };
    }
    const subj = subjectMap[item.subject];
    subj.total++;
    subj.totalTime += item.timeSpentSeconds;

    const isAnsweredState =
      item.responseState === "ANSWERED" ||
      item.responseState === "ANSWERED_AND_MARKED_FOR_REVIEW" ||
      Boolean(item.selectedOptionStableId);

    if (item.responseState.includes("MARKED")) {
      markedCount++;
    }

    if (isAnsweredState && item.selectedOptionStableId) {
      attemptedCount++;
      subj.attempted++;

      if (
        item.correctOptionStableId &&
        item.selectedOptionStableId === item.correctOptionStableId
      ) {
        correctCount++;
        subj.correct++;
        subj.score += marksPerCorrect;
      } else {
        incorrectCount++;
        subj.incorrect++;
        subj.score -= negativeMarks;
      }
    } else {
      unattemptedCount++;
      subj.unattempted++;
    }
  }

  const rawScore = Number((correctCount * marksPerCorrect).toFixed(2));
  const negativeMarksTotal = Number((incorrectCount * negativeMarks).toFixed(2));
  const finalScore = Number((rawScore - negativeMarksTotal).toFixed(2));

  const accuracy =
    attemptedCount > 0
      ? Number(((correctCount / attemptedCount) * 100).toFixed(1))
      : 0;

  const attemptRate =
    items.length > 0
      ? Number(((attemptedCount / items.length) * 100).toFixed(1))
      : 0;

  const avgTime =
    items.length > 0 ? Math.round(totalTime / items.length) : 0;

  const subjectBreakdown: EvaluationResult["subjectBreakdown"] = {};
  for (const [subjName, data] of Object.entries(subjectMap)) {
    subjectBreakdown[subjName] = {
      total: data.total,
      attempted: data.attempted,
      correct: data.correct,
      incorrect: data.incorrect,
      unattempted: data.unattempted,
      score: Number(data.score.toFixed(2)),
      accuracy:
        data.attempted > 0
          ? Number(((data.correct / data.attempted) * 100).toFixed(1))
          : 0,
      averageTimeSeconds:
        data.total > 0 ? Math.round(data.totalTime / data.total) : 0,
    };
  }

  return {
    totalQuestions: items.length,
    attemptedCount,
    correctCount,
    incorrectCount,
    unattemptedCount,
    markedCount,
    rawScore,
    negativeMarksTotal,
    finalScore,
    accuracy,
    attemptRate,
    totalTimeSeconds: totalTime,
    averageTimePerQuestionSeconds: avgTime,
    fastestQuestion: fastest,
    slowestQuestion: slowest,
    subjectBreakdown,
  };
}
