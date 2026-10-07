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

  const [selectedSubject, setSelectedSubject] = useState<string>("GK_GS");
  const [publishedModal, setPublishedModal] = useState<{
    isOpen: boolean;
    examId?: string;
    testAttemptId?: string;
    title: string;
    questionCount: number;
    subject: string;
  } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

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
      const isPdfDoc = data.document.fileName?.toLowerCase().endsWith(".pdf");
      setPdfUrl(isPdfDoc ? `/uploads/${id}.pdf` : null);
      setExtractedQuestions(data.questions || []);
      if (data.questions?.some((q: any) => q.subject === "General Awareness")) {
        setSelectedSubject("GK_GS");
      }
    } catch (err: any) {
      console.error("Error loading document:", err);
      setErrorMessage(err.message || "Failed to load document");
    } finally {
      setLoadingExisting(false);
    }
  };

  const startExtraction = async (params?: { file?: File; rawText?: string; title?: string; targetSubject?: string }) => {
    try {
      setProcessing(true);
      setErrorMessage(null);
      setExtractedQuestions(null);
      setCurrentStep(1);

      const targetSub = params?.targetSubject || selectedSubject;
      if (params?.targetSubject) setSelectedSubject(params.targetSubject);

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
            targetSubject: targetSub,
          }),
        });
      } else if (params?.file) {
        // File Upload (PDF, Image, TXT)
        const selectedFile = params.file;
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("targetSubject", targetSub);
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
        formData.append("targetSubject", targetSub);
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
      if (uploadData.fileName?.toLowerCase().endsWith(".pdf")) {
        setPdfUrl(uploadData.pdfUrl || `/uploads/${docId}.pdf`);
      } else {
        setPdfUrl(null);
      }

      // Trigger AI & OCR processing with targetSubject
      const processPromise = fetch(`/api/documents/${docId}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetSubject: targetSub }),
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
      setIsPublishing(true);
      if (!documentId) throw new Error("No active document to publish");

      // 1. Publish document so it exists as ExamConfig under target subject
      const pubRes = await fetch(`/api/admin/documents/${documentId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: selectedSubject }),
      });
      const pubData = await pubRes.json();
      const examId = pubData.exam?.id;

      // 2. Generate CBT test attempt
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "MOCK",
          documentId,
          examConfigId: examId,
        }),
      });
      const data = await res.json();

      setPublishedModal({
        isOpen: true,
        examId,
        testAttemptId: data.testAttemptId,
        title: uploadedFileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        questionCount: extractedQuestions?.length || 30,
        subject: selectedSubject,
      });

      loadDocumentsList();
    } catch (e: any) {
      console.error("Failed to generate test:", e);
      alert(e.message || "Failed to publish paper and create mock test.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#5a4bda] text-xs font-bold mb-2 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Dynamic Multi-Format OCR &amp; Document Parsing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Document Upload &amp; Question Review Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Upload question papers in PDF, images, scanned pages, or plain text. Our layout-aware AI automatically extracts questions, mathematical formulas, answer keys, and previous-year exam tags into a verified CBT format.
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
            className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs font-bold"
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
          <div className="space-y-8">
            {/* AI Capabilities Cards */}
            {!processing && (
              <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <span className="text-amber-500 text-sm">🏛️</span>
                    <span>Smart PYQ &amp; Year Detection</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Isolates exam citations (e.g. <i>SSC CHSL — 10 March 2023</i>) into an authentic top badge without cluttering question text.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <span className="text-indigo-500 text-sm">🧠</span>
                    <span>Context-Aware Safe Parsing</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Distinguishes historical dates (1857, 1919, 1947) in questions from exam tags so your questions stay 100% accurate.
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <span className="text-emerald-500 text-sm">⚡</span>
                    <span>Multi-Format &amp; Answer Keys</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Extracts A-D/A-E options, aligns answer keys, parses Hindi/English bilingual papers, and processes equations.
                  </p>
                </div>
              </div>
            )}

            <div className="max-w-4xl mx-auto space-y-6">
              {!processing ? (
                <UploadDropzone
                  onFileSelect={(f, targetSub) => {
                    setFile(f);
                    if (targetSub) setSelectedSubject(targetSub);
                    startExtraction({ file: f, targetSubject: targetSub });
                  }}
                  onTextSubmit={(text, title, targetSub) => {
                    if (targetSub) setSelectedSubject(targetSub);
                    startExtraction({ rawText: text, title, targetSubject: targetSub });
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateTest}
                  isLoading={isPublishing}
                  className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlayCircle className="w-3.5 h-3.5 mr-1" />
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

      {/* Success Publication Modal */}
      {publishedModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-sm">
              🎉
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Aap Ka Paper Public Ho Gya Hai!
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Examination Published Successfully
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Aap ka paper official CBT mock test catalog mai live publish ho chuka hai. Candidates is test ko attempt kar sakte hain.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-left font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500">Test Title:</span>
                <span className="font-bold text-slate-800 truncate max-w-[240px]">{publishedModal.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subject Module:</span>
                <span className="font-bold text-indigo-700">
                  {publishedModal.subject === "GK_GS" ? "🌍 GK & GS (General Awareness)" : "📐 Mathematics"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Questions:</span>
                <span className="font-bold text-slate-800 font-mono">{publishedModal.questionCount} Questions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live in Catalog
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {publishedModal.testAttemptId && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push(`/mock/${publishedModal.testAttemptId}/instructions`)}
                  className="w-full justify-center text-xs font-bold shadow-md bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlayCircle className="w-4 h-4 mr-1.5" />
                  Take CBT Test Now &rarr;
                </Button>
              )}
              <Button
                variant="outline"
                size="md"
                onClick={() => router.push(`/exams?subject=${publishedModal.subject}`)}
                className="w-full justify-center text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <BookOpen className="w-4 h-4 mr-1.5" />
                View in Subject Catalog
              </Button>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setPublishedModal(null)}
                className="text-[11px] text-slate-400 hover:text-slate-600 font-medium underline"
              >
                Stay on review workspace
              </button>
            </div>
          </div>
        </div>
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
