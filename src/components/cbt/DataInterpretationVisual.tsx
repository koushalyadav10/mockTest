"use client";

import React, { useState } from "react";
import { ZoomIn, Eye } from "lucide-react";
import { Modal } from "../ui/Modal";

interface DataInterpretationVisualProps {
  questionNumber: number;
  subtopic?: string | null;
  questionText: string;
  hasVisualContent?: boolean;
  visualType?: string;
  imageUrl?: string | null;
}

export const DataInterpretationVisual: React.FC<DataInterpretationVisualProps> = ({
  questionNumber,
  imageUrl,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // If question has an external imageUrl uploaded, render the image prominently
  if (imageUrl) {
    return (
      <div className="my-1.5 sm:my-2 p-2 sm:p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs block w-full max-w-2xl touch-pan-x touch-pan-y overscroll-contain [-webkit-overflow-scrolling:touch]">
        <div className="flex items-center justify-between pb-1 sm:pb-1.5 mb-1 sm:mb-1.5 border-b border-slate-100 text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Official Question Diagram / Chart</span>
          </span>
          <button
            onClick={() => setIsZoomOpen(true)}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200"
          >
            <ZoomIn className="w-3 h-3" />
            <span>Expand</span>
          </button>
        </div>
        <img
          src={imageUrl}
          alt={`Question ${questionNumber} Diagram`}
          className="max-h-[220px] sm:max-h-[340px] landscape:max-h-[150px] w-auto mx-auto object-contain rounded-lg cursor-pointer hover:opacity-95 transition-all"
          onClick={() => setIsZoomOpen(true)}
        />
        {isZoomOpen && (
          <Modal isOpen={isZoomOpen} onClose={() => setIsZoomOpen(false)} title={`Question ${questionNumber} Diagram`}>
            <div className="p-4 flex justify-center bg-white">
              <img src={imageUrl} alt="Zoomed Diagram" className="max-h-[80vh] object-contain rounded" />
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // Never render fake synthetic tables or mismatched hardcoded mock data.
  // Real datasets are provided directly in the question/direction text as authentic Markdown tables.
  return null;
};
