"use client";

import React from "react";
import katex from "katex";

interface MathRendererProps {
  text: string;
  className?: string;
}

/**
 * Render inline text with KaTeX formulas
 */
function renderInlineMath(content: string): React.ReactNode[] {
  if (!content) return [];
  const parts: React.ReactNode[] = [];
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
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

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts;
}

/**
 * MathRenderer parses inline math ($...$), block math ($$...$$),
 * and Markdown tables (| Col 1 | Col 2 |).
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
          className="overflow-x-auto my-3 border border-slate-200 rounded-xl shadow-xs bg-white touch-pan-x"
        >
          <table className="min-w-full divide-y divide-slate-200 text-sm sm:text-base">
            <thead className="bg-slate-100/90 text-slate-900 font-extrabold">
              <tr>
                {tableHeader.map((headerCell, hIdx) => (
                  <th
                    key={hIdx}
                    className="px-4 py-3 text-left font-extrabold uppercase tracking-wider text-xs sm:text-sm border-r border-slate-200/80 last:border-r-0"
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
                      className="px-4 py-2.5 text-slate-800 font-semibold border-r border-slate-100 last:border-r-0"
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
