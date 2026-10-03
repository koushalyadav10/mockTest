import { describe, it, expect } from "vitest";
import {
  computeNextResponseState,
  calculatePaletteSummary,
  ResponseState,
} from "../lib/exam/state-machine";

describe("Question Response State Machine", () => {
  it("11. NOT_VISITED transitions to NOT_ANSWERED on first visit", () => {
    const next = computeNextResponseState({
      currentState: "NOT_VISITED",
      hasSelectedOption: false,
      action: "VISIT",
    });
    expect(next).toBe("NOT_ANSWERED");
  });

  it("12. Selecting an option marks question as ANSWERED", () => {
    const next = computeNextResponseState({
      currentState: "NOT_ANSWERED",
      hasSelectedOption: true,
      action: "SELECT_OPTION",
    });
    expect(next).toBe("ANSWERED");
  });

  it("13. Clearing response transitions ANSWERED back to NOT_ANSWERED", () => {
    const next = computeNextResponseState({
      currentState: "ANSWERED",
      hasSelectedOption: false,
      action: "CLEAR_RESPONSE",
    });
    expect(next).toBe("NOT_ANSWERED");
  });

  it("14. Marking for review without option marks as MARKED_FOR_REVIEW", () => {
    const next = computeNextResponseState({
      currentState: "NOT_ANSWERED",
      hasSelectedOption: false,
      action: "MARK_FOR_REVIEW",
    });
    expect(next).toBe("MARKED_FOR_REVIEW");
  });

  it("15. Marking for review with option marks as ANSWERED_AND_MARKED_FOR_REVIEW", () => {
    const next = computeNextResponseState({
      currentState: "ANSWERED",
      hasSelectedOption: true,
      action: "MARK_FOR_REVIEW",
    });
    expect(next).toBe("ANSWERED_AND_MARKED_FOR_REVIEW");
  });

  it("16. Palette summary accurately calculates counts across all 5 states", () => {
    const mockResponses: { responseState: ResponseState }[] = [
      { responseState: "NOT_VISITED" },
      { responseState: "NOT_VISITED" },
      { responseState: "NOT_ANSWERED" },
      { responseState: "ANSWERED" },
      { responseState: "ANSWERED" },
      { responseState: "ANSWERED" },
      { responseState: "MARKED_FOR_REVIEW" },
      { responseState: "ANSWERED_AND_MARKED_FOR_REVIEW" },
    ];

    const summary = calculatePaletteSummary(mockResponses);

    expect(summary.total).toBe(8);
    expect(summary.notVisited).toBe(2);
    expect(summary.notAnswered).toBe(1);
    expect(summary.answered).toBe(3);
    expect(summary.markedForReview).toBe(1);
    expect(summary.answeredAndMarkedForReview).toBe(1);
  });
});
