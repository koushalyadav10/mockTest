import { describe, it, expect } from "vitest";
import {
  filterMistakeQuestionIds,
  filterMarkedQuestionIds,
  filterUnattemptedQuestionIds,
  filterQuestionIdsByMode,
} from "../lib/exam/specialized-practice";

describe("Specialized Practice Mode Question Filtering", () => {
  const sampleResponses = [
    // Q1: Correct
    { questionId: "q1", selectedOptionStableId: "opt_1", isCorrect: true, responseState: "ANSWERED" },
    // Q2: Mistake (Selected option, but incorrect)
    { questionId: "q2", selectedOptionStableId: "opt_3", isCorrect: false, responseState: "ANSWERED" },
    // Q3: Marked for review + answered correctly
    { questionId: "q3", selectedOptionStableId: "opt_2", isCorrect: true, responseState: "ANSWERED_AND_MARKED_FOR_REVIEW" },
    // Q4: Marked for review without answering
    { questionId: "q4", selectedOptionStableId: null, isCorrect: null, responseState: "MARKED_FOR_REVIEW" },
    // Q5: Unattempted (Not visited)
    { questionId: "q5", selectedOptionStableId: null, isCorrect: null, responseState: "NOT_VISITED" },
    // Q6: Another mistake from an earlier attempt of same question
    { questionId: "q2", selectedOptionStableId: "opt_4", isCorrect: false, responseState: "ANSWERED" },
  ];

  it("24. Filters only incorrect mistake questions without duplicates", () => {
    const mistakes = filterMistakeQuestionIds(sampleResponses);
    expect(mistakes).toEqual(["q2"]);
  });

  it("25. Filters all marked questions regardless of answered state", () => {
    const marked = filterMarkedQuestionIds(sampleResponses);
    expect(marked).toContain("q3");
    expect(marked).toContain("q4");
    expect(marked.length).toBe(2);
  });

  it("26. Filters all unattempted questions cleanly", () => {
    const unattempted = filterUnattemptedQuestionIds(sampleResponses);
    expect(unattempted).toContain("q4");
    expect(unattempted).toContain("q5");
    expect(unattempted).not.toContain("q1");
    expect(unattempted).not.toContain("q2");
  });

  it("27. filterQuestionIdsByMode handles all modes systematically", () => {
    expect(filterQuestionIdsByMode("MISTAKES", sampleResponses)).toEqual(["q2"]);
    expect(filterQuestionIdsByMode("MARKED", sampleResponses)).toHaveLength(2);
    expect(filterQuestionIdsByMode("UNATTEMPTED", sampleResponses)).toHaveLength(2);
  });
});
