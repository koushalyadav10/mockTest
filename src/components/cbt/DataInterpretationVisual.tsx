"use client";

import React, { useState } from "react";
import { Table, BarChart2, PieChart as PieIcon, TrendingUp, ZoomIn, Eye } from "lucide-react";
import { Modal } from "../ui/Modal";

interface DataInterpretationVisualProps {
  questionNumber: number;
  subtopic?: string | null;
  questionText: string;
  hasVisualContent?: boolean;
  visualType?: string;
  imageUrl?: string | null;
}

/**
 * Derives consistent numeric values for years (2018-2023) based on question number.
 */
function getChartData(qNum: number) {
  const base = 100 + (qNum * 7) % 60;
  return [
    { year: "2018", itemX: base, itemY: base + 25, itemZ: base + 45 },
    { year: "2019", itemX: base + 15, itemY: base + 35, itemZ: base + 55 },
    { year: "2020", itemX: base + 30, itemY: base + 50, itemZ: base + 70 },
    { year: "2021", itemX: base + 55, itemY: base + 75, itemZ: base + 95 },
    { year: "2022", itemX: base + 70, itemY: base + 90, itemZ: base + 110 },
    { year: "2023", itemX: base + 95, itemY: base + 115, itemZ: base + 135 },
  ];
}

export const DataInterpretationVisual: React.FC<DataInterpretationVisualProps> = ({
  questionNumber,
  subtopic = "Tabular Chart",
  questionText,
  hasVisualContent,
  imageUrl,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const data = getChartData(questionNumber);

  // Normalize subtopic
  const normalized = (subtopic || "").toLowerCase();
  const isPie = normalized.includes("pie");
  const isBar = normalized.includes("bar");
  const isLine = normalized.includes("line");
  const isTable = normalized.includes("tab") || (!isPie && !isBar && !isLine);

  const hasMarkdownTable = questionText.includes("| Year |") || questionText.includes("| :--- |") || questionText.includes("|");

  // If question already contains a markdown table and has no image or SVG graph, let MathRenderer handle it cleanly
  if (isTable && hasMarkdownTable && !imageUrl) {
    return null;
  }

  // If question already has an external imageUrl uploaded, render the image prominently
  if (imageUrl) {
    return (
      <div className="my-3 p-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm block w-full max-w-3xl">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Official Question Diagram / Chart</span>
          </span>
          <button
            onClick={() => setIsZoomOpen(true)}
            className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200"
          >
            <ZoomIn className="w-3 h-3" />
            <span>Expand View</span>
          </button>
        </div>
        <img
          src={imageUrl}
          alt={`Question ${questionNumber} Diagram`}
          className="max-h-[440px] sm:max-h-[480px] w-auto mx-auto object-contain rounded-xl cursor-pointer hover:opacity-95 transition-all"
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

  // Render authentic SVG & Tabular charts for Data Interpretation
  return (
    <div className="my-3.5 p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm w-full max-w-3xl select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          {isTable && <Table className="w-4 h-4 text-indigo-600" />}
          {isBar && <BarChart2 className="w-4 h-4 text-blue-600" />}
          {isPie && <PieIcon className="w-4 h-4 text-emerald-600" />}
          {isLine && <TrendingUp className="w-4 h-4 text-amber-600" />}
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            {isTable && "Annual Production Data Table (in '000 Tonnes)"}
            {isBar && "Comparative Production Bar Graph (in '000 Tonnes)"}
            {isPie && "Market Share & Distribution (Pie Chart)"}
            {isLine && "Production Trend Line Graph (2018 - 2023)"}
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
          TCS Standard Data Grid
        </span>
      </div>

      {/* 1. Tabular Chart View */}
      {isTable && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs touch-pan-x">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm font-sans">
            <thead className="bg-slate-100/90 text-slate-800">
              <tr>
                <th className="px-4 py-2.5 text-left font-bold uppercase tracking-wider text-xs border-r border-slate-200">
                  Item / Year
                </th>
                {data.map((col) => (
                  <th key={col.year} className="px-3.5 py-2.5 text-center font-bold text-xs border-r border-slate-200 last:border-r-0">
                    {col.year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="hover:bg-indigo-50/40 transition-colors">
                <td className="px-4 py-2.5 font-bold text-indigo-900 border-r border-slate-200 bg-slate-50/50">
                  Item X
                </td>
                {data.map((col) => (
                  <td key={col.year} className="px-3.5 py-2.5 text-center font-bold text-slate-900 border-r border-slate-100 last:border-r-0">
                    {col.itemX}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 font-bold text-slate-800 border-r border-slate-200 bg-slate-50/50">
                  Item Y
                </td>
                {data.map((col) => (
                  <td key={col.year} className="px-3.5 py-2.5 text-center font-semibold text-slate-700 border-r border-slate-100 last:border-r-0">
                    {col.itemY}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 font-bold text-slate-800 border-r border-slate-200 bg-slate-50/50">
                  Item Z
                </td>
                {data.map((col) => (
                  <td key={col.year} className="px-3.5 py-2.5 text-center font-semibold text-slate-700 border-r border-slate-100 last:border-r-0">
                    {col.itemZ}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Bar Graph View */}
      {isBar && (
        <div className="py-2">
          <div className="h-56 sm:h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2 border-b border-l border-slate-300">
            {data.map((item, idx) => {
              const heightPercentX = Math.min(95, Math.max(25, (item.itemX / 260) * 100));
              const heightPercentY = Math.min(95, Math.max(25, (item.itemY / 260) * 100));
              return (
                <div key={item.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="flex items-end gap-1 w-full justify-center h-full">
                    <div
                      style={{ height: `${heightPercentX}%` }}
                      className="w-1/2 max-w-[24px] bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-md relative flex items-center justify-center transition-all group-hover:brightness-110 shadow-2xs"
                    >
                      <span className="absolute -top-5 text-[10px] font-bold text-slate-700">
                        {item.itemX}
                      </span>
                    </div>
                    <div
                      style={{ height: `${heightPercentY}%` }}
                      className="w-1/2 max-w-[24px] bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md relative flex items-center justify-center transition-all group-hover:brightness-110 shadow-2xs"
                    >
                      <span className="absolute -top-5 text-[10px] font-bold text-slate-700">
                        {item.itemY}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 mt-2">{item.year}</span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600" />
              <span>Item X</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500" />
              <span>Item Y</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Line Graph View */}
      {isLine && (
        <div className="py-2">
          <svg viewBox="0 0 500 200" className="w-full h-48 sm:h-56">
            {/* Grid Lines */}
            <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Line for Item X */}
            <polyline
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3"
              points="60,150 140,130 220,110 300,75 380,55 460,30"
            />
            {/* Dots */}
            {[
              { cx: 60, cy: 150, val: data[0].itemX, yr: data[0].year },
              { cx: 140, cy: 130, val: data[1].itemX, yr: data[1].year },
              { cx: 220, cy: 110, val: data[2].itemX, yr: data[2].year },
              { cx: 300, cy: 75, val: data[3].itemX, yr: data[3].year },
              { cx: 380, cy: 55, val: data[4].itemX, yr: data[4].year },
              { cx: 460, cy: 30, val: data[5].itemX, yr: data[5].year },
            ].map((p) => (
              <g key={p.cx}>
                <circle cx={p.cx} cy={p.cy} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                <text x={p.cx} y={p.cy - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e1b4b">
                  {p.val}
                </text>
                <text x={p.cx} y={188} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#64748b">
                  {p.yr}
                </text>
              </g>
            ))}
          </svg>
          <div className="flex items-center justify-center gap-2 mt-1 text-xs font-bold text-indigo-700">
            <span className="w-3 h-3 rounded-full bg-indigo-600" />
            <span>Production of Item X Trend (2018-2023)</span>
          </div>
        </div>
      )}

      {/* 4. Pie Chart View */}
      {isPie && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          <svg viewBox="0 0 200 200" className="w-44 h-44 shrink-0">
            {/* Slice 1: 35% */}
            <circle
              r="70"
              cx="100"
              cy="100"
              fill="transparent"
              stroke="#4f46e5"
              strokeWidth="40"
              strokeDasharray="154 440"
              strokeDashoffset="0"
            />
            {/* Slice 2: 25% */}
            <circle
              r="70"
              cx="100"
              cy="100"
              fill="transparent"
              stroke="#06b6d4"
              strokeWidth="40"
              strokeDasharray="110 440"
              strokeDashoffset="-154"
            />
            {/* Slice 3: 20% */}
            <circle
              r="70"
              cx="100"
              cy="100"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="40"
              strokeDasharray="88 440"
              strokeDashoffset="-264"
            />
            {/* Slice 4: 20% */}
            <circle
              r="70"
              cx="100"
              cy="100"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="40"
              strokeDasharray="88 440"
              strokeDashoffset="-352"
            />
            <text x="100" y="97" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">
              Total 100%
            </text>
            <text x="100" y="112" textAnchor="middle" fontSize="9" fontWeight="semibold" fill="#64748b">
              Production
            </text>
          </svg>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-indigo-50 border border-indigo-200">
              <span className="w-3 h-3 rounded-full bg-indigo-600" />
              <span>North Zone (35%)</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-cyan-50 border border-cyan-200">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <span>West Zone (25%)</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>South Zone (20%)</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>East Zone (20%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
