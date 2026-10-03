import { describe, it, expect } from "vitest";
import {
  ExtractedQuestionSchema,
  DocumentExtractionResultSchema,
} from "../lib/ai/types";
import {
  computeTextSimilarity,
  findPotentialDuplicates,
} from "../lib/ai/duplicate-detector";

describe("AI Extraction Validation & Duplicate Detection", () => {
  it("17. Strictly validates conforming question JSON", () => {
    const validQuestion = {
      questionNumber: 1,
      language: "en",
      subject: "Quantitative Aptitude",
      topic: "Percentage",
      difficulty: "MEDIUM",
      questionText: "What is 20% of 450?",
      hasVisualContent: false,
      options: [
        { id: "opt_1", label: "A", text: "80", isCorrect: false },
        { id: "opt_2", label: "B", text: "90", isCorrect: true },
        { id: "opt_3", label: "C", text: "100", isCorrect: false },
        { id: "opt_4", label: "D", text: "110", isCorrect: false },
      ],
      sourceAnswer: "B",
      aiSuggestedAnswer: null,
      explanation: "20% of 450 = (20/100) * 450 = 90.",
      confidence: {
        question: 0.98,
        options: 0.98,
        classification: 0.95,
        answer: 1.0,
      },
      requiresReview: false,
      source: {
        page: 1,
      },
    };

    const parsed = ExtractedQuestionSchema.safeParse(validQuestion);
    expect(parsed.success).toBe(true);
  });

  it("18. Rejects malformed question with fewer than 2 options", () => {
    const invalidQuestion = {
      questionNumber: 2,
      language: "en",
      subject: "General Intelligence",
      topic: "Analogy",
      questionText: "Incomplete question with only one choice?",
      hasVisualContent: false,
      options: [{ id: "opt_1", label: "A", text: "Lonely option" }],
      confidence: { question: 0.9, options: 0.5, classification: 0.8, answer: 0.5 },
      requiresReview: true,
      source: { page: 1 },
    };

    const parsed = ExtractedQuestionSchema.safeParse(invalidQuestion);
    expect(parsed.success).toBe(false);
  });

  it("19. Rejects question with invalid subject category", () => {
    const invalidSubject = {
      questionNumber: 3,
      language: "en",
      subject: "Astrology & Palmistry", // Not a valid SSC subject!
      topic: "Horoscope",
      questionText: "What is your zodiac sign?",
      hasVisualContent: false,
      options: [
        { id: "opt_1", label: "A", text: "Aries" },
        { id: "opt_2", label: "B", text: "Taurus" },
      ],
      confidence: { question: 0.9, options: 0.8, classification: 0.5, answer: 0.5 },
      requiresReview: true,
      source: { page: 1 },
    };

    const parsed = ExtractedQuestionSchema.safeParse(invalidSubject);
    expect(parsed.success).toBe(false);
  });

  it("20. Text similarity and duplicate detection flags duplicate questions", () => {
    const originalText =
      "If the price of sugar increases by 25%, by what percentage must a household reduce its consumption?";
    const duplicateCandidate =
      "If the price of sugar increases by 25 %, by what percentage must a household reduce consumption?";
    const differentText =
      "In which year was the historic Dandi March led by Mahatma Gandhi from Sabarmati Ashram?";

    const simHigh = computeTextSimilarity(originalText, duplicateCandidate);
    const simLow = computeTextSimilarity(originalText, differentText);

    expect(simHigh).toBeGreaterThan(0.85);
    expect(simLow).toBeLessThan(0.3);

    const dupCheck = findPotentialDuplicates(duplicateCandidate, [
      { id: "q1", questionText: originalText },
    ]);
    expect(dupCheck.isDuplicate).toBe(true);
    expect(dupCheck.matchedQuestionId).toBe("q1");
  });
});
