"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UploadDropzone } from "@/components/document/UploadDropzone";
import { ProcessingProgress } from "@/components/document/ProcessingProgress";
import { QuestionReviewEditor, ReviewQuestionItem } from "@/components/document/QuestionReviewEditor";
import { Button } from "@/components/ui/Button";
import { FileText, Sparkles, CheckCircle2, ArrowRight, BookOpen, PlayCircle, Eye, ArrowLeft, RefreshCw } from "lucide-react";
import { PipelineStep } from "@/lib/ai/types";
import Link from "next/link";

function UploadCenterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const docIdParam = searchParams.get("docId");

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(docIdParam || null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("Uploaded_Document.pdf");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsLog, setStepsLog] = useState<PipelineStep[]>([]);
  const [extractedQuestions, setExtractedQuestions] = useState<ReviewQuestionItem[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Fetch current user & documents list
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    loadDocumentsList();
  }, []);

  const loadDocumentsList = () => {
    fetch("/api/documents")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.documents) setUploadedDocs(data.documents);
      })
      .catch(() => {});
  };

  // If docId is in query params, load it automatically
  useEffect(() => {
    if (docIdParam) {
      loadDocumentQuestions(docIdParam);
    }
  }, [docIdParam]);

  const loadDocumentQuestions = async (id: string) => {
    try {
      setLoadingExisting(true);
      setErrorMessage(null);
      const res = await fetch(`/api/documents/${id}/status`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load document");

      setDocumentId(id);
      setUploadedFileName(data.document.fileName);
      setPdfUrl(`/uploads/${id}.pdf`);
      setExtractedQuestions(data.questions || []);
    } catch (err: any) {
      console.error("Error loading document:", err);
      setErrorMessage(err.message || "Failed to load document");
    } finally {
      setLoadingExisting(false);
    }
  };

  const startExtraction = async (params?: { file?: File; rawText?: string; title?: string }) => {
    try {
      setProcessing(true);
      setErrorMessage(null);
      setExtractedQuestions(null);
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
        // Pre-loaded SSC Model Paper
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

      // Trigger AI & OCR processing immediately in parallel with visual progress
      const processPromise = fetch(`/api/documents/${docId}/process`, {
        method: "POST",
      });

      // Smooth step pacing while backend processes
      let currentS = 1;
      const progressTimer = setInterval(() => {
        if (currentS < 14) {
          currentS++;
          setCurrentStep(currentS);
        }
      }, 180);

      const processRes = await processPromise;
      clearInterval(progressTimer);

      const processData = await processRes.json();
      if (!processRes.ok) throw new Error(processData.error || "Processing failed");

      // Set to step 15 (Human review ready)
      setCurrentStep(15);
      await new Promise((r) => setTimeout(r, 200));

      // Step 3: Fetch structured questions directly from the processed document
      const statusRes = await fetch(`/api/documents/${docId}/status`);
      const statusData = await statusRes.json();
      if (statusData.questions) {
        setExtractedQuestions(statusData.questions);
      }
      loadDocumentsList();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5a4bda] text-xs font-semibold mb-2 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" /> Dynamic Multi-Format OCR &amp; Document Parsing
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Document Upload &amp; Question Review Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload any question paper PDF, scanned book, image, or text file. Questions, LaTeX math equations, and options are extracted directly from your document.
          </p>
        </div>

        {extractedQuestions && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setExtractedQuestions(null);
              setDocumentId(null);
            }}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload Another Document
          </Button>
        )}
      </div>

      {/* Student Role Guard */}
      {currentUser?.role === "STUDENT" ? (
        <div className="p-8 bg-blue-50/70 border border-blue-200 rounded-2xl text-center space-y-4 max-w-lg mx-auto my-12 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-xl shadow-xs">
            🎓
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Faculty Feature Only</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Question Paper Upload &amp; OCR parsing is reserved for Faculty and Administrators. Candidates can take full CBT examinations from the Mock Tests catalog.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push("/exams")}
            className="w-full justify-center text-sm font-bold shadow-md"
          >
            Go to Available Mock Tests &rarr;
          </Button>
        </div>
      ) : (
        /* Main Workspace */
        !extractedQuestions ? (
          <div className="space-y-10">
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

            {/* List of previously processed uploaded question documents */}
            {!processing && uploadedDocs.length > 0 && (
              <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Your Uploaded Question Papers &amp; OCR Sets ({uploadedDocs.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Click to review extracted questions or launch mock test
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{doc.fileName}</span>
                          {doc.isPublic ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Live
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              Saved
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {doc.questionCount} Questions Extracted &bull; {doc.pageCount} Pages &bull; {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadDocumentQuestions(doc.id)}
                          className="text-purple-700 border-purple-200 hover:bg-purple-50 text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Review Questions ({doc.questionCount})
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            fetch("/api/tests", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ mode: "MOCK", documentId: doc.id }),
                            })
                              .then((r) => r.json())
                              .then((d) => {
                                if (d.testAttemptId) router.push(`/mock/${d.testAttemptId}/instructions`);
                              });
                          }}
                          className="text-xs font-bold"
                        >
                          <PlayCircle className="w-3.5 h-3.5 mr-1" />
                          Test CBT
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExtractedQuestions(null)}
                  className="bg-white hover:bg-slate-50 text-xs"
                >
                  &larr; Switch Paper
                </Button>
                <Button variant="primary" size="sm" onClick={handleGenerateTest} className="text-xs font-bold">
                  Launch Mock Test &rarr;
                </Button>
              </div>
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
        )
      )}
    </div>
  );
}

export default function UploadCenterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-sm">Loading workspace...</div>}>
      <UploadCenterContent />
    </Suspense>
  );
}
