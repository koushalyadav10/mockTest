"use client";

import React from "react";
import katex from "katex";

interface MathRendererProps {
  text: string;
  className?: string;
}

/**
 * MathRenderer parses inline math ($...$) and block math ($$...$$) using KaTeX.
 * If text contains no math delimiters, it renders plain clean text.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // Split text by both $$...$$ and $...$
  const parts: React.ReactNode[] = [];
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(text)) !== null) {
    // Add text preceding the math match
    if (match.index > lastIndex) {
      const plainText = text.substring(lastIndex, match.index);
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-line">
          {plainText}
        </span>
      );
    }

    const rawMatch = match[0];
    const isBlock = rawMatch.startsWith("$$") && rawMatch.endsWith("$$");
    const formula = isBlock ? rawMatch.slice(2, -2).trim() : rawMatch.slice(1, -1).trim();

    try {
      const html = katex.renderToString(formula, {
        displayMode: isBlock,
        throwOnError: false,
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

  // Append any trailing plain text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`} className="whitespace-pre-line">
        {text.substring(lastIndex)}
      </span>
    );
  }

  return <div className={`font-sans leading-relaxed text-slate-900 ${className}`}>{parts}</div>;
};
