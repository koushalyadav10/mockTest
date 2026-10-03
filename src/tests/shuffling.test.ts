import { describe, it, expect } from "vitest";
import { safelyShuffleOptions, safelyShuffleQuestions } from "../lib/exam/shuffling";

describe("Safe Shuffling Engine", () => {
  it("5. Option shuffling preserves correct answer mapping with stableId", () => {
    // Original options
    // A = Delhi (false)
    // B = Mumbai (true, correct!)
    // C = Kolkata (false)
    // D = Chennai (false)
    const options = [
      { stableId: "opt_delhi", label: "A", text: "Delhi", isCorrect: false },
      { stableId: "opt_mumbai", label: "B", text: "Mumbai", isCorrect: true },
      { stableId: "opt_kolkata", label: "C", text: "Kolkata", isCorrect: false },
      { stableId: "opt_chennai", label: "D", text: "Chennai", isCorrect: false },
    ];

    // Run shuffle multiple times to test various permutations
    for (let trial = 0; trial < 10; trial++) {
      const shuffled = safelyShuffleOptions(options, true);

      // Verify all 4 options are present
      expect(shuffled).toHaveLength(4);

      // Find the correct option in the shuffled array
      const correctShuffled = shuffled.find((o) => o.isCorrect);

      // CRITICAL GUARANTEE: The option marked correct MUST remain 'Mumbai' and have stableId 'opt_mumbai'!
      expect(correctShuffled).toBeDefined();
      expect(correctShuffled?.stableId).toBe("opt_mumbai");
      expect(correctShuffled?.text).toBe("Mumbai");

      // Verify that display labels are sequentially reassigned (A, B, C, D)
      expect(shuffled.map((s) => s.displayLabel)).toEqual(["A", "B", "C", "D"]);
    }
  });

  it("6. Question shuffling preserves question identity and content", () => {
    const questions = [
      { id: "q1", text: "First question" },
      { id: "q2", text: "Second question" },
      { id: "q3", text: "Third question" },
      { id: "q4", text: "Fourth question" },
    ];

    const shuffled = safelyShuffleQuestions(questions, true);

    expect(shuffled).toHaveLength(4);
    const ids = new Set(shuffled.map((q) => q.id));
    expect(ids.has("q1")).toBe(true);
    expect(ids.has("q2")).toBe(true);
    expect(ids.has("q3")).toBe(true);
    expect(ids.has("q4")).toBe(true);
  });
});
