/**
 * Utility to extract, parse, and cleanly isolate official exam year, shift, and tier metadata
 * from question body text.
 */

export interface ParsedQuestionContent {
  cleanQuestionText: string;
  examTag: string | null;
}

/**
 * Extracts and cleans exam year, shift, and tier metadata tags from raw question text.
 * e.g. "The average of 10 consecutive integers is 33/2...\n\n*(SSC CHSL 13/03/2023 Shift-01)*"
 *   -> cleanQuestionText: "The average of 10 consecutive integers is 33/2..."
 *   -> examTag: "SSC CHSL 13/03/2023 Shift-01"
 */
export function extractExamTag(rawText: string, fallbackTag?: string | null): ParsedQuestionContent {
  if (!rawText) {
    return { cleanQuestionText: "", examTag: fallbackTag || null };
  }

  // Regex patterns covering standard competitive exam citation tags:
  // 1. *(SSC CHSL 13/03/2023 Shift-01)* or *(SSC CGL TIER II 03/03/2023)*
  // 2. [SSC CGL 11/09/2024 (Shift-03)] or [SSC CGL TIER-II 11/09/2019]
  // 3. (SSC CPO 24/11/2020 Shift-01)
  // 4. [SSC CHSL ... ] or (Selection Post ... Shift ...) or (MTS ... Shift ...)
  const patterns = [
    /\*\s*(?:\()?\s*([^*]+?(?:SSC|CGL|CHSL|CPO|MTS|GD|UPSI|RRB|IBPS|Selection\s*Post|Shift|Tier)[^*]*?)\s*(?:\))?\s*\*/i,
    /\[\s*([^[\]]*?(?:SSC|CGL|CHSL|CPO|MTS|GD|UPSI|RRB|IBPS|Selection\s*Post|Shift|Tier)[^[\]]*?)\s*\]/i,
    /\(\s*([^\(\)]*?(?:SSC|CGL|CHSL|CPO|MTS|GD|UPSI|RRB|IBPS|Selection\s*Post)[^\(\)]*?(?:Shift|Tier|\d{4})[^\(\)]*?)\s*\)/i,
    /(?:\r?\n|^)\s*(?:Exams?|Asked in|Year|Shift)\s*:\s*([^\r\n]+)/i,
  ];

  for (const pattern of patterns) {
    const match = rawText.match(pattern);
    if (match) {
      let rawTag = match[1].trim();
      // Clean up any extra unbalanced enclosing brackets or asterisks
      rawTag = rawTag.replace(/^[\*\(\[\s]+|[\*\)\]\s]+$/g, "").trim();

      // Ensure balanced parentheses inside tag e.g. (Shift-03)
      const openParens = (rawTag.match(/\(/g) || []).length;
      const closeParens = (rawTag.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        rawTag = rawTag + ")".repeat(openParens - closeParens);
      } else if (closeParens > openParens) {
        rawTag = "(".repeat(closeParens - openParens) + rawTag;
      }

      // Remove the tag from the question text
      const cleanQuestionText = rawText.replace(match[0], "").trim();
      return {
        cleanQuestionText,
        examTag: rawTag || fallbackTag || null,
      };
    }
  }

  return {
    cleanQuestionText: rawText.trim(),
    examTag: fallbackTag || null,
  };
}

/**
 * Formats a raw book chapter title into a clean, concise title:
 * e.g. "SSC Maths (Aditya Ranjan) — Chapter 30: Data Interpretation (डी.आई. (Data Interpretation))"
 *   -> "SSC Chapter 30: Data Interpretation"
 */
export function formatCleanChapterTitle(rawTitle: string): string {
  if (!rawTitle) return "";
  const chMatch = rawTitle.match(/Chapter\s+(\d+)[:\s\-]+([^(—]+)/i);
  if (chMatch) {
    const chNum = chMatch[1];
    const chName = chMatch[2].trim();
    return `SSC Chapter ${chNum}: ${chName}`;
  }
  return rawTitle.replace(/^SSC Maths\s*\([^)]*\)\s*[—\-:]*\s*/i, "SSC ").split("(")[0].trim();
}

