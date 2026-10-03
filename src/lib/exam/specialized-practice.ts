export type SpecializedPracticeMode = "MISTAKES" | "MARKED" | "UNATTEMPTED";

export interface ResponseRecordForFilter {
  questionId: string;
  selectedOptionStableId: string | null;
  isCorrect: boolean | null;
  responseState: string;
}

/**
 * Filters distinct question IDs where candidate answered incorrectly.
 */
export function filterMistakeQuestionIds(
  responses: ResponseRecordForFilter[]
): string[] {
  const ids = new Set<string>();
  for (const r of responses) {
    if (r.isCorrect === false && r.selectedOptionStableId) {
      ids.add(r.questionId);
    }
  }
  return Array.from(ids);
}

/**
 * Filters distinct question IDs marked for review (whether answered or unanswered).
 */
export function filterMarkedQuestionIds(
  responses: ResponseRecordForFilter[]
): string[] {
  const ids = new Set<string>();
  for (const r of responses) {
    if (
      r.responseState === "MARKED_FOR_REVIEW" ||
      r.responseState === "ANSWERED_AND_MARKED_FOR_REVIEW"
    ) {
      ids.add(r.questionId);
    }
  }
  return Array.from(ids);
}

/**
 * Filters distinct question IDs that were left unattempted.
 */
export function filterUnattemptedQuestionIds(
  responses: ResponseRecordForFilter[]
): string[] {
  const ids = new Set<string>();
  for (const r of responses) {
    const isUnattempted =
      !r.selectedOptionStableId ||
      r.responseState === "NOT_VISITED" ||
      r.responseState === "NOT_ANSWERED" ||
      r.responseState === "MARKED_FOR_REVIEW";
    if (isUnattempted) {
      ids.add(r.questionId);
    }
  }
  return Array.from(ids);
}

export function filterQuestionIdsByMode(
  mode: SpecializedPracticeMode,
  responses: ResponseRecordForFilter[]
): string[] {
  switch (mode) {
    case "MISTAKES":
      return filterMistakeQuestionIds(responses);
    case "MARKED":
      return filterMarkedQuestionIds(responses);
    case "UNATTEMPTED":
      return filterUnattemptedQuestionIds(responses);
    default:
      return [];
  }
}
