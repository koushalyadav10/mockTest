"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileCheck2, Shield, KeyRound, ArrowRight, CheckCircle2, Share2, Lock } from "lucide-react";
import { TestAccessGateModal, CandidateIdentity } from "@/components/cbt/TestAccessGateModal";
import { AdminTestPermissionModal } from "@/components/cbt/AdminTestPermissionModal";

export default function MockLobbyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Access Control Modals
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [candidate, setCandidate] = useState<CandidateIdentity | null>(null);

  useEffect(() => {
    fetch(`/api/tests/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.testAttempt) setTest(data);
      })
      .catch((err) => console.error("Error loading test:", err))
      .finally(() => setLoading(false));

    // Check existing auth in session
    const stored = sessionStorage.getItem(`exam_candidate_auth_${params.id}`);
    if (stored) {
      try {
        setCandidate(JSON.parse(stored));
      } catch (e) {}
    }
  }, [params.id]);

  if (loading || !test) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center text-sm text-slate-500">
        Loading examination specifications...
      </div>
    );
  }

  const { testAttempt, examConfig } = test;

  if (testAttempt.status === "EVALUATED") {
    router.push(`/mock/${params.id}/result`);
    return null;
  }

  const handleAuthorized = (c: CandidateIdentity) => {
    setCandidate(c);
    setIsGateOpen(false);
    router.push(`/mock/${params.id}/instructions`);
  };

  const handleStartFlow = () => {
    if (candidate) {
      router.push(`/mock/${params.id}/instructions`);
    } else {
      setIsGateOpen(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      {/* Admin Quick Action Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-3.5 px-5 flex flex-wrap items-center justify-between gap-3 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-slate-300">Admin Permission Control:</span>
          <span className="font-mono text-blue-300 font-semibold">
            Passcode: EF-{params.id.slice(0, 6).toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => setIsAdminModalOpen(true)}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Manage Access &amp; Share</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-xs text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
          <FileCheck2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs uppercase font-mono font-bold text-blue-600 tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
            {examConfig.category} &bull; {examConfig.mode}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight pt-1">
            {examConfig.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {examConfig.description || "Official pattern computer-based examination mock test."}
          </p>
        </div>

        {/* Candidate Identity Status Badge */}
        {candidate ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center justify-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Candidate Verified: <strong>{candidate.name}</strong> ({candidate.email})
            </span>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 flex items-center justify-center gap-2 max-w-md mx-auto">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Access restricted: Valid candidate email and test passcode required.
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 py-5 border-y border-slate-100 font-mono text-center">
          <div>
            <span className="text-[11px] text-slate-400 block font-sans">Questions</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800">
              {testAttempt.totalQuestions}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-sans">Duration</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800">
              {examConfig.totalDurationMinutes} Min
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-sans">Marking Scheme</span>
            <span className="text-lg sm:text-xl font-bold text-slate-800">
              +{examConfig.marksPerCorrect} / -{examConfig.negativeMarks}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartFlow}
            className="w-full shadow-sm py-3 text-sm font-bold justify-center"
          >
            {candidate ? (
              <>
                <span>View Examination Instructions</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 mr-2" />
                <span>Verify Access &amp; View Instructions</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Candidate Verification Gate Modal */}
      <TestAccessGateModal
        testId={params.id}
        examTitle={examConfig.title}
        isOpen={isGateOpen}
        onAuthorized={handleAuthorized}
      />

      {/* Admin Access & Permission Modal */}
      <AdminTestPermissionModal
        testId={params.id}
        examTitle={examConfig.title}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
