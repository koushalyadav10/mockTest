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
