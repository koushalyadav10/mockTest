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
  if (rawTitle.includes("[Assigned]")) return rawTitle.replace(/^📢\s*/, "").trim();
  const chMatch = rawTitle.match(/(?:Chapter|Ch)\s*(\d+)[:\s\-]+([^(—]+)/i);
  if (chMatch) {
    const chNum = chMatch[1];
    const chName = chMatch[2].trim();
    return `SSC Chapter ${chNum}: ${chName}`;
  }
  return rawTitle.replace(/^SSC Maths\s*\([^)]*\)\s*[—\-:]*\s*/i, "SSC ").split("(")[0].trim();
}

/**
 * Determines whether an exam is an instructor-assigned test vs a permanent chapter test.
 */
export function isAssignedExam(exam: { title?: string; code?: string; category?: string; mode?: string } | null | undefined): boolean {
  if (!exam) return false;
  if (exam.category === "ASSIGNED" || exam.category === "CUSTOM") return true;
  if (exam.code?.startsWith("ASSIGNED_")) return true;
  if (exam.title?.includes("[Assigned]")) return true;
  return false;
}

/**
 * Determines which subject curriculum module an exam belongs to:
 * "GK_GS" | "MATHS" | "REASONING" | "ENGLISH" | "HINDI"
 */
export function getExamSubject(exam: {
  title?: string;
  code?: string;
  category?: string;
  instructions?: string | null;
  sections?: { name: string }[];
} | null | undefined): "GK_GS" | "MATHS" | "REASONING" | "ENGLISH" | "HINDI" {
  if (!exam) return "MATHS";

  // 1. Check instructions JSON
  if (exam.instructions) {
    try {
      const parsed = JSON.parse(exam.instructions);
      if (parsed.subject) {
        const s = parsed.subject.toUpperCase();
        if (["GK_GS", "GK", "GS", "GENERAL_AWARENESS"].includes(s)) return "GK_GS";
        if (["MATHS", "MATHEMATICS", "QUANT"].includes(s)) return "MATHS";
        if (["REASONING", "REASON", "GI"].includes(s)) return "REASONING";
        if (["ENGLISH", "ENG"].includes(s)) return "ENGLISH";
        if (["HINDI"].includes(s)) return "HINDI";
      }
    } catch (e) {}
  }

  // 2. Check category
  const cat = (exam.category || "").toUpperCase();
  if (["GK_GS", "GK", "GS", "GENERAL_AWARENESS", "GA"].includes(cat)) return "GK_GS";
  if (["MATHS", "MATHEMATICS", "QUANT"].includes(cat)) return "MATHS";
  if (["REASONING", "REASON", "GI"].includes(cat)) return "REASONING";
  if (["ENGLISH", "ENG"].includes(cat)) return "ENGLISH";
  if (["HINDI"].includes(cat)) return "HINDI";

  // 3. Check title / code heuristics
  const title = (exam.title || "").toLowerCase();
  const code = (exam.code || "").toLowerCase();
  if (
    title.includes("gs") ||
    title.includes("gk") ||
    title.includes("general awareness") ||
    title.includes("polity") ||
    title.includes("history") ||
    title.includes("geography") ||
    title.includes("science") ||
    code.includes("gs") ||
    code.includes("gk")
  ) {
    return "GK_GS";
  }
  if (title.includes("reasoning") || code.includes("reasoning")) {
    return "REASONING";
  }
  if (title.includes("english") || code.includes("english")) {
    return "ENGLISH";
  }
  if (title.includes("hindi") || code.includes("hindi")) {
    return "HINDI";
  }

  // 4. Default to MATHS for SSC Aditya Ranjan chapters
  return "MATHS";
}


