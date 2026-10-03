export interface DifficultyEstimate {
  difficulty: "EASY" | "MEDIUM" | "HARD";
  confidence: number;
  factors: string[];
}

/**
 * Smart Multi-Factor Difficulty Classifier
 * Evaluates calculation complexity, multi-step reasoning, vocabulary, and visual dependencies.
 */
export function estimateQuestionDifficulty(
  questionText: string,
  options: { text: string }[],
  hasVisualContent: boolean
): DifficultyEstimate {
  const combined = `${questionText} ${options.map((o) => o.text).join(" ")}`;
  let difficultyScore = 0; // 0 to 10
  const factors: string[] = [];

  // Factor 1: Mathematical / Equation Complexity
  if (/\b(tangent|secant|polynomial|quadratic|trigonometry|sin|cos|tan|\^3|\^2|\\frac|\\times|\\sqrt)\b/i.test(combined)) {
    difficultyScore += 3;
    factors.push("Advanced algebraic/geometric properties");
  } else if (/[\+\-\*\/\=\%\$]/.test(combined) || /\d+[\.,]\d+/.test(combined)) {
    difficultyScore += 1.5;
    factors.push("Numerical arithmetic calculation");
  }

  // Factor 2: Multi-Step Deductive Reasoning (Syllogisms, Blood Relations, Seating Arrangement)
  if (/(statements|conclusions|neither follows|only conclusion|blood relation|sitting in a row|facing north)/i.test(combined)) {
    difficultyScore += 2.5;
    factors.push("Multi-step deductive logical reasoning");
  }

  // Factor 3: Visual / Diagram Dependency
  if (hasVisualContent || /(figure|diagram|chart|graph|venn diagram)/i.test(combined)) {
    difficultyScore += 2.0;
    factors.push("Visual pattern/diagram interpretation");
  }

  // Factor 4: Advanced Vocabulary & Grammar
  if (/(meticulous|painstaking|superfluous|ambiguous|juxtaposition|unturned)/i.test(combined)) {
    difficultyScore += 1.5;
    factors.push("Advanced vocabulary / figurative idiom");
  }

  // Factor 5: Text Length & Question Density
  if (questionText.length > 250) {
    difficultyScore += 1.5;
    factors.push("Extended passage / reading density");
  }

  // Classify based on score
  let difficulty: "EASY" | "MEDIUM" | "HARD" = "MEDIUM";
  let confidence = 0.85;

  if (difficultyScore <= 2.0) {
    difficulty = "EASY";
    confidence = 0.88;
  } else if (difficultyScore >= 4.5) {
    difficulty = "HARD";
    confidence = 0.82;
  } else {
    difficulty = "MEDIUM";
    confidence = 0.85;
  }

  return {
    difficulty,
    confidence,
    factors: factors.length > 0 ? factors : ["Standard single-step conceptual question"],
  };
}

/**
 * Detects question type taxonomy
 */
export function detectQuestionType(
  questionText: string,
  options: { text: string }[],
  hasVisualContent: boolean
): "MCQ" | "NUMERICAL" | "STATEMENT_BASED" | "ASSERTION_REASON" | "MATCHING" | "PASSAGE_BASED" | "CLOZE" | "DIAGRAM_BASED" | "TABLE_BASED" | "UNKNOWN" {
  const lower = questionText.toLowerCase();

  if (hasVisualContent || lower.includes("given figure") || lower.includes("diagram")) {
    return "DIAGRAM_BASED";
  }
  if (lower.includes("table") || lower.includes("given below")) {
    return "TABLE_BASED";
  }
  if (lower.includes("statement") && (lower.includes("conclusion") || lower.includes("which of the statement"))) {
    return "STATEMENT_BASED";
  }
  if (lower.includes("assertion") || lower.includes("reason")) {
    return "ASSERTION_REASON";
  }
  if (lower.includes("match the following") || lower.includes("list-i") || lower.includes("list-ii")) {
    return "MATCHING";
  }
  if (lower.includes("passage") || lower.includes("comprehension")) {
    return "PASSAGE_BASED";
  }
  if (lower.includes("cloze") || lower.includes("blank")) {
    return "CLOZE";
  }
  if (options.every((o) => /^\$?\d+(\.\d+)?\$?$/.test(o.text.trim()))) {
    return "NUMERICAL";
  }

  return "MCQ";
}
