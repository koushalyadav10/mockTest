"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onTextSubmit?: (text: string, title: string) => void;
  isProcessing?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelect,
  onTextSubmit,
  isProcessing = false,
}) => {
  const [activeTab, setActiveTab] = useState<"FILE" | "TEXT">("FILE");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pastedTitle, setPastedTitle] = useState("Custom Question Paper");
  const [pastedText, setPastedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".txt"];

  const validateAndProceed = (file: File) => {
    setErrorMsg(null);
    const fileName = (file.name || "").toLowerCase();
    const rawType = (file.type || "").toLowerCase();

    const hasAllowedExt = allowedExtensions.some((ext) => fileName.endsWith(ext));
    const hasAllowedMime =
      rawType === "application/pdf" ||
      rawType === "application/x-pdf" ||
      rawType.startsWith("image/") ||
      rawType === "text/plain";

    if (!hasAllowedExt && !hasAllowedMime) {
      setErrorMsg("Invalid file format. Please upload a PDF, PNG, JPG, WEBP, or TXT file.");
      return;
    }

    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB
    if (file.size > maxSizeBytes) {
      setErrorMsg("File exceeds the maximum 25 MB limit.");
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProceed(e.dataTransfer.files[0]);
    }
  };

  const handleTextExtract = () => {
    if (!pastedText.trim()) {
      setErrorMsg("Please paste some question text before extracting.");
      return;
    }
    setErrorMsg(null);
    if (onTextSubmit) {
      onTextSubmit(pastedText.trim(), pastedTitle.trim() || "Custom Question Paper");
    }
  };

  const loadSampleBankingText = () => {
    setPastedTitle("Banking & Quantitative Aptitude Quiz");
    setPastedText(`1. If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so that total expenditure remains unchanged?
(A) 15%
(B) 18%
(C) 20%
(D) 25%
(E) None of these

2. A sum of money doubles itself at simple interest in 8 years. In how many years will it triple itself?
(A) 12 years
(B) 14 years
(C) 16 years
(D) 18 years
(E) 20 years

3. What is 35% of 400 plus 45% of 240?
(A) 248
(B) 236
(C) 240
(D) 250
(E) 244

4. A train 180 meters long is running at 72 km/h. How many seconds will it take to pass an electric pole?
(A) 9 seconds
(B) 10 seconds
(C) 8 seconds
(D) 12 seconds
(E) 15 seconds

5. The average of 5 consecutive odd numbers is 27. What is the largest of these numbers?
(A) 29
(B) 31
(C) 33
(D) 35
(E) 27

Correct Answers:
1 2 3 4 5
C C A A B`);
  };

  const loadSampleSSCText = () => {
    setPastedTitle("SSC CHSL Model Questions");
    setPastedText(`1. Select the option that is related to the third word in the same way as the second word is related to the first word.
Thermometer : Temperature :: Barometer : ?
(A) Atmospheric Pressure
(B) Humidity
(C) Wind Speed
(D) Precipitation

2. Which Article of the Indian Constitution provides for the 'Right to Equality'?
(A) Articles 14 - 18
(B) Articles 19 - 22
(C) Articles 23 - 24
(D) Articles 25 - 28

3. Identify the segment with a grammatical error:
Neither the teacher nor the students was present in the hall.
(A) Neither the teacher
(B) nor the students was present
(C) in the hall
(D) No error

Answers:
1: A, 2: A, 3: B`);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setActiveTab("FILE");
            setErrorMsg(null);
          }}
          className={`flex-1 py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2 ${
            activeTab === "FILE"
              ? "bg-white text-blue-700 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload PDF / Image / Document</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("TEXT");
            setErrorMsg(null);
          }}
          className={`flex-1 py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2 ${
            activeTab === "TEXT"
              ? "bg-white text-blue-700 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paste Question Paper Text Directly</span>
        </button>
      </div>

      {activeTab === "FILE" ? (
        /* Tab 1: File Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-100"
              : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,application/pdf,image/*,text/plain"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                validateAndProceed(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-semibold text-slate-800">
                Drag and drop your question paper or image
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                Upload scanned PDFs, native question papers, text files, or captured photos. English, Hindi &amp; Bilingual text supported.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 flex-wrap justify-center">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> PDF up to 25MB
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> PNG, JPG, WEBP
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" /> Plain Text (.txt)
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              isLoading={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-2"
            >
              Browse from Device
            </Button>
          </div>
        </div>
      ) : (
        /* Tab 2: Paste Raw Text Workspace */
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quiz / Paper Title
              </label>
              <input
                type="text"
                value={pastedTitle}
                onChange={(e) => setPastedTitle(e.target.value)}
                placeholder="e.g. Percentage & Profit Loss Mock Test"
                className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>
            <div className="flex items-end gap-1.5 pt-5">
              <button
                type="button"
                onClick={loadSampleBankingText}
                className="text-[11px] px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100 font-medium"
              >
                + Banking 5-Opt Sample
              </button>
              <button
                type="button"
                onClick={loadSampleSSCText}
                className="text-[11px] px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200 hover:bg-slate-200 font-medium"
              >
                + SSC 4-Opt Sample
              </button>
              {pastedText && (
                <button
                  type="button"
                  onClick={() => setPastedText("")}
                  className="text-[11px] px-2 py-1.5 text-red-600 hover:text-red-800 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Paste Questions, Options &amp; Answer Keys
            </label>
            <textarea
              rows={12}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={`Paste any text containing questions here...\n\nExample:\n1. What is the value of 25% of 80?\n(A) 15\n(B) 20\n(C) 25\n(D) 30\n\n2. Which gas do plants absorb during photosynthesis?\n(A) Oxygen\n(B) Nitrogen\n(C) Carbon Dioxide\n(D) Hydrogen\n\nCorrect Answers:\n1 2\nB C`}
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 leading-relaxed text-slate-800"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>Supports (A)-(D), (A)-(E), Hindi/English, and table or sequential answer keys.</span>
              <span>{pastedText.length} characters</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isProcessing}
              disabled={!pastedText.trim()}
              onClick={handleTextExtract}
              className="px-6 shadow-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Extract Questions from Pasted Text &rarr;
            </Button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
