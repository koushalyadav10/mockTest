/**
 * Utility to extract, parse, and cleanly isolate official exam year, shift, and tier metadata
 * from question body text.
 */

export interface ParsedQuestionContent {
  cleanQuestionText: string;
  examTag: string | null;
  year?: number | null;
  examName?: string | null;
}

/**
 * Extracts and cleans exam year, shift, and tier metadata tags from raw question text.
 * e.g. "The average of 10 consecutive integers is 33/2...\n\n*(SSC CHSL 13/03/2023 Shift-01)*"
 *   -> cleanQuestionText: "The average of 10 consecutive integers is 33/2..."
 *   -> examTag: "SSC CHSL 13/03/2023 Shift-01"
 * e.g. "Kheda Satyagraha was associated with which of the following leaders?\nSSC CHSL — 10 March 2023"
 *   -> cleanQuestionText: "Kheda Satyagraha was associated with which of the following leaders?"
 *   -> examTag: "SSC CHSL — 10 March 2023", year: 2023, examName: "SSC CHSL"
 * Note: Historical/factual years in questions like "Battle of Plassey was fought in which year? 1757"
 * or "In 1919, Jallianwala Bagh..." are preserved and NEVER treated as exam tags.
 */
export function extractExamTag(rawText: string, fallbackTag?: string | null): ParsedQuestionContent {
  if (!rawText) {
    return { cleanQuestionText: "", examTag: fallbackTag || null, year: null, examName: null };
  }

  // Regex patterns covering standard competitive exam citation tags:
  // 1. *(SSC CHSL 13/03/2023 Shift-01)* or *(SSC CGL TIER II 03/03/2023)*
  // 2. [SSC CGL 11/09/2024 (Shift-03)] or [SSC CGL TIER-II 11/09/2019]
  // 3. (SSC CPO 24/11/2020 Shift-01)
  // 4. Prefix lines: Exam: ..., Asked in: ..., PYQ: ...
  // 5. Standalone trailing line citations: SSC CHSL — 10 March 2023, SSC MTS 2022, UP Police 2024, etc.
  // 6. Trailing dash citations: ...question? — SSC CHSL 10 March 2023
  const patterns: { regex: RegExp; isTrailingLine?: boolean }[] = [
    {
      regex: /\*\s*(?:\()?\s*([^*]+?(?:SSC|CGL|CHSL|CPO|MTS|GD|JE|UPSI|RRB|NTPC|IBPS|SBI|Selection\s*Post|Shift|Tier)[^*]*?)\s*(?:\))?\s*\*/i,
    },
    {
      regex: /\[\s*([^[\]]*?(?:SSC|CGL|CHSL|CPO|MTS|GD|JE|UPSI|RRB|NTPC|IBPS|SBI|Selection\s*Post|Shift|Tier)[^[\]]*?)\s*\]/i,
    },
    {
      regex: /\(\s*([^\(\)]*?(?:SSC|CGL|CHSL|CPO|MTS|GD|JE|UPSI|RRB|NTPC|IBPS|SBI|Selection\s*Post)[^\(\)]*?(?:Shift|Tier|\d{4})[^\(\)]*?)\s*\)/i,
    },
    {
      regex: /(?:\r?\n|^)\s*(?:Exams?|Asked in|Year|Shift|PYQ)\s*:\s*([^\r\n]+)/i,
    },
    {
      // Standalone line at end: "SSC CHSL — 10 March 2023", "SSC CHSL – Previous Year", etc.
      regex: /(?:\r?\n|^)\s*(?:[—\-–•*]\s*)?((?:SSC|CGL|CHSL|CPO|MTS|GD|JE|UPSI|RRB|NTPC|IBPS|SBI|Delhi\s*Police|UP\s*Police|Selection\s*Post|NDA|CDS|AFCAT|CAPF)[^\r\n?]*?(?:(?:19|20)\d{2}|Shift|Tier|\d{1,2}\s+[A-Za-z]+\s+\d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|Previous\s*Year|PYQ)[^\r\n?]*?)\s*$/i,
      isTrailingLine: true,
    },
    {
      // Trailing after punctuation: "? — SSC CHSL 10 March 2023" (preserves '?')
      regex: /(?<=[?.!])\s*(?:[—\-–•]\s*)((?:SSC|CGL|CHSL|CPO|MTS|GD|JE|UPSI|RRB|NTPC|IBPS|SBI|Delhi\s*Police|UP\s*Police|Selection\s*Post)[^\r\n?]*?(?:(?:19|20)\d{2}|Shift|Tier|\d{1,2}\s+[A-Za-z]+\s+\d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|Previous\s*Year|PYQ)[^\r\n?]*?)\s*$/i,
    },
  ];

  for (const { regex } of patterns) {
    const match = rawText.match(regex);
    if (match) {
      let rawTag = match[1].trim();
      // Clean up any extra unbalanced enclosing brackets or asterisks
      rawTag = rawTag.replace(/^[\*\(\[\s—\-–]+|[\*\)\]\s—\-–]+$/g, "").trim();

      // Ensure balanced parentheses inside tag e.g. (Shift-03)
      const openParens = (rawTag.match(/\(/g) || []).length;
      const closeParens = (rawTag.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        rawTag = rawTag + ")".repeat(openParens - closeParens);
      } else if (closeParens > openParens) {
        rawTag = "(".repeat(closeParens - openParens) + rawTag;
      }

      // Extract numeric year if present in tag
      const yearMatch = rawTag.match(/\b(19\d{2}|20\d{2})\b/);
      const parsedYear = yearMatch ? parseInt(yearMatch[1], 10) : null;

      // Extract exam board name if present
      const examNameMatch = rawTag.match(/(SSC\s*(?:CHSL|CGL|MTS|CPO|GD|JE|Steno|Selection\s*Post)?|UP\s*Police|UPSI|RRB\s*(?:NTPC|Group\s*D)?|IBPS|SBI|Delhi\s*Police)/i);
      const parsedExamName = examNameMatch ? examNameMatch[0].trim() : null;

      // Remove the tag from the question text
      const cleanQuestionText = rawText.replace(match[0], "").trim();
      const rawExtracted = rawTag || fallbackTag || null;
      return {
        cleanQuestionText,
        examTag: cleanExamCitationTag(rawExtracted),
        year: parsedYear,
        examName: parsedExamName,
      };
    }
  }

  // Fallback if tag is already known from metadata
  let fallbackYear: number | null = null;
  let fallbackExamName: string | null = null;
  if (fallbackTag) {
    const yearMatch = fallbackTag.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) fallbackYear = parseInt(yearMatch[1], 10);
    const examMatch = fallbackTag.match(/(SSC\s*(?:CHSL|CGL|MTS|CPO|GD|JE|Steno|Selection\s*Post)?|UP\s*Police|UPSI|RRB|IBPS)/i);
    if (examMatch) fallbackExamName = examMatch[0].trim();
  }

  return {
    cleanQuestionText: rawText.trim(),
    examTag: cleanExamCitationTag(fallbackTag),
    year: fallbackYear,
    examName: fallbackExamName,
  };
}

/**
 * Cleans an exam citation tag by stripping repeated topic names and generic boilerplate tags.
 * e.g. "Data Interpretation, SSC CHSL 2024 (Shift-04)" -> "SSC CHSL 2024 (Shift-04)"
 * e.g. "Data Interpretation, Arithmetic, Aditya Ranjan SSC Maths, TCS 2024" -> "TCS 2024"
 * e.g. "Profit and Loss, SSC CGL 2024 (Shift-01)" -> "SSC CGL 2024 (Shift-01)"
 */
export function cleanExamCitationTag(tag: string | null | undefined, topic?: string | null): string | null {
  if (!tag) return null;
  let cleaned = tag.trim();

  // Strip leading topic name if present (e.g. "Data Interpretation, ...", "Profit & Loss, ...")
  if (topic) {
    const escapedTopic = topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    cleaned = cleaned.replace(new RegExp(`^${escapedTopic}\\s*[,\\-—:]\\s*`, "i"), "");
  }

  // Strip common known topic prefixes if repeated
  cleaned = cleaned.replace(
    /^(?:Data Interpretation|Profit and Loss|Profit & Loss|Percentage|Average|Ratio|Time and Work|Time & Work|Number System|Algebra|Geometry|Trigonometry|Mensuration|Statistics|Probability)\s*[,\\-—:]\s*/i,
    ""
  );

  // If it contains boilerplate "Arithmetic, Aditya Ranjan SSC Maths, TCS 2024"
  cleaned = cleaned.replace(/Arithmetic,\s*Aditya Ranjan SSC Maths,\s*/i, "");

  cleaned = cleaned.replace(/^[\*\(\[\s—\-–,:]+|[\*\)\]\s—\-–,:]+$/g, "").trim();

  return cleaned || null;
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


