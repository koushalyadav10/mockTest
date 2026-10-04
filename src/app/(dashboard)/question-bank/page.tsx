"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MathRenderer } from "@/components/math/MathRenderer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FileText,
  Clock,
  Calendar,
  Layers,
  BookOpen,
  Search,
  Filter,
  Trash2,
  Edit3,
  PlayCircle,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  CheckCheck,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FolderOpen,
  Eye,
  RefreshCw,
  Globe,
  BarChart2,
  Download,
  Mail,
  Send,
  X,
  Shield,
  Lock,
  Unlock,
  ExternalLink,
} from "lucide-react";

interface DocumentItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  pageCount: number;
  isScanned: boolean;
  status: string;
  processingStep: string;
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  publishedExamId?: string | null;
  questionCount: number;
  subjectBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  pendingReviewCount: number;
}

interface QuestionItem {
  id: string;
  questionNumber: number;
  subject: string;
  topic: string;
  subtopic?: string | null;
  difficulty: string;
  questionType?: string;
  source?: string;
  language: string;
  questionText: string;
  hasVisualContent: boolean;
  visualType?: string;
  sourceAnswer?: string | null;
  aiSuggestedAnswer?: string | null;
  verifiedAnswer?: string | null;
  requiresReview: boolean;
  status: string;
  confidence: {
    question: number;
    options: number;
    classification: number;
    answer: number;
  };
  options: { id: string; stableId: string; label: string; text: string; isCorrect: boolean }[];
}

export default function QuestionBankPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Primary navigation: "DOCUMENTS" (File Cards) or "QUESTIONS" (All Flat List)
  const [activeTab, setActiveTab] = useState<"DOCUMENTS" | "QUESTIONS">("DOCUMENTS");
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  // Documents state
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [creatingMockDocId, setCreatingMockDocId] = useState<string | null>(null);

  // Questions state
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [questionSearchQuery, setQuestionSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Publish & Results Inspection State
  const [publishingDocId, setPublishingDocId] = useState<string | null>(null);
  const [resultsModalDoc, setResultsModalDoc] = useState<DocumentItem | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailNotes, setEmailNotes] = useState("");
  const [targetCandidateEmail, setTargetCandidateEmail] = useState("");
  const [isSendingEmails, setIsSendingEmails] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<string | null>(null);

  // Fetch Documents List
  const fetchDocuments = () => {
    setDocsLoading(true);
    fetch("/api/documents")
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch((err) => console.error("Error loading documents:", err))
      .finally(() => setDocsLoading(false));
  };

  // Fetch Questions (optionally scoped to selected document)
  const fetchQuestions = (docId?: string) => {
    setQuestionsLoading(true);
    const params = new URLSearchParams();
    if (docId) params.append("documentId", docId);
    if (subjectFilter !== "ALL") params.append("subject", subjectFilter);
    if (difficultyFilter !== "ALL") params.append("difficulty", difficultyFilter);
    if (typeFilter !== "ALL") params.append("questionType", typeFilter);
    if (sourceFilter !== "ALL") params.append("source", sourceFilter);
    if (statusFilter !== "ALL") params.append("status", statusFilter);
    if (questionSearchQuery) params.append("search", questionSearchQuery);

    fetch(`/api/questions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) setQuestions(data.questions);
      })
      .catch((err) => console.error("Error loading questions:", err))
      .finally(() => setQuestionsLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          if (data.user.role === "STUDENT") {
            router.push("/exams");
          }
        }
      })
      .catch(() => {});
    fetchDocuments();
  }, [router]);

  useEffect(() => {
    if (activeTab === "QUESTIONS" || selectedDoc) {
      fetchQuestions(selectedDoc?.id);
    }
  }, [activeTab, selectedDoc, subjectFilter, difficultyFilter, typeFilter, sourceFilter, statusFilter]);

  // Format Date & Time nicely: e.g. "20 Sep 2026, 01:45 PM"
  const formatUploadTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return isoString;
    }
  };

  // Format File Size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 1-Click Mock Test from a specific Document / Paper
  const handleCreateMockFromDocument = async (docId: string) => {
    try {
      setCreatingMockDocId(docId);
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: docId,
          mode: "MOCK",
        }),
      });
      const data = await res.json();
      if (data.testAttemptId) {
        router.push(`/mock/${data.testAttemptId}/instructions`);
      } else {
        alert(data.error || "Failed to create mock test from this paper.");
      }
    } catch (e: any) {
      alert("Error generating test: " + e.message);
    } finally {
      setCreatingMockDocId(null);
    }
  };

  // Delete Document and associated questions
  const handleDeleteDocument = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete paper '${docName}' and all its extracted questions?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        if (selectedDoc?.id === docId) {
          setSelectedDoc(null);
        }
        fetchDocuments();
      } else {
        alert(data.error || "Failed to delete document");
      }
    } catch (e: any) {
      alert("Error deleting document: " + e.message);
    }
  };

  // Toggle Public Live Examination Status (Make Public / Unpublish)
  const handleTogglePublish = async (doc: DocumentItem) => {
    try {
      setPublishingDocId(doc.id);
      const isPublishing = !doc.isPublic;
      const method = isPublishing ? "POST" : "DELETE";
      const res = await fetch(`/api/admin/documents/${doc.id}/publish`, { method });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
        if (selectedDoc && selectedDoc.id === doc.id) {
          setSelectedDoc({ ...selectedDoc, isPublic: isPublishing });
        }
        alert(data.message || (isPublishing ? "Paper is now public for students!" : "Paper unpublished."));
      } else {
        alert(data.error || "Failed to update publish status");
      }
    } catch (e: any) {
      alert("Error publishing paper: " + e.message);
    } finally {
      setPublishingDocId(null);
    }
  };

  // Open Results & Scorecard Inspection Modal
  const handleOpenResultsModal = async (doc: DocumentItem) => {
    setResultsModalDoc(doc);
    setResultsLoading(true);
    setResultsData(null);
    setEmailFeedback(null);
    try {
      const res = await fetch(`/api/admin/documents/${doc.id}/results`);
      const data = await res.json();
      if (data.success) {
        setResultsData(data);
        if (data.results && data.results.length > 0) {
          // Pre-populate candidate email from first student attempt if available
          const firstCandidate = data.results.find((r: any) => r.studentEmail && !r.studentEmail.toLowerCase().includes("admin"));
          if (firstCandidate) {
            setTargetCandidateEmail(firstCandidate.studentEmail);
          } else if (data.results[0]?.studentEmail) {
            setTargetCandidateEmail(data.results[0].studentEmail);
          }
        }
      } else {
        alert(data.error || "Failed to fetch candidate results");
      }
    } catch (e: any) {
      alert("Error fetching results: " + e.message);
    } finally {
      setResultsLoading(false);
    }
  };

  // Dispatch Official Evaluated Scorecards via Email
  const handleSendEmails = async () => {
    if (!resultsModalDoc) return;
    try {
      setIsSendingEmails(true);
      setEmailFeedback(null);
      const res = await fetch(`/api/admin/documents/${resultsModalDoc.id}/notify-results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customSubject: emailSubject.trim() || undefined,
          customMessage: emailNotes.trim() || undefined,
          targetEmail: targetCandidateEmail.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailFeedback(data.message || `Dispatched scorecards to ${data.dispatchedCount} candidates!`);
        setTimeout(() => setShowEmailModal(false), 2500);
      } else {
        alert(data.error || "Failed to dispatch email notifications");
      }
    } catch (e: any) {
      alert("Error dispatching emails: " + e.message);
    } finally {
      setIsSendingEmails(false);
    }
  };

  // Question Selection Helpers
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === questions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(questions.map((q) => q.id)));
    }
  };

  const handleBulkAction = async (action: string, payload?: any) => {
    if (selectedIds.size === 0) return;
    try {
      setBulkActionLoading(true);
      const res = await fetch("/api/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIds: Array.from(selectedIds),
          action,
          payload,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedIds(new Set());
        fetchQuestions(selectedDoc?.id);
        fetchDocuments();
      } else {
        alert(data.error || "Bulk action failed");
      }
    } catch (e: any) {
      alert("Error performing bulk action: " + e.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Filtered documents by search
  const filteredDocs = documents.filter((d) =>
    d.fileName.toLowerCase().includes(docSearchQuery.toLowerCase().trim())
  );

  const totalQuestionsAcrossAll = documents.reduce((acc, d) => acc + d.questionCount, 0);

  if (currentUser?.role === "STUDENT") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 bg-blue-50/70 border border-blue-200 rounded-2xl text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-xl shadow-xs">
            🎓
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Faculty Feature Only</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Managing raw question banks and examination papers is restricted to Faculty and Administrators. Candidates can take full CBT examinations from the Mock Tests catalog.
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Question Bank Repository
            </h1>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold px-2 py-0.5 rounded-full">
              {documents.length} Papers &bull; {totalQuestionsAcrossAll} Qs
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Organized by uploaded examination papers &amp; test files with KaTeX formulas and 1-click mock generation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/upload">
            <Button variant="primary" size="sm" className="shadow-xs font-semibold">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Import New Paper (PDF / Image)
            </Button>
          </Link>
        </div>
      </div>

      {/* Main View Mode Selector: File Cards (Default) vs All Flat Questions */}
      {!selectedDoc && (
        <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab("DOCUMENTS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "DOCUMENTS"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FolderOpen className="w-4 h-4 text-blue-600" />
            <span>Uploaded Papers (File Cards)</span>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
              {documents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("QUESTIONS")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "QUESTIONS"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>All Questions List</span>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full font-mono">
              {totalQuestionsAcrossAll}
            </span>
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. UPLOADED PAPERS / FILE CARDS VIEW (Primary Default)         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "DOCUMENTS" && !selectedDoc && (
        <div className="space-y-5">
          {/* Search bar for uploaded papers */}
          <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search uploaded papers by filename..."
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredDocs.length} of {documents.length} papers
            </div>
          </div>

          {/* Cards Grid */}
          {docsLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-600 mb-2" />
              Loading uploaded papers repository...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                <FolderOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No question papers uploaded yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Upload your first SSC official question paper PDF or scanned image to start extracting structured questions.
              </p>
              <div className="pt-2">
                <Link href="/upload">
                  <Button variant="primary" size="md">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Upload Question Paper
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocs.map((doc) => {
                const isCreatingMock = creatingMockDocId === doc.id;
                const subjects = Object.entries(doc.subjectBreakdown || {});

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Top Section */}
                    <div className="p-5 space-y-3.5">
                      {/* Badge Row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {doc.fileType.includes("pdf") ? "PDF Paper" : "Image Paper"}
                          </span>
                        </div>

                        {/* Public Exam Badge if published */}
                        {doc.isPublic && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                            <Globe className="w-3 h-3 text-emerald-600 animate-pulse" />
                            <span>Public (Live)</span>
                          </span>
                        )}

                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                            doc.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : doc.status === "PROCESSING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {doc.status === "COMPLETED" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {doc.status === "PROCESSING" && (
                            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          )}
                          <span>{doc.status}</span>
                        </span>
                      </div>

                      {/* File Name */}
                      <div>
                        <h3
                          title={doc.fileName}
                          className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors"
                        >
                          {doc.fileName}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span>&bull;</span>
                          <span>{doc.pageCount} {doc.pageCount === 1 ? "Page" : "Pages"}</span>
                          {doc.isScanned && (
                            <>
                              <span>&bull;</span>
                              <span className="text-blue-600 font-medium">Scanned OCR</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Upload Time */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-600">Uploaded:</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {formatUploadTime(doc.createdAt)}
                        </span>
                      </div>

                      {/* Extracted Questions Metric Banner */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Extracted
                          </span>
                          <span className="text-base font-bold font-mono text-slate-900">
                            {doc.questionCount} Questions
                          </span>
                        </div>

                        {doc.pendingReviewCount > 0 ? (
                          <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded-md font-medium">
                            {doc.pendingReviewCount} Needs Review
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-1 rounded-md font-medium">
                            100% Ready
                          </span>
                        )}
                      </div>

                      {/* Subject Breakdown Mini Chips */}
                      {subjects.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Section Breakdown:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {subjects.map(([subj, count]) => (
                              <span
                                key={subj}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                              >
                                {subj}: <strong className="font-mono">{count}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Public CBT Test & Results Action Bar */}
                      <div className="pt-2 border-t border-slate-100">
                        {doc.isPublic ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenResultsModal(doc)}
                              className="flex-1 text-[11px] justify-center font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 shadow-2xs"
                            >
                              <BarChart2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              <span>See Candidate Results</span>
                            </Button>
                            {currentUser?.role === "ADMIN" && (
                              <button
                                onClick={() => handleTogglePublish(doc)}
                                disabled={publishingDocId === doc.id}
                                title="Make Private (Unpublish from student test catalog)"
                                className="px-2 py-1 text-slate-500 hover:text-amber-800 rounded-lg hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                              >
                                <Lock className="w-3 h-3 text-slate-400" />
                                <span>Unpublish</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          currentUser?.role === "ADMIN" && (
                            <Button
                              variant="outline"
                              size="sm"
                              isLoading={publishingDocId === doc.id}
                              onClick={() => handleTogglePublish(doc)}
                              disabled={doc.questionCount === 0}
                              className="w-full text-[11px] justify-center font-bold text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 border-blue-200 shadow-2xs"
                            >
                              <Globe className="w-3.5 h-3.5 mr-1 text-blue-600" />
                              <span>Make Public (Publish Live Exam)</span>
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                      {/* Drill-down into Document */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDoc(doc)}
                        className="flex-1 text-xs justify-center font-medium bg-white hover:bg-slate-100"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        <span>Explore Qs</span>
                      </Button>

                      {/* 1-Click Mock Generation */}
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isCreatingMock}
                        onClick={() => handleCreateMockFromDocument(doc.id)}
                        disabled={doc.questionCount === 0}
                        className="flex-1 text-xs justify-center font-bold shadow-2xs"
                      >
                        <PlayCircle className="w-3.5 h-3.5 mr-1 text-blue-200" />
                        <span>Start Mock</span>
                      </Button>

                      {/* Delete Document (Restricted to Faculty & Admin) */}
                      {(currentUser?.role === "ADMIN" || currentUser?.role === "TEACHER") && (
                        <button
                          onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                          title="Delete paper and its questions"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. DOCUMENT DRILL-DOWN VIEW (Single Paper's Questions)         */}
      {/* ------------------------------------------------------------- */}
      {selectedDoc && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Breadcrumb Navigation Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5 transition-colors group mb-1"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Uploaded Papers Cards</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  Paper Details
                </span>
                {selectedDoc.isPublic ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <Globe className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>Public Live Exam</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                    Private Draft
                  </span>
                )}
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {selectedDoc.fileName}
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span>Uploaded: {formatUploadTime(selectedDoc.createdAt)}</span>
                <span>&bull;</span>
                <span>{selectedDoc.questionCount} Extracted Questions</span>
                <span>&bull;</span>
                <span>{formatFileSize(selectedDoc.fileSize)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedDoc.isPublic ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenResultsModal(selectedDoc)}
                    className="font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 shadow-xs"
                  >
                    <BarChart2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                    <span>Inspect Results</span>
                  </Button>
                  {currentUser?.role === "ADMIN" && (
                    <Button
                      variant="outline"
                      size="sm"
                      isLoading={publishingDocId === selectedDoc.id}
                      onClick={() => handleTogglePublish(selectedDoc)}
                      className="font-semibold text-slate-600 hover:text-amber-800 hover:bg-amber-50 border-slate-300"
                    >
                      <Lock className="w-4 h-4 mr-1 text-slate-400" />
                      <span>Unpublish</span>
                    </Button>
                  )}
                </>
              ) : (
                currentUser?.role === "ADMIN" && (
                  <Button
                    variant="outline"
                    size="sm"
                    isLoading={publishingDocId === selectedDoc.id}
                    onClick={() => handleTogglePublish(selectedDoc)}
                    disabled={selectedDoc.questionCount === 0}
                    className="font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200 shadow-xs"
                  >
                    <Globe className="w-4 h-4 mr-1.5 text-blue-600" />
                    <span>Make Public</span>
                  </Button>
                )
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCreateMockFromDocument(selectedDoc.id)}
                className="font-bold shadow-xs"
              >
                <PlayCircle className="w-4 h-4 mr-1.5" />
                Start Practice Mock
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteDocument(selectedDoc.id, selectedDoc.fileName)}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. QUESTIONS LIST (Used in Drill-down OR All Questions tab)   */}
      {/* ------------------------------------------------------------- */}
      {(selectedDoc || activeTab === "QUESTIONS") && (
        <div className="space-y-4">
          {/* Multi-Factor Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search questions by text or topic..."
                  value={questionSearchQuery}
                  onChange={(e) => setQuestionSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchQuestions(selectedDoc?.id);
                    }
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => fetchQuestions(selectedDoc?.id)}
              >
                Search
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-semibold text-[11px] uppercase mr-1">
                Filters:
              </span>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 text-xs"
              >
                <option value="ALL">All Subjects</option>
                <option value="General Intelligence">General Intelligence</option>
                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                <option value="English Language">English Language</option>
                <option value="General Awareness">General Awareness</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 text-xs"
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 text-xs"
              >
                <option value="ALL">All Question Types</option>
                <option value="MCQ">Standard MCQ</option>
                <option value="STATEMENT_BASED">Statement-Based</option>
                <option value="DIAGRAM_BASED">Diagram-Based</option>
                <option value="CLOZE">Cloze Test</option>
                <option value="NUMERICAL">Numerical</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 text-xs"
              >
                <option value="ALL">All Sources</option>
                <option value="SOURCE_QUESTION">Source Official Paper</option>
                <option value="AI_GENERATED_PRACTICE">AI Generated Practice</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending Review</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Sticky Bulk Action Bar */}
          {selectedIds.size > 0 && (
            <div className="sticky top-4 z-20 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 border border-slate-800 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-blue-400 font-mono bg-blue-900/60 px-2 py-0.5 rounded">
                  {selectedIds.size} Selected
                </span>
                <button
                  onClick={toggleSelectAll}
                  className="text-slate-400 hover:text-white underline text-[11px]"
                >
                  {selectedIds.size === questions.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={bulkActionLoading}
                  onClick={() => handleBulkAction("APPROVE")}
                  className="bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border-emerald-800"
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1" />
                  Approve ({selectedIds.size})
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={bulkActionLoading}
                  onClick={() => handleBulkAction("REJECT")}
                  className="bg-amber-950/60 hover:bg-amber-900 text-amber-400 border-amber-800"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Reject ({selectedIds.size})
                </Button>

                <select
                  disabled={bulkActionLoading}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkAction("UPDATE_DIFFICULTY", { difficulty: e.target.value });
                      e.target.value = "";
                    }
                  }}
                  className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs"
                >
                  <option value="">Set Difficulty...</option>
                  <option value="EASY">Set to Easy</option>
                  <option value="MEDIUM">Set to Medium</option>
                  <option value="HARD">Set to Hard</option>
                </select>

                <Button
                  variant="danger"
                  size="sm"
                  disabled={bulkActionLoading}
                  onClick={() => {
                    if (confirm(`Permanently delete ${selectedIds.size} selected questions?`)) {
                      handleBulkAction("DELETE");
                    }
                  }}
                  className="bg-rose-950/70 hover:bg-rose-900 text-rose-300 border-rose-800"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Question Cards List */}
          {questionsLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-600 mb-2" />
              Loading questions...
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No questions found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                {selectedDoc
                  ? "No questions matching filters in this paper."
                  : "Upload a PDF, scanned question paper, or image to populate your repository."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => {
                const isSelected = selectedIds.has(q.id);
                const effectiveAnswer =
                  q.verifiedAnswer ||
                  q.sourceAnswer ||
                  q.aiSuggestedAnswer ||
                  q.options.find((o) => o.isCorrect)?.label;

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-xl border p-4.5 space-y-3 shadow-xs transition-all ${
                      isSelected
                        ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/15"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Meta Top Bar */}
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(q.id)}
                          className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                        />
                        <span className="font-bold font-mono text-slate-900 text-sm">
                          Q.{q.questionNumber}
                        </span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="font-semibold text-slate-700">{q.subject}</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                          {q.topic}
                        </span>

                        {/* Source Badge */}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                            q.source === "AI_GENERATED_PRACTICE"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {q.source === "AI_GENERATED_PRACTICE" ? "AI Generated" : "Source Paper"}
                        </span>

                        {/* Question Type Badge */}
                        <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                          {q.questionType || "MCQ"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status badge */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            q.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : q.status === "REJECTED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {q.status}
                        </span>

                        <Badge
                          variant={
                            q.difficulty === "HARD"
                              ? "danger"
                              : q.difficulty === "MEDIUM"
                              ? "warning"
                              : "success"
                          }
                        >
                          {q.difficulty}
                        </Badge>

                        <Link href={`/question-bank/${q.id}`}>
                          <button className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-6">
                      <MathRenderer text={q.questionText} />
                    </div>

                    {/* Diagram Preview if any */}
                    {q.hasVisualContent && (
                      <div className="pl-6">
                        <div className="inline-flex items-center gap-1.5 bg-blue-50/70 border border-blue-200 px-2.5 py-1 rounded text-[11px] text-blue-700 font-medium">
                          <span>Visual Content ({q.visualType || "Diagram"}) Attached</span>
                        </div>
                      </div>
                    )}

                    {/* 4 Options Grid */}
                    <div className="pl-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt) => {
                        const isThisCorrect =
                          effectiveAnswer &&
                          (opt.label.toUpperCase() === effectiveAnswer.toUpperCase() || opt.isCorrect);

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                              isThisCorrect
                                ? "border-emerald-300 bg-emerald-50/50 text-emerald-950 font-medium"
                                : "border-slate-200 bg-slate-50/60 text-slate-700"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isThisCorrect
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {opt.label}
                            </span>
                            <div className="flex-1">
                              <MathRenderer text={opt.text} />
                            </div>
                            {isThisCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* 3-Level Verified Answer Footer */}
                    <div className="pl-6 pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span>
                          Official Key:{" "}
                          <strong className="text-emerald-700 font-mono">
                            Option {effectiveAnswer || "Not set"}
                          </strong>
                        </span>
                        {q.verifiedAnswer && (
                          <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-medium">
                            Verified by Teacher Review
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                        <span>Confidence: {(q.confidence.answer * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* 4. CANDIDATE RESULTS & SCORECARDS MODAL                      */}
      {/* ============================================================= */}
      {resultsModalDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Live Exam Analytics
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ID: {resultsModalDoc.id.slice(0, 8)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                  {resultsModalDoc.fileName}
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time authoritative evaluations &amp; student submissions
                </p>
              </div>

              <button
                onClick={() => setResultsModalDoc(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {resultsLoading ? (
                <div className="py-16 text-center text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                  <p className="text-xs font-medium">Fetching candidate submissions...</p>
                </div>
              ) : (
                <>
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-500">Total Attempts</div>
                      <div className="text-2xl font-black font-mono text-slate-900 mt-1">
                        {resultsData?.stats?.totalAttempts ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Candidates Evaluated</div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-500">Average Score</div>
                      <div className="text-2xl font-black font-mono text-blue-600 mt-1">
                        {resultsData?.stats?.averageScore ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Mean Score</div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-500">Highest Score</div>
                      <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
                        {resultsData?.stats?.highestScore ?? 0}
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-0.5">Topper Mark</div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-500">Paper Status</div>
                      <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Public &amp; Live</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Active in portal</div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-xs font-bold text-slate-800">
                      Candidate Submissions ({resultsData?.results?.length ?? 0})
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/admin/documents/${resultsModalDoc.id}/results?export=csv`}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>Download Report (CSV)</span>
                      </a>

                      {currentUser?.role === "ADMIN" && (
                        <button
                          onClick={() => {
                            setEmailSubject(`Official Scorecard: ${resultsModalDoc.fileName}`);
                            setEmailNotes("You have successfully completed the examination. Your official evaluated marks and performance metrics are provided below.");
                            setEmailFeedback(null);
                            setShowEmailModal(true);
                          }}
                          disabled={!resultsData?.results || resultsData?.results.length === 0}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-300" />
                          <span>Email Scorecards</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Rank</th>
                            <th className="py-2.5 px-3">Roll No</th>
                            <th className="py-2.5 px-3">Candidate</th>
                            <th className="py-2.5 px-3">Email</th>
                            <th className="py-2.5 px-3">Score</th>
                            <th className="py-2.5 px-3">Percentage</th>
                            <th className="py-2.5 px-3">Accuracy</th>
                            <th className="py-2.5 px-3">Submitted At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {(!resultsData?.results || resultsData.results.length === 0) ? (
                            <tr>
                              <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                                No candidate test attempts recorded yet.
                                <br />
                                When candidates submit this exam, their official marks appear here.
                              </td>
                            </tr>
                          ) : (
                            resultsData.results.map((r: any) => (
                              <tr key={r.attemptId} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2.5 px-3 font-mono font-bold text-slate-600">
                                  #{r.rank}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-slate-700 font-medium">
                                  {r.rollNo}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">
                                  {r.name}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                                  {r.email}
                                </td>
                                <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                                  {r.score} / {r.totalMarks}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-slate-700">
                                  {r.percentage}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-slate-700">
                                  {r.accuracy}
                                </td>
                                <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                                  {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) : "--"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResultsModalDoc(null)}
                className="font-semibold text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. EMAIL SCORECARDS MODAL DIALOG                              */}
      {/* ============================================================= */}
      {showEmailModal && resultsModalDoc && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[60] flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Email Official Scorecards
                </h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              This will dispatch evaluation emails containing marks secured, accuracy, and solution links to all {resultsData?.results?.length ?? 0} candidate(s) who attempted <strong className="text-slate-800">{resultsModalDoc.fileName}</strong>.
            </p>

            {emailFeedback && (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{emailFeedback}</span>
              </div>
            )}

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Candidate Email (Recipient) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={targetCandidateEmail}
                  onChange={(e) => setTargetCandidateEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                  placeholder="e.g. candidate@gmail.com"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-0.5">
                  The official scorecard will be dispatched directly to this candidate email address.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                  placeholder="Official Examination Scorecard..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Examiner Notes / Message
                </label>
                <textarea
                  rows={3}
                  value={emailNotes}
                  onChange={(e) => setEmailNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                  placeholder="Additional feedback or notes for candidates..."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmailModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                isLoading={isSendingEmails}
                onClick={handleSendEmails}
                className="text-xs font-bold bg-slate-900 hover:bg-black"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Dispatch Scorecards
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
