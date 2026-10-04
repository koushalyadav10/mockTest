import { describe, it, expect } from "vitest";
import { extractExamTag } from "../lib/exam/tag-parser";

describe("Exam Citation Tag Parser & Question Sanitizer", () => {
  it("extracts *(SSC CHSL 13/03/2023 Shift-01)* and isolates clean question text", () => {
    const raw = `The average of 10 consecutive integers is 33/2. What is the average of first three integers?

*(SSC CHSL 13/03/2023 Shift-01)*`;
    const res = extractExamTag(raw);
    expect(res.cleanQuestionText).toBe("The average of 10 consecutive integers is 33/2. What is the average of first three integers?");
    expect(res.examTag).toBe("SSC CHSL 13/03/2023 Shift-01");
  });

  it("extracts [SSC CGL 11/09/2024 (Shift-03)] with inner parentheses", () => {
    const raw = `If x + 1/x = 5, find x^2 + 1/x^2. [SSC CGL 11/09/2024 (Shift-03)]`;
    const res = extractExamTag(raw);
    expect(res.cleanQuestionText).toBe("If x + 1/x = 5, find x^2 + 1/x^2.");
    expect(res.examTag).toBe("SSC CGL 11/09/2024 (Shift-03)");
  });

  it("extracts *(SSC CGL TIER II 03/03/2023)* correctly", () => {
    const raw = `A shopkeeper offers 20% discount. *(SSC CGL TIER II 03/03/2023)*`;
    const res = extractExamTag(raw);
    expect(res.cleanQuestionText).toBe("A shopkeeper offers 20% discount.");
    expect(res.examTag).toBe("SSC CGL TIER II 03/03/2023");
  });

  it("handles fallback tag when no tag is embedded in text", () => {
    const raw = "What is the capital of India?";
    const res = extractExamTag(raw, "SSC MTS 2022");
    expect(res.cleanQuestionText).toBe("What is the capital of India?");
    expect(res.examTag).toBe("SSC MTS 2022");
  });

  it("returns null examTag when no tag and no fallback", () => {
    const raw = "What is the capital of India?";
    const res = extractExamTag(raw);
    expect(res.cleanQuestionText).toBe("What is the capital of India?");
    expect(res.examTag).toBeNull();
  });
});
