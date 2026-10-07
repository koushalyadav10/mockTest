"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface UploadDropzoneProps {
  onFileSelect: (file: File, targetSubject?: string) => void;
  onTextSubmit?: (text: string, title: string, targetSubject?: string) => void;
  isProcessing?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelect,
  onTextSubmit,
  isProcessing = false,
}) => {
  const [activeTab, setActiveTab] = useState<"FILE" | "TEXT">("FILE");
  const [targetSubject, setTargetSubject] = useState<string>("GK_GS");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pastedTitle, setPastedTitle] = useState("SSC CHSL GS Practice Paper");
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

    onFileSelect(file, targetSubject);
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
      onTextSubmit(pastedText.trim(), pastedTitle.trim() || "Custom Question Paper", targetSubject);
    }
  };

  const loadSampleGSText = () => {
    setTargetSubject("GK_GS");
    setPastedTitle("SSC CHSL – 30 Most Important GS Questions");
    setPastedText(`1. Which Article of the Indian Constitution provides for the Right to Equality?
SSC CHSL — 09 March 2023
(A) Article 14
(B) Article 19
(C) Article 21
(D) Article 32

2. Who was the first Governor-General of independent India?
SSC CGL 2022 Tier-1
(A) Lord Mountbatten
(B) C. Rajagopalachari
(C) Warren Hastings
(D) Lord Canning

3. Which river is known as the "Sorrow of Bihar"?
SSC MTS 2023
(A) Ganga
(B) Kosi
(C) Yamuna
(D) Son

4. What is the SI unit of electric current?
SSC CPO 2022
(A) Volt
(B) Ohm
(C) Ampere
(D) Watt

5. Who wrote the book Discovery of India?
[SSC CHSL 15 March 2023]
(A) Mahatma Gandhi
(B) Jawaharlal Nehru
(C) Sardar Patel
(D) B. R. Ambedkar

6. Which is the largest planet in our Solar System?
SSC GD 2022
(A) Earth
(B) Saturn
(C) Jupiter
(D) Neptune

7. The Battle of Plassey was fought in which year?
SSC CHSL 2021
(A) 1757
(B) 1764
(C) 1857
(D) 1773

8. Which vitamin is mainly produced in the human body when exposed to sunlight?
SSC MTS 2022 Shift-2
(A) Vitamin A
(B) Vitamin B12
(C) Vitamin C
(D) Vitamin D

9. Who is known as the "Father of the Indian Constitution"?
SSC CGL 2023
(A) Mahatma Gandhi
(B) B. R. Ambedkar
(C) Jawaharlal Nehru
(D) Rajendra Prasad

10. Which state has the longest coastline in India?
SSC CHSL — 10 March 2023
(A) Maharashtra
(B) Tamil Nadu
(C) Gujarat
(D) Andhra Pradesh

Correct Answers:
1: A, 2: A, 3: B, 4: C, 5: B, 6: C, 7: A, 8: D, 9: B, 10: C`);
  };

  const loadSampleBankingText = () => {
    setTargetSubject("MATHS");
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
    setPastedTitle("SSC CHSL Quantitative Aptitude Practice");
    setPastedText(`1. Two pipes A and B can fill a tank in 12 hours and 15 hours respectively. If both pipes are opened together, in how many hours will the tank be filled?
(A) 6.67 hours
(B) 7.5 hours
(C) 8 hours
(D) 9 hours

2. A train 180 metres long is running at 72 km/h. How many seconds will it take to pass an electric pole?
(A) 8 seconds
(B) 9 seconds
(C) 10 seconds
(D) 12 seconds

3. If the price of sugar increases by 20%, by what percentage must a household reduce its consumption so that total expenditure remains unchanged?
(A) 16.67%
(B) 20%
(C) 25%
(D) 15%

Answers:
1: A, 2: B, 3: A`);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-5">
      {/* Target Subject Curriculum Module Selector */}
      <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-slate-200/60">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold">1</span>
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Target Subject Module / विषय चुनें
            </span>
            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full font-bold">
              Required
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Questions will be organized under this subject catalog
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: "GK_GS", name: "GK & GS", icon: "🌍", desc: "General Awareness", hindi: "सामान्य ज्ञान" },
            { id: "MATHS", name: "Mathematics", icon: "📐", desc: "Quant Aptitude", hindi: "गणित" },
            { id: "REASONING", name: "Reasoning", icon: "🧠", desc: "General Intelligence", hindi: "तर्कशक्ति" },
            { id: "ENGLISH", name: "English", icon: "📖", desc: "Language & Vocab", hindi: "अंग्रेजी" },
            { id: "HINDI", name: "Hindi", icon: "🇮🇳", desc: "General Hindi", hindi: "सामान्य हिंदी" },
          ].map((s) => {
            const isSelected = targetSubject === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setTargetSubject(s.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between relative group ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/80"
                    : "bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 border-slate-200 shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{s.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40" />
                    )}
                  </div>
                  <div className="mt-2 font-black text-xs tracking-tight">
                    {s.name}
                  </div>
                  <div className={`text-[10px] ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                    {s.hindi}
                  </div>
                </div>
                <div className={`text-[10px] mt-2 pt-1 border-t ${
                  isSelected ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-400"
                }`}>
                  {s.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold">2</span>
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Choose Upload Method / अपलोड विधि
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab("FILE");
              setErrorMsg(null);
            }}
            className={`py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "FILE"
                ? "bg-white text-blue-700 shadow-xs border border-slate-200 font-extrabold"
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
            className={`py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "TEXT"
                ? "bg-white text-blue-700 shadow-xs border border-slate-200 font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Question Paper Text Directly</span>
          </button>
        </div>
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
            <div className="flex items-end gap-1.5 pt-5 flex-wrap">
              <button
                type="button"
                onClick={loadSampleGSText}
                className="text-[11px] px-2.5 py-1.5 bg-amber-50 text-amber-800 rounded-md border border-amber-300 hover:bg-amber-100 font-bold"
              >
                + GS 30 Sample (CHSL)
              </button>
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

          {/* Smart AI Guidance Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
            <span className="text-base leading-none">💡</span>
            <div className="space-y-0.5">
              <span className="font-bold text-amber-900">AI PYQ &amp; Exam Year Detection:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                You can write previous year question citations like <code className="bg-amber-100/90 px-1 py-0.5 rounded text-amber-950 font-mono font-bold">SSC CHSL — 10 March 2023</code> or <code className="bg-amber-100/90 px-1 py-0.5 rounded text-amber-950 font-mono font-bold">[SSC CGL 2022]</code>. Our AI parser isolates the exam tag into its own dedicated badge box, keeping your question text clean and uncluttered. Historical/factual years in questions are safely preserved.
              </p>
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
