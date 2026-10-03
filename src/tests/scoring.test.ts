import { describe, it, expect } from "vitest";
import { evaluateTestAttempt } from "../lib/exam/scoring-engine";

describe("Authoritative Scoring Engine & Negative Marking", () => {
  const sscTier1Config = {
    marksPerCorrect: 2.0,
    negativeMarks: 0.5,
    totalMarks: 200,
  };

  it("1. Correct answer scoring (+2.0 for each correct)", () => {
    const items = [
      {
        questionId: "q1",
        selectedOptionStableId: "opt_A",
        correctOptionStableId: "opt_A",
        timeSpentSeconds: 30,
        responseState: "ANSWERED",
        subject: "Quantitative Aptitude",
        topic: "Percentage",
      },
      {
        questionId: "q2",
        selectedOptionStableId: "opt_B",
        correctOptionStableId: "opt_B",
        timeSpentSeconds: 45,
        responseState: "ANSWERED",
        subject: "Quantitative Aptitude",
        topic: "Profit & Loss",
      },
    ];

    const result = evaluateTestAttempt(items, sscTier1Config);

    expect(result.correctCount).toBe(2);
    expect(result.incorrectCount).toBe(0);
    expect(result.rawScore).toBe(4.0);
    expect(result.negativeMarksTotal).toBe(0.0);
    expect(result.finalScore).toBe(4.0);
    expect(result.accuracy).toBe(100);
  });

  it("2. Wrong answer scoring and negative marking deduction (-0.50 per wrong)", () => {
    const items = [
      {
        questionId: "q1",
        selectedOptionStableId: "opt_A",
        correctOptionStableId: "opt_A",
        timeSpentSeconds: 20,
        responseState: "ANSWERED",
        subject: "General Intelligence",
        topic: "Analogy",
      },
      {
        questionId: "q2",
        selectedOptionStableId: "opt_C", // Wrong answer
        correctOptionStableId: "opt_B",
        timeSpentSeconds: 50,
        responseState: "ANSWERED",
        subject: "General Intelligence",
        topic: "Series",
      },
    ];

    const result = evaluateTestAttempt(items, sscTier1Config);

    expect(result.correctCount).toBe(1);
    expect(result.incorrectCount).toBe(1);
    expect(result.rawScore).toBe(2.0);
    expect(result.negativeMarksTotal).toBe(0.5);
    expect(result.finalScore).toBe(1.5); // 2.0 - 0.5 = 1.5
    expect(result.accuracy).toBe(50);
  });

  it("3. Unattempted question scoring (0 penalty)", () => {
    const items = [
      {
        questionId: "q1",
        selectedOptionStableId: null, // Unattempted
        correctOptionStableId: "opt_A",
        timeSpentSeconds: 10,
        responseState: "NOT_ANSWERED",
        subject: "English Language",
        topic: "Spot the Error",
      },
      {
        questionId: "q2",
        selectedOptionStableId: null, // Not visited
        correctOptionStableId: "opt_C",
        timeSpentSeconds: 0,
        responseState: "NOT_VISITED",
        subject: "English Language",
        topic: "Synonyms",
      },
    ];

    const result = evaluateTestAttempt(items, sscTier1Config);

    expect(result.attemptedCount).toBe(0);
    expect(result.unattemptedCount).toBe(2);
    expect(result.rawScore).toBe(0);
    expect(result.negativeMarksTotal).toBe(0);
    expect(result.finalScore).toBe(0);
  });

  it("4. Configurable Tier 2 scoring (+3.0 / -1.0) with net negative handling", () => {
    const sscTier2Config = {
      marksPerCorrect: 3.0,
      negativeMarks: 1.0,
      totalMarks: 405,
    };

    const items = [
      {
        questionId: "q1",
        selectedOptionStableId: "opt_B",
        correctOptionStableId: "opt_A", // Wrong
        timeSpentSeconds: 40,
        responseState: "ANSWERED",
        subject: "Mathematics",
        topic: "Geometry",
      },
      {
        questionId: "q2",
        selectedOptionStableId: "opt_D",
        correctOptionStableId: "opt_C", // Wrong
        timeSpentSeconds: 35,
        responseState: "ANSWERED",
        subject: "Mathematics",
        topic: "Algebra",
      },
    ];

    const result = evaluateTestAttempt(items, sscTier2Config);

    expect(result.correctCount).toBe(0);
    expect(result.incorrectCount).toBe(2);
    expect(result.rawScore).toBe(0);
    expect(result.negativeMarksTotal).toBe(2.0);
    expect(result.finalScore).toBe(-2.0);
  });
});
