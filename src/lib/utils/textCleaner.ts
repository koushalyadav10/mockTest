/**
 * Clean up OCR artifacts, broken line breaks, and excessive blank lines from questions and explanations.
 */
export function cleanExplanationText(raw: string | null | undefined): string {
  if (!raw) return "";

  // 1. Normalize line endings and trim trailing whitespace per line
  const lines = raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim());

  // 2. Filter out purely empty lines
  const nonEmpty = lines.filter((l) => l.length > 0);
  if (nonEmpty.length === 0) return "";

  // 3. Intelligent sentence and paragraph rejoin
  const result: string[] = [];

  for (const line of nonEmpty) {
    if (result.length === 0) {
      result.push(line);
      continue;
    }

    const prev = result[result.length - 1];

    // Markdown tables or math display blocks should never be merged
    if (line.startsWith("|") || prev.startsWith("|") || line.startsWith("$$") || prev.startsWith("$$")) {
      result.push(line);
      continue;
    }

    // Check merge conditions:
    // If previous line does NOT end with sentence-ending punctuation (. ! ? : ; । |)
    const prevEndsWithPunctuation = /[.!?\:;|।]$/.test(prev);
    let shouldMerge = false;

    if (!prevEndsWithPunctuation) {
      if (prev.endsWith("-")) {
        // Hyphenated word broken across line
        result[result.length - 1] = prev.slice(0, -1) + line;
        continue;
      }

      // Check if line starts with lowercase or continuation symbols
      const startsWithLower = /^[a-z]/.test(line);
      const startsWithContinuationSymbol = /^[)\]\}=]/.test(line);
      const prevEndsWithOpenSymbol = /[(\[\{=]$/.test(prev);
      
      const lastWordOfPrev = (prev.split(/\s+/).pop() || "").toLowerCase();
      const danglingWords = new Set([
        "and", "or", "the", "is", "are", "was", "were", "a", "an",
        "of", "to", "in", "for", "with", "from", "as", "by", "that",
        "same", "this", "these", "those", "which", "where", "when", "both"
      ]);

      if (
        startsWithLower ||
        startsWithContinuationSymbol ||
        prevEndsWithOpenSymbol ||
        danglingWords.has(lastWordOfPrev)
      ) {
        shouldMerge = true;
      }
    }

    if (shouldMerge) {
      result[result.length - 1] = `${prev} ${line}`;
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}
