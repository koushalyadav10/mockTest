export interface ShufflableOption {
  stableId: string;
  label: string; // Original or display label A, B, C, D
  text: string;
  isCorrect?: boolean;
}

export interface ShuffledOptionResult {
  stableId: string;
  displayLabel: string; // "A", "B", "C", "D"
  text: string;
  isCorrect?: boolean;
}

/**
 * Fisher-Yates array shuffling
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Safely shuffles options while guaranteeing that the correct answer pointer
 * remains tied to the stable option ID.
 */
export function safelyShuffleOptions(
  options: ShufflableOption[],
  enableShuffle = true
): ShuffledOptionResult[] {
  const workingOptions = enableShuffle ? shuffleArray(options) : [...options];
  const standardLabels = ["A", "B", "C", "D", "E"];

  return workingOptions.map((opt, index) => ({
    stableId: opt.stableId,
    displayLabel: standardLabels[index] || String.fromCharCode(65 + index),
    text: opt.text,
    isCorrect: opt.isCorrect,
  }));
}

/**
 * Safely shuffles questions for an exam while preserving orderIndex
 */
export function safelyShuffleQuestions<T extends { id: string }>(
  questions: T[],
  enableShuffle = true
): T[] {
  if (!enableShuffle) return [...questions];
  return shuffleArray(questions);
}
