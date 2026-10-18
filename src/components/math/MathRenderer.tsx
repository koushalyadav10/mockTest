"use client";

import React from "react";
import katex from "katex";

import { cleanExplanationText } from "@/lib/utils/textCleaner";

interface MathRendererProps {
  text: string;
  className?: string;
  inlineOnly?: boolean;
}

/**
 * Parse inline markdown bold (**text**) and remove stray raw asterisks
 */
function parseMarkdownText(text: string, keyPrefix: string): React.ReactNode[] {
  if (!text) return [];
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  let bMatch: RegExpExecArray | null;

  while ((bMatch = boldRegex.exec(text)) !== null) {
    if (bMatch.index > lastIdx) {
      nodes.push(text.substring(lastIdx, bMatch.index).replace(/\*\*/g, ""));
    }
    nodes.push(
      <strong key={`${keyPrefix}-b-${bMatch.index}`} className="font-bold text-slate-950">
        {bMatch[1]}
      </strong>
    );
    lastIdx = bMatch.index + bMatch[0].length;
  }

  if (lastIdx < text.length) {
    nodes.push(text.substring(lastIdx).replace(/\*\*/g, ""));
  }

  return nodes;
}

const SUPERSCRIPT_MAP: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁺": "+",
  "⁻": "-",
  "ⁿ": "n",
};

/**
 * Detect whether a string is a standalone mathematical expression
 * (e.g. \frac{\sqrt{21}-1}{2}, a^{\frac{7}{8}}, 2\sqrt{3}+1)
 * rather than a regular sentence.
 */
function isPureMathExpression(str: string): boolean {
  const trimmed = str.trim();
  if (!trimmed) return false;
  // If already enclosed in $, don't re-wrap
  if (trimmed.startsWith("$") && trimmed.endsWith("$")) return false;
  // Math indicators: LaTeX command, caret powers, roots, plus-minus, standalone fractions
  const hasMath = /\\\w+|[\^√±]|\b\d+\/\d+\b/.test(trimmed);
  if (!hasMath) return false;
  // Strip out LaTeX commands: \frac, \sqrt, \pm, \alpha etc.
  const stripped = trimmed.replace(/\\[a-zA-Z]+/g, "");
  // Words with 4+ characters usually indicate English/Hindi sentence text
  const longWords = stripped.match(/[a-zA-Z\u0900-\u097F]{4,}/g);
  if (longWords && longWords.length > 0) return false;
  // Check balanced braces
  let depth = 0;
  for (const ch of trimmed) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

/**
 * Auto-wrap unwrapped LaTeX math expressions and sanitize malformed tokens
 */
function sanitizeAndWrapLatex(text: string): string {
  if (!text) return "";

  // 1. Clean corruptions like stray /fskd, /frac, double slashes etc.
  let cleaned = text
    .replace(/\/fskd/gi, "")
    .replace(/\/+(frac|sqrt|times|div|pm|circ|degree|pi|theta|alpha|beta)\b/gi, "\\$1");

  // Fast-path: If the entire input is a pure mathematical formula (typical for option cards),
  // wrap it completely so KaTeX processes it as a single cohesive expression.
  if (isPureMathExpression(cleaned)) {
    cleaned = `$${cleaned.trim()}$`;
  }

  // 2. Protect existing math blocks ($$...$$ and $...$) so we never double-wrap
  const mathPlaceholders: string[] = [];
  const protect = (mathStr: string): string => {
    const idx = mathPlaceholders.length;
    mathPlaceholders.push(mathStr);
    return `___MATH_PLACEHOLDER_${idx}___`;
  };

  let p = cleaned.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g, (match) => protect(match));

  // 3. Normalize unicode superscripts & roots on non-math text
  p = p.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ]+)/g, (m) => {
    const mapped = [...m].map((ch) => SUPERSCRIPT_MAP[ch] || ch).join("");
    return mapped.length === 1 ? `^${mapped}` : `^{${mapped}}`;
  });

  p = p
    .replace(/∛\s*([0-9a-zA-Z]+|\([^)]+\))/g, "\\sqrt[3]{$1}")
    .replace(/⁶√\s*([0-9a-zA-Z]+|\([^)]+\))/g, "\\sqrt[6]{$1}")
    .replace(/④√\s*([0-9a-zA-Z]+|\([^)]+\))/g, "\\sqrt[4]{$1}")
    .replace(/÷/g, " \\div ");

  // Repeating decimal with overline
  p = p
    .replace(/(\d+\.)(\d+)[\u0305\u0304]/g, "$1\\overline{$2}")
    .replace(/(\d+)[\u0305\u0304]/g, "\\overline{$1}")
    .replace(/(\d+\.\d+)̅/g, "\\overline{$1}");

  // 4a. Brace fractions: {n(n + 1)(2n + 1)} / 6 -> \frac{n(n + 1)(2n + 1)}{6}
  p = p.replace(/\{([^{}]+)\}\s*\/\s*(\{[^{}]+\}|\d+|[a-zA-Z]+)/g, (_, num, den) => {
    const cleanDen = den.replace(/^\{|\}$/g, "").trim();
    return protect(`$\\frac{${num.trim()}}{${cleanDen}}$`);
  });

  // 4b. Parenthesis fractions: (2n + 1) / 3 or (a + b) / (c + d)
  p = p.replace(/\(([^()]+)\)\s*\/\s*(\([^()]+\)|\d+|[a-zA-Z]+)/g, (_, num, den) => {
    const cleanDen = den.replace(/^\(|\)$/g, "").trim();
    return protect(`$\\frac{${num.trim()}}{${cleanDen}}$`);
  });

  // 4c. Mixed fractions with optional common units:
  // e.g. "26 2/3 kg", "57 1/2 years", "33 1/3%", "1852 1/3", "7 1/2 दिन", "26 2/3 किग्रा"
  const unitList =
    "kg|g|mg|years?|months?|days?|hours?|hrs?|mins?|minutes?|sec|seconds?|km\\/h|m\\/s|km|m|cm|mm|%|percent|वर्ष|साल|दिन|घंटे|घंटा|मिनट|सेकंड|किग्रा|ग्राम|किमी|मीटर|सेमी|किमी\\/घंटा|लीटर|litres?|liters?";
  const mixedFracWithUnitRegex = new RegExp(`(\\d+)\\s+(\\d+)\\/(\\d+)\\s*(${unitList})(?![a-zA-Z0-9])`, "gi");
  p = p.replace(mixedFracWithUnitRegex, (_, w, n, d, u) => {
    if (u === "%" || u.toLowerCase() === "percent") {
      return protect(`$${w}\\frac{${n}}{${d}}\\%$`);
    }
    return protect(`$${w}\\frac{${n}}{${d}}\\text{ ${u}}$`);
  });

  // Mixed fractions without units: "26 2/3" -> "$26\frac{2}{3}$"
  p = p.replace(/(?<![\d/$])(\d+)\s+(\d+)\/(\d+)(?!\s*[%$/])/g, (_, w, n, d) => {
    return protect(`$${w}\\frac{${n}}{${d}}$`);
  });

  // Simple fractions with unit or %: "175/4%" -> "$\frac{175}{4}\%$"
  p = p.replace(/(?<![\d/$])(\d+)\/(\d+)\s*%/g, (_, n, d) => protect(`$\\frac{${n}}{${d}}\\%$`));

  // Standalone simple fractions: "17/200" or "3/4"
  p = p.replace(/^\s*(\d+)\/(\d+)\s*$/, (_, n, d) => protect(`$\\frac{${n}}{${d}}$`));

  // 5. Roots:
  p = p.replace(/^\s*√\s*(\d+|\w+)\s*$/, (_, v) => protect(`$\\sqrt{${v}}$`));
  p = p.replace(/√\s*\(([^)]+)\)/g, (_, inner) => {
    const cleanedInner = inner.replace(/(\b[a-zA-Z0-9]+)\s*\/\s*(\b[0-9]+)/g, "\\frac{$1}{$2}");
    return protect(`$\\sqrt{${cleanedInner}}$`);
  });
  p = p.replace(/√\s*\[([^\]]+)\]/g, (_, inner) => protect(`$\\sqrt{${inner}}$`));
  p = p.replace(/√\s*(\d+|[a-zA-Z]+)\b/g, (_, v) => protect(`$\\sqrt{${v}}$`));

  // 6. Algebraic expressions containing powers (^):
  // If the trimmed text is entirely an algebraic expression with powers (common in options, e.g. "rs (r^2 + s^2 - rs)")
  const trimmed = p.trim();
  const isEntirelyAlgebraic =
    /^[a-zA-Z0-9\s()+\-*^/.]+(\s*=\s*[a-zA-Z0-9\s()+\-*^/.]+)?$/.test(trimmed) && trimmed.includes("^");
  if (isEntirelyAlgebraic && !p.includes("___MATH_PLACEHOLDER_")) {
    p = protect(`$${trimmed.replace(/\s+/g, " ")}$`);
  } else {
    // Standalone tokens or terms with carets in sentences: e.g. "r^4", "s^4", "x^2", "10^5", "2^(x+4)"
    p = p.replace(/(?<![\$\w])([a-zA-Z0-9()]+\^[a-zA-Z0-9{}()+-]+)(?![\$\w])/g, (m) => {
      const formatted = m.replace(/\^\(([^)]+)\)/g, "^{$1}");
      return protect(`$${formatted}$`);
    });
  }

  // Degree Celsius / Fahrenheit: 66^\circ C -> $66^\circ\text{C}$
  p = p.replace(/\b(\d+(?:\.\d+)?)\s*\^\s*\\circ\s*([CF])\b/g, (_, val, unit) => {
    return protect(`$${val}^\\circ\\text{${unit}}$`);
  });

  // 7. Unwrapped LaTeX commands and powers in sentences: \frac, \sqrt, a^{\frac{7}{8}}, etc.
  // Supports nested braces up to 3 levels: e.g. \frac{\frac{49}{63} + ...}{\frac{1}{7} + ...}
  const nestedLatexRegex =
    /(?:(?<=\s|^|[+\-*/=(])|^)(?:[0-9.]*\s*)?(?:[a-zA-Z0-9()]+\^\{[^{}]*(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}[^{}]*)*\}|\\[a-zA-Z]+(?:\[[^\]]*\]|\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})*)(?:[0-9a-zA-Z_+\-*\/^.]+(?:\s*[+\-*/]\s*[0-9a-zA-Z_+\-*\/^.]+)*)?/g;

  p = p.replace(nestedLatexRegex, (m) => {
    const tr = m.trim();
    if (!tr || tr.startsWith("$") || tr.includes("___MATH_PLACEHOLDER_")) return m;
    const leadingSpace = m.startsWith(" ") ? " " : "";
    const trailingSpace = m.endsWith(" ") ? " " : "";
    return `${leadingSpace}${protect(`$${tr}$`)}${trailingSpace}`;
  });

  // 8. Restore protected math blocks
  return p.replace(/___MATH_PLACEHOLDER_(\d+)___/g, (_, idx) => {
    return mathPlaceholders[parseInt(idx, 10)];
  });
}

/**
 * Render inline text with KaTeX formulas and bold markdown
 */
function renderInlineMath(content: string, inlineOnly: boolean = false): React.ReactNode[] {
  if (!content) return [];
  const processedContent = sanitizeAndWrapLatex(content);
  const parts: React.ReactNode[] = [];
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(processedContent)) !== null) {
    if (match.index > lastIndex) {
      const plainText = processedContent.substring(lastIndex, match.index);
      parts.push(...parseMarkdownText(plainText, `txt-${lastIndex}`));
    }

    const rawMatch = match[0];
    const isBlock = !inlineOnly && rawMatch.startsWith("$$") && rawMatch.endsWith("$$");
    const formula = rawMatch.startsWith("$$") && rawMatch.endsWith("$$")
      ? rawMatch.slice(2, -2).trim()
      : rawMatch.slice(1, -1).trim();

    try {
      const html = katex.renderToString(formula, {
        displayMode: isBlock,
        throwOnError: false,
        strict: false,
      });

      parts.push(
        <span
          key={`math-${match.index}`}
          dangerouslySetInnerHTML={{ __html: html }}
          className={
            isBlock
              ? "block my-2 text-center"
              : "inline-flex items-baseline whitespace-nowrap px-0.5 align-baseline"
          }
        />
      );
    } catch (e) {
      parts.push(<span key={`fallback-${match.index}`}>{rawMatch}</span>);
    }

    lastIndex = match.index + rawMatch.length;
  }

  if (lastIndex < processedContent.length) {
    const plainText = processedContent.substring(lastIndex);
    parts.push(...parseMarkdownText(plainText, `end-${lastIndex}`));
  }

  return parts;
}

/**
 * MathRenderer parses inline math ($...$), block math ($$...$$),
 * Markdown bold (**text**), and Markdown tables (| Col 1 | Col 2 |).
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = "", inlineOnly = false }) => {
  if (!text) return null;

  // Sanitize excessive whitespace, broken OCR newlines, and dangling lines
  const sanitizedText = cleanExplanationText(text);
  if (!sanitizedText) return null;

  // Split content by lines to check for Markdown tables
  const lines = sanitizedText.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let currentTextBuffer: string[] = [];

  const flushTextBuffer = () => {
    if (currentTextBuffer.length > 0) {
      const blockText = currentTextBuffer.join("\n").trim();
      if (blockText.length > 0) {
        elements.push(
          <div
            key={`text-block-${elements.length}`}
            className={inlineOnly ? "inline" : "whitespace-pre-line leading-relaxed"}
          >
            {renderInlineMath(blockText, inlineOnly)}
          </div>
        );
      }
      currentTextBuffer = [];
    }
  };

  const flushTable = () => {
    if (tableHeader.length > 0) {
      elements.push(
        <div
          key={`table-block-${elements.length}`}
          className="overflow-x-auto my-1 sm:my-2 border border-slate-200/90 rounded-xl shadow-2xs bg-white max-w-full sm:max-w-2xl touch-pan-x touch-pan-y overscroll-contain [-webkit-overflow-scrolling:touch]"
        >
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm max-lg:landscape:text-[11px]">
            <thead className="bg-slate-100/90 text-slate-800 font-bold">
              <tr>
                {tableHeader.map((headerCell, hIdx) => (
                  <th
                    key={hIdx}
                    className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 max-lg:landscape:px-1.5 max-lg:landscape:py-0.5 text-center font-bold text-xs sm:text-sm max-lg:landscape:text-[10px] text-slate-800 border-r border-slate-200/80 last:border-r-0 whitespace-nowrap first:text-left first:pl-3 sm:first:pl-4"
                  >
                    {renderInlineMath(headerCell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tableRows.map((rowCells, rIdx) => (
                <tr
                  key={rIdx}
                  className={rIdx % 2 === 0 ? "bg-white hover:bg-slate-50/70" : "bg-slate-50/60 hover:bg-slate-100/70"}
                >
                  {rowCells.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-2.5 py-1 sm:px-4 sm:py-2 max-lg:landscape:px-1.5 max-lg:landscape:py-0.5 text-center text-slate-800 font-medium text-xs sm:text-sm max-lg:landscape:text-[11px] border-r border-slate-100 last:border-r-0 first:text-left first:pl-3 sm:first:pl-4 first:font-semibold"
                    >
                      {renderInlineMath(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if line is a table line (starts and ends with |)
    const isTableLine = line.startsWith("|") && line.endsWith("|");

    if (isTableLine) {
      // Check if it's a separator line (| :--- | :--- |)
      const isSeparator = /^\|(?:\s*:?-+:?\s*\|)+$/.test(line);

      if (!inTable) {
        // Table starting: flush previous text
        flushTextBuffer();
        inTable = true;
        // Parse header cells
        tableHeader = line
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
      } else if (isSeparator) {
        // Skip separator line
        continue;
      } else {
        // Table body row
        const cells = line
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableRows.push(cells);
      }
    } else {
      if (inTable) {
        flushTable();
      }
      currentTextBuffer.push(lines[i]);
    }
  }

  // Flush remaining
  if (inTable) {
    flushTable();
  }
  flushTextBuffer();

  return (
    <div
      className={`font-sans leading-relaxed text-slate-900 ${inlineOnly ? "inline" : ""} ${className}`}
    >
      {elements}
    </div>
  );
};
