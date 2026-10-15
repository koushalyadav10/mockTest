export interface TimerState {
  startedAt: string; // ISO string
  expiresAt: string; // ISO string
  durationSeconds: number;
  remainingSeconds: number;
  isExpired: boolean;
  isLowTime: boolean; // <= 5 minutes (300 seconds)
}

export function calculateRemainingSeconds(
  startedAtIso: string,
  durationMinutes: number
): { remainingSeconds: number; isExpired: boolean; isLowTime: boolean } {
  const startedAt = new Date(startedAtIso).getTime();
  const totalDurationMs = durationMinutes * 60 * 1000;
  const expiresAt = startedAt + totalDurationMs;
  const now = Date.now();

  const diffMs = expiresAt - now;
  const remainingSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const isExpired = remainingSeconds <= 0;
  const isLowTime = remainingSeconds <= 300 && remainingSeconds > 0;

  return { remainingSeconds, isExpired, isLowTime };
}

export function formatSecondsToHHMMSS(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Calculates the authoritative duration in minutes for an examination or test attempt.
 * Rule:
 * 1. If explicit duration is provided, use it.
 * 2. If it's a full test (all questions in one go / no custom range), use the master exam duration.
 * 3. If a subset or custom range of questions is taken (e.g. 10 Qs, 25 Qs):
 *    Allot 1.5 minutes per question (1.5X: e.g. 10 Qs -> 15 min, 25 Qs -> 38 min, 40 Qs -> 60 min).
 *    Capped between 5 minutes and master exam duration.
 */
export function getEffectiveDurationMinutes(
  questionCount: number,
  masterDurationMinutes: number,
  totalMasterQuestions?: number,
  explicitDurationMinutes?: number | null
): number {
  if (explicitDurationMinutes !== undefined && explicitDurationMinutes !== null && Number(explicitDurationMinutes) > 0) {
    return Number(explicitDurationMinutes);
  }

  const masterQCount = totalMasterQuestions || 0;
  // If whole test / full chapter in one go: give whole test time
  if (masterQCount > 0 && questionCount >= masterQCount) {
    return masterDurationMinutes || Math.max(10, Math.ceil(questionCount * 1.5));
  }

  // If questionCount is a subset (or custom range):
  if (questionCount > 0) {
    const proportionalMinutes = Math.ceil(questionCount * 1.5);
    if (masterDurationMinutes > 0) {
      return Math.min(masterDurationMinutes, Math.max(5, proportionalMinutes));
    }
    return Math.max(5, proportionalMinutes);
  }

  return masterDurationMinutes || 60;
}

