"use client";

import React from "react";
import katex from "katex";

interface MathRendererProps {
  text: string;
  className?: string;
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

/**
 * Auto-wrap unwrapped LaTeX math expressions and sanitize malformed tokens
 */
function sanitizeAndWrapLatex(text: string): string {
  if (!text) return "";

  // 1. Clean corruptions like stray /fskd, /frac, double slashes etc.
  let cleaned = text
    .replace(/\/fskd/gi, "")
    .replace(/\/+(frac|sqrt|times|div|pm|circ|degree|pi|theta|alpha|beta)\b/gi, "\\$1");

  // 2. Wrap unwrapped LaTeX commands and surrounding numbers/symbols
  const parts = cleaned.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);
  return parts
    .map((part) => {
      if (part.startsWith("$")) return part;

      let p = part;

      // Normalize unicode superscripts & roots
      p = p.replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4").replace(/⁵/g, "^5");
      p = p.replace(/∛\s*([0-9a-zA-Z]+|\([^)]+\))/g, "\\sqrt[3]{$1}");
      p = p.replace(/⁶√\s*([0-9a-zA-Z]+|\([^)]+\))/g, "\\sqrt[6]{$1}");
      p = p.replace(/④√\s*([0-9a-zA-Z]+|\([^)]+\))/g, "\\sqrt[4]{$1}");
      p = p.replace(/÷/g, " \\div ");

      // Repeating decimal with overline
      p = p.replace(/(\d+\.)(\d+)[\u0305\u0304]/g, "$1\\overline{$2}");
      p = p.replace(/(\d+)[\u0305\u0304]/g, "\\overline{$1}");
      p = p.replace(/(\d+\.\d+)̅/g, "\\overline{$1}");

      // Auto-convert mixed fractions with %: e.g. "33 1/3%" or "2 21/29 %" -> "$33\frac{1}{3}\%$"
      p = p.replace(/\b(\d+)\s+(\d+)\/(\d+)\s*%/g, (_, w, n, d) => `$${w}\\frac{${n}}{${d}}\\%$`);
      // Auto-convert mixed fractions without %: e.g. "1852 1/3" -> "$1852\frac{1}{3}$"
      p = p.replace(/(?<![\d/$])(\d+)\s+(\d+)\/(\d+)(?!\s*[%$/])/g, (_, w, n, d) => `$${w}\\frac{${n}}{${d}}$`);
      // Auto-convert simple fractions with %: e.g. "175/4%" -> "$\frac{175}{4}\%$"
      p = p.replace(/(?<![\d/$])(\d+)\/(\d+)\s*%/g, (_, n, d) => `$\\frac{${n}}{${d}}\\%$`);
      // Auto-convert standalone option fractions: e.g. "17/200" or "3/4"
      p = p.replace(/^\s*(\d+)\/(\d+)\s*$/, (_, n, d) => `$\\frac{${n}}{${d}}$`);

      // Standalone roots: e.g. "√2" or "√67"
      p = p.replace(/^\s*√\s*(\d+|\w+)\s*$/, (_, v) => `$\\sqrt{${v}}$`);
      p = p.replace(/^\s*\\sqrt(\[\d+\])?\{[^}]+\}\s*$/, (m) => `$${m.trim()}$`);

      // Roots in expressions: √(inner) -> \sqrt{inner}
      p = p.replace(/√\s*\(([^)]+)\)/g, (_, inner) => {
        const cleanedInner = inner.replace(/(\b[a-zA-Z0-9]+)\s*\/\s*(\b[0-9]+)/g, "\\frac{$1}{$2}");
        return `$\\sqrt{${cleanedInner}}$`;
      });
      p = p.replace(/√\s*\[([^\]]+)\]/g, (_, inner) => `$\\sqrt{${inner}}$`);

      // Exponents: e.g. 2^(x+4) -> 2^{x+4}
      p = p.replace(/(\d+|[a-zA-Z]|\([^)]+\))\^\(([^)]+)\)/g, "$1^{$2}");

      return p.replace(
        /((?:[-+±]|\b|\s|^)(?:[0-9.]*\s*)?\\[a-zA-Z]+(?:\{[^{}]*\}|\[[^\[\]]*\]|[0-9a-zA-Z_^{}\\+\-*\/])*)/g,
        (m) => {
          const trimmed = m.trim();
          if (!trimmed) return m;
          const leadingSpace = m.startsWith(" ") ? " " : "";
          const trailingSpace = m.endsWith(" ") ? " " : "";
          return `${leadingSpace}$${trimmed}$${trailingSpace}`;
        }
      );
    })
    .join("");
}

/**
 * Render inline text with KaTeX formulas and bold markdown
 */
function renderInlineMath(content: string): React.ReactNode[] {
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
    const isBlock = rawMatch.startsWith("$$") && rawMatch.endsWith("$$");
    const formula = isBlock ? rawMatch.slice(2, -2).trim() : rawMatch.slice(1, -1).trim();

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
          className={isBlock ? "block my-2 text-center" : "inline-block px-0.5"}
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
export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // Split content by lines to check for Markdown tables
  const lines = text.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let currentTextBuffer: string[] = [];

  const flushTextBuffer = () => {
    if (currentTextBuffer.length > 0) {
      const blockText = currentTextBuffer.join("\n");
      elements.push(
        <div key={`text-block-${elements.length}`} className="whitespace-pre-line">
          {renderInlineMath(blockText)}
        </div>
      );
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
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-[13px] landscape:text-[11px]">
            <thead className="bg-slate-100/90 text-slate-800 font-bold">
              <tr>
                {tableHeader.map((headerCell, hIdx) => (
                  <th
                    key={hIdx}
                    className="px-2 py-1 sm:px-3 sm:py-2 landscape:px-1.5 landscape:py-0.5 text-center font-bold text-[11px] sm:text-xs landscape:text-[10px] text-slate-800 border-r border-slate-200/80 last:border-r-0 whitespace-nowrap first:text-left first:pl-2.5 sm:first:pl-3"
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
                      className="px-2 py-0.5 sm:px-3 sm:py-1.5 landscape:px-1.5 landscape:py-0.5 text-center text-slate-800 font-medium text-xs sm:text-[13px] landscape:text-[11px] border-r border-slate-100 last:border-r-0 first:text-left first:pl-2.5 sm:first:pl-3 first:font-semibold"
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

  return <div className={`font-sans leading-relaxed text-slate-900 ${className}`}>{elements}</div>;
};
