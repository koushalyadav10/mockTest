"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/document/UploadDropzone";
import { ProcessingProgress } from "@/components/document/ProcessingProgress";
import { QuestionReviewEditor, ReviewQuestionItem } from "@/components/document/QuestionReviewEditor";
import { Button } from "@/components/ui/Button";
import { FileText, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { PipelineStep } from "@/lib/ai/types";

export default function UploadCenterPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("Uploaded_Document.pdf");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsLog, setStepsLog] = useState<PipelineStep[]>([]);
  const [extractedQuestions, setExtractedQuestions] = useState<ReviewQuestionItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startExtraction = async (params?: { file?: File; rawText?: string; title?: string }) => {
    try {
      setProcessing(true);
      setErrorMessage(null);
      setCurrentStep(1);

      let uploadRes: Response;

      if (params?.rawText) {
        // Direct Raw Text Paste
        const title = params.title || "Custom_Question_Paper";
        const fileName = `${title.replace(/\s+/g, "_")}.txt`;
        setUploadedFileName(fileName);

        uploadRes = await fetch("/api/documents/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rawText: params.rawText,
            fileName,
          }),
        });
      } else if (params?.file) {
        // File Upload (PDF, Image, TXT)
        const selectedFile = params.file;
        const formData = new FormData();
        formData.append("file", selectedFile);
        setUploadedFileName(selectedFile.name);

        uploadRes = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });
      } else {
        // Fallback demo paper file
        const blob = new Blob(["Sample SSC Question Paper Content"], { type: "application/pdf" });
        const formData = new FormData();
        formData.append("file", blob, "SSC_CHSL_Tier1_Official_Model_Paper_2026.pdf");
        setUploadedFileName("SSC_CHSL_Tier1_Official_Model_Paper_2026.pdf");

        uploadRes = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });
      }

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      const docId = uploadData.documentId;
      setDocumentId(docId);
      if (uploadData.fileName) setUploadedFileName(uploadData.fileName);
      if (uploadData.pdfUrl) setPdfUrl(uploadData.pdfUrl);

      // Active step progression
      for (let s = 2; s <= 14; s++) {
        setCurrentStep(s);
        await new Promise((r) => setTimeout(r, 120));
      }

      // Step 2: Trigger processing with real extracted text
      const processRes = await fetch(`/api/documents/${docId}/process`, {
        method: "POST",
      });
      const processData = await processRes.json();
      if (!processRes.ok) throw new Error(processData.error || "Processing failed");

      setCurrentStep(15);

      // Step 3: Fetch structured questions
      const statusRes = await fetch(`/api/documents/${docId}/status`);
      const statusData = await statusRes.json();
      if (statusData.questions) {
        setExtractedQuestions(statusData.questions);
      }
    } catch (err: any) {
      console.error("Extraction error:", err);
      setErrorMessage(err.message || "Document processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateTest = async () => {
    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "MOCK",
          documentId: documentId || undefined,
        }),
      });
      const data = await res.json();
      if (data.testAttemptId) {
        router.push(`/mock/${data.testAttemptId}/instructions`);
      }
    } catch (e) {
      console.error("Failed to generate test:", e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" /> 15-Stage AI Document Understanding
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Document Upload &amp; OCR Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Extract questions, diagrams, Hindi/English text, and options into clean structured CBT question items
          </p>
        </div>

        {!processing && !extractedQuestions && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => startExtraction()}
            className="border-blue-300 text-blue-700 bg-blue-50/50 hover:bg-blue-100"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Try Pre-loaded SSC Sample Paper
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      {!extractedQuestions ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {!processing ? (
            <UploadDropzone
              onFileSelect={(f) => {
                setFile(f);
                startExtraction({ file: f });
              }}
              onTextSubmit={(text, title) => {
                startExtraction({ rawText: text, title });
              }}
              isProcessing={processing}
            />
          ) : (
            <ProcessingProgress
              currentStep={currentStep}
              totalSteps={15}
              steps={stepsLog}
              isFailed={Boolean(errorMessage)}
              errorMessage={errorMessage}
            />
          )}
        </div>
      ) : (
        /* Question Review Editor Workspace */
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs sm:text-sm text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>Extraction Complete:</strong> Successfully parsed {extractedQuestions.length} questions from <em>{uploadedFileName}</em> with formulas and options.
              </span>
            </div>
            <Button variant="primary" size="sm" onClick={handleGenerateTest}>
              Launch Mock Test &rarr;
            </Button>
          </div>

          <QuestionReviewEditor
            questions={extractedQuestions}
            fileName={uploadedFileName}
            documentId={documentId || undefined}
            pdfUrl={pdfUrl}
            onSaveQuestion={(updated) => {
              fetch(`/api/questions/${updated.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
              }).catch(console.error);
            }}
            onDeleteQuestion={(id) => {
              setExtractedQuestions((prev) => prev?.filter((q) => q.id !== id) || []);
              fetch(`/api/questions/${id}`, { method: "DELETE" }).catch(console.error);
            }}
            onGenerateTest={handleGenerateTest}
          />
        </div>
      )}
    </div>
  );
}
