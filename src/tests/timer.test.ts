import { describe, it, expect } from "vitest";
import { calculateRemainingSeconds, formatSecondsToHHMMSS } from "../lib/exam/timer";

describe("Server-Authoritative Timer Engine", () => {
  it("7. Correctly calculates remaining seconds and detects active timer", () => {
    // 60 minutes exam started 10 minutes ago
    const startedAt = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const durationMinutes = 60;

    const result = calculateRemainingSeconds(startedAt, durationMinutes);

    // Remaining should be approximately 50 minutes (3000 seconds)
    expect(result.remainingSeconds).toBeGreaterThanOrEqual(2995);
    expect(result.remainingSeconds).toBeLessThanOrEqual(3001);
    expect(result.isExpired).toBe(false);
    expect(result.isLowTime).toBe(false);
  });

  it("8. Detects low time warning (under 5 minutes / 300 seconds)", () => {
    // 60 minutes exam started 56 minutes ago (4 mins left)
    const startedAt = new Date(Date.now() - 56 * 60 * 1000).toISOString();
    const durationMinutes = 60;

    const result = calculateRemainingSeconds(startedAt, durationMinutes);

    expect(result.remainingSeconds).toBeLessThanOrEqual(300);
    expect(result.isLowTime).toBe(true);
    expect(result.isExpired).toBe(false);
  });

  it("9. Detects expired test for auto-submission", () => {
    // 60 minutes exam started 61 minutes ago (expired!)
    const startedAt = new Date(Date.now() - 61 * 60 * 1000).toISOString();
    const durationMinutes = 60;

    const result = calculateRemainingSeconds(startedAt, durationMinutes);

    expect(result.remainingSeconds).toBe(0);
    expect(result.isExpired).toBe(true);
  });

  it("10. Formats time to HH:MM:SS and MM:SS cleanly with tabular digits", () => {
    expect(formatSecondsToHHMMSS(3665)).toBe("01:01:05");
    expect(formatSecondsToHHMMSS(2540)).toBe("42:20");
    expect(formatSecondsToHHMMSS(59)).toBe("00:59");
    expect(formatSecondsToHHMMSS(0)).toBe("00:00");
  });
});
