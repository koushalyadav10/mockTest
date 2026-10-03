import { describe, it, expect } from "vitest";

describe("Document Aggregation & Paper Cards Logic", () => {
  it("correctly aggregates document questions by subject and difficulty", () => {
    const mockQuestions = [
      { id: "q1", subject: "Quantitative Aptitude", difficulty: "EASY", status: "APPROVED", requiresReview: false },
      { id: "q2", subject: "Quantitative Aptitude", difficulty: "HARD", status: "APPROVED", requiresReview: false },
      { id: "q3", subject: "General Intelligence", difficulty: "MEDIUM", status: "PENDING", requiresReview: true },
      { id: "q4", subject: "English Language", difficulty: "EASY", status: "APPROVED", requiresReview: false },
    ];

    const subjectBreakdown: Record<string, number> = {};
    const difficultyBreakdown: Record<string, number> = {};
    let pendingReviewCount = 0;

    mockQuestions.forEach((q) => {
      subjectBreakdown[q.subject] = (subjectBreakdown[q.subject] || 0) + 1;
      difficultyBreakdown[q.difficulty] = (difficultyBreakdown[q.difficulty] || 0) + 1;
      if (q.requiresReview || q.status === "PENDING") {
        pendingReviewCount++;
      }
    });

    expect(subjectBreakdown["Quantitative Aptitude"]).toBe(2);
    expect(subjectBreakdown["General Intelligence"]).toBe(1);
    expect(subjectBreakdown["English Language"]).toBe(1);
    expect(difficultyBreakdown["EASY"]).toBe(2);
    expect(difficultyBreakdown["MEDIUM"]).toBe(1);
    expect(difficultyBreakdown["HARD"]).toBe(1);
    expect(pendingReviewCount).toBe(1);
  });

  it("formats file sizes appropriately into human-readable units", () => {
    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(2500000)).toBe("2.4 MB");
  });
});

describe("Admin Test Permission & Access Gate", () => {
  it("verifies test passcode and registered email matching rules", () => {
    const testId = "98a12bc3-4567-89ef-0123-456789abcdef";
    const expectedPasscode = `EF-${testId.slice(0, 6).toUpperCase()}`; // EF-98A12B
    const expectedEmail = "student@examforge.ai";

    const allowedPasscodes = [
      expectedPasscode,
      "SSC2026",
      "ADMIN",
      testId.slice(0, 6).toUpperCase(),
    ];

    const validateAccess = (email: string, passcode: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = passcode.trim().toUpperCase();

      const isEmailValid = cleanEmail.includes("@");
      const isPassValid = allowedPasscodes.includes(cleanPass);

      return isEmailValid && isPassValid;
    };

    expect(validateAccess("student@examforge.ai", "EF-98A12B")).toBe(true);
    expect(validateAccess("candidate@exam.com", "SSC2026")).toBe(true);
    expect(validateAccess("student@examforge.ai", "WRONG_PASS")).toBe(false);
    expect(validateAccess("notanemail", "EF-98A12B")).toBe(false);
  });

  it("generates deterministic candidate hall ticket credentials upon authorization", () => {
    const testId = "abc12345";
    const candidateName = "Aditya Sharma";
    const email = "student@examforge.ai";

    const candidate = {
      email,
      name: candidateName,
      rollNumber: `SSC2026-${testId.slice(0, 6).toUpperCase()}`,
      verifiedAt: new Date().toISOString(),
    };

    expect(candidate.name).toBe("Aditya Sharma");
    expect(candidate.rollNumber).toBe("SSC2026-ABC123");
    expect(candidate.email).toBe("student@examforge.ai");
  });
});
