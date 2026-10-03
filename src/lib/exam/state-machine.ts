export type ExamStatus =
  | "NOT_STARTED"
  | "INSTRUCTIONS"
  | "RUNNING"
  | "SECTION_TRANSITION"
  | "SUBMIT_CONFIRMATION"
  | "SUBMITTED"
  | "EVALUATED";

export type ResponseState =
  | "NOT_VISITED"
  | "NOT_ANSWERED"
  | "ANSWERED"
  | "MARKED_FOR_REVIEW"
  | "ANSWERED_AND_MARKED_FOR_REVIEW";

export interface QuestionPaletteSummary {
  notVisited: number;
  notAnswered: number;
  answered: number;
  markedForReview: number;
  answeredAndMarkedForReview: number;
  total: number;
}

/**
 * Deterministic Question State Transition Engine
 */
export function computeNextResponseState(params: {
  currentState: ResponseState;
  hasSelectedOption: boolean;
  action: "VISIT" | "SELECT_OPTION" | "CLEAR_RESPONSE" | "MARK_FOR_REVIEW" | "SAVE_AND_NEXT";
}): ResponseState {
  const { currentState, hasSelectedOption, action } = params;

  switch (action) {
    case "VISIT":
      if (currentState === "NOT_VISITED") {
        return "NOT_ANSWERED";
      }
      return currentState;

    case "CLEAR_RESPONSE":
      return currentState === "MARKED_FOR_REVIEW" ||
        currentState === "ANSWERED_AND_MARKED_FOR_REVIEW"
        ? "MARKED_FOR_REVIEW"
        : "NOT_ANSWERED";

    case "MARK_FOR_REVIEW":
      if (hasSelectedOption) {
        return "ANSWERED_AND_MARKED_FOR_REVIEW";
      }
      return "MARKED_FOR_REVIEW";

    case "SAVE_AND_NEXT":
    case "SELECT_OPTION":
      if (hasSelectedOption) {
        if (
          currentState === "MARKED_FOR_REVIEW" ||
          currentState === "ANSWERED_AND_MARKED_FOR_REVIEW"
        ) {
          return "ANSWERED_AND_MARKED_FOR_REVIEW";
        }
        return "ANSWERED";
      }
      return "NOT_ANSWERED";

    default:
      return currentState;
  }
}

/**
 * Aggregates state counts for the Question Palette
 */
export function calculatePaletteSummary(
  responses: { responseState: ResponseState }[]
): QuestionPaletteSummary {
  const summary: QuestionPaletteSummary = {
    notVisited: 0,
    notAnswered: 0,
    answered: 0,
    markedForReview: 0,
    answeredAndMarkedForReview: 0,
    total: responses.length,
  };

  for (const r of responses) {
    switch (r.responseState) {
      case "NOT_VISITED":
        summary.notVisited++;
        break;
      case "NOT_ANSWERED":
        summary.notAnswered++;
        break;
      case "ANSWERED":
        summary.answered++;
        break;
      case "MARKED_FOR_REVIEW":
        summary.markedForReview++;
        break;
      case "ANSWERED_AND_MARKED_FOR_REVIEW":
        summary.answeredAndMarkedForReview++;
        break;
    }
  }

  return summary;
}
