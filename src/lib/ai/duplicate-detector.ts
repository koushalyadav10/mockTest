/**
 * Duplicate detector using normalized token overlap and Levenshtein distance
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, " ") // Preserves English, Numbers, Hindi/Devanagari
    .replace(/\s+/g, " ")
    .trim();
}

export function computeTextSimilarity(textA: string, textB: string): number {
  const normA = normalizeText(textA);
  const normB = normalizeText(textB);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  // Jaccard similarity of 3-grams
  const getGrams = (str: string, n = 3) => {
    const grams = new Set<string>();
    for (let i = 0; i <= str.length - n; i++) {
      grams.add(str.substring(i, i + n));
    }
    return grams;
  };

  const gramsA = getGrams(normA);
  const gramsB = getGrams(normB);

  if (gramsA.size === 0 || gramsB.size === 0) return 0.0;

  let intersection = 0;
  for (const g of gramsA) {
    if (gramsB.has(g)) intersection++;
  }

  const union = gramsA.size + gramsB.size - intersection;
  return Number((intersection / union).toFixed(3));
}

export function findPotentialDuplicates(
  candidateText: string,
  existingQuestions: { id: string; questionText: string }[],
  threshold = 0.82
): { isDuplicate: boolean; matchedQuestionId?: string; similarity: number } {
  let highestSim = 0;
  let matchedId: string | undefined;

  for (const item of existingQuestions) {
    const sim = computeTextSimilarity(candidateText, item.questionText);
    if (sim > highestSim) {
      highestSim = sim;
      matchedId = item.id;
    }
  }

  return {
    isDuplicate: highestSim >= threshold,
    matchedQuestionId: highestSim >= threshold ? matchedId : undefined,
    similarity: highestSim,
  };
}
