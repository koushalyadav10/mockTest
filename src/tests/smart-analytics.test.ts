import { describe, it, expect } from "vitest";
import {
  analyzeTopicPerformance,
  computeKnowledgeSpeedMatrix,
  MIN_ATTEMPTS_FOR_DIAGNOSIS,
} from "../lib/exam/analytics-engine";

describe("Smart Analytics & 2D Knowledge-Speed Matrix", () => {
  it("21. Does not declare weak topic when attempts < 3 (insufficient statistical sample)", () => {
    // Only 1 attempt, which happened to be wrong
    const questions = [
      {
        subject: "Quantitative Aptitude",
        topic: "Trigonometry",
        isAttempted: true,
        isCorrect: false,
        timeSpentSeconds: 45,
      },
    ];

    const results = analyzeTopicPerformance(questions);
    expect(results.length).toBe(1);
    const trig = results[0];
    expect(trig.topic).toBe("Trigonometry");
    expect(trig.attempted).toBe(1);
    expect(trig.accuracy).toBe(0);
    // Crucial: Must NOT label as WEAK because sample < 3
    expect(trig.isWeakTopic).toBe(false);
    expect(trig.masteryStatus).toBe("NOT_ENOUGH_DATA");
    expect(trig.confidenceMessage).toContain("Requires at least 3 attempts");
    expect(trig.matrixQuadrant).toBe("UNEVALUATED");
  });

  it("22. Correctly classifies WEAK topic when attempts >= 3 and accuracy < 65%", () => {
    // 4 attempts, only 1 correct (25% accuracy)
    const questions = [
      { subject: "General Intelligence", topic: "Syllogism", isAttempted: true, isCorrect: true, timeSpentSeconds: 65 },
      { subject: "General Intelligence", topic: "Syllogism", isAttempted: true, isCorrect: false, timeSpentSeconds: 70 },
      { subject: "General Intelligence", topic: "Syllogism", isAttempted: true, isCorrect: false, timeSpentSeconds: 80 },
      { subject: "General Intelligence", topic: "Syllogism", isAttempted: true, isCorrect: false, timeSpentSeconds: 75 },
    ];

    const results = analyzeTopicPerformance(questions);
    expect(results.length).toBe(1);
    const syl = results[0];
    expect(syl.attempted).toBe(4);
    expect(syl.correct).toBe(1);
    expect(syl.accuracy).toBe(25);
    expect(syl.isWeakTopic).toBe(true);
    expect(syl.masteryStatus).toBe("WEAK");
    expect(syl.recommendedPracticeCount).toBeGreaterThanOrEqual(10);
    // Slow (>50s) and inaccurate (<70%) -> CRITICAL_GAP
    expect(syl.matrixQuadrant).toBe("CRITICAL_GAP");
  });

  it("23. Categorizes into 2D Knowledge-Speed Matrix quadrants appropriately", () => {
    const questions = [
      // Topic 1: Mastered (High accuracy 100%, Fast 30s)
      { subject: "English Language", topic: "Synonyms", isAttempted: true, isCorrect: true, timeSpentSeconds: 30 },
      { subject: "English Language", topic: "Synonyms", isAttempted: true, isCorrect: true, timeSpentSeconds: 25 },
      { subject: "English Language", topic: "Synonyms", isAttempted: true, isCorrect: true, timeSpentSeconds: 35 },

      // Topic 2: Overthinking (High accuracy 100%, Slow 90s)
      { subject: "Quantitative Aptitude", topic: "Time & Work", isAttempted: true, isCorrect: true, timeSpentSeconds: 90 },
      { subject: "Quantitative Aptitude", topic: "Time & Work", isAttempted: true, isCorrect: true, timeSpentSeconds: 85 },
      { subject: "Quantitative Aptitude", topic: "Time & Work", isAttempted: true, isCorrect: true, timeSpentSeconds: 95 },

      // Topic 3: Rushing (Low accuracy 33%, Fast 20s)
      { subject: "General Awareness", topic: "Current Affairs", isAttempted: true, isCorrect: false, timeSpentSeconds: 15 },
      { subject: "General Awareness", topic: "Current Affairs", isAttempted: true, isCorrect: true, timeSpentSeconds: 20 },
      { subject: "General Awareness", topic: "Current Affairs", isAttempted: true, isCorrect: false, timeSpentSeconds: 25 },
    ];

    const topicPerf = analyzeTopicPerformance(questions);
    const matrix = computeKnowledgeSpeedMatrix(topicPerf);

    expect(matrix.summary.totalTopics).toBe(3);
    expect(matrix.summary.masteredCount).toBe(1);
    expect(matrix.summary.overthinkingCount).toBe(1);
    expect(matrix.summary.rushingCount).toBe(1);

    expect(matrix.quadrants.mastered[0].topic).toBe("Synonyms");
    expect(matrix.quadrants.overthinking[0].topic).toBe("Time & Work");
    expect(matrix.quadrants.rushing[0].topic).toBe("Current Affairs");
  });
});
