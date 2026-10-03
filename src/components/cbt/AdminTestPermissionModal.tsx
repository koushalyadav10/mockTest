"use client";

import React, { useState } from "react";
import { Shield, KeyRound, Mail, Link as LinkIcon, Copy, Check, X, Users, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminTestPermissionModalProps {
  testId: string;
  examTitle: string;
  assignedEmail?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTestPermissionModal: React.FC<AdminTestPermissionModalProps> = ({
  testId,
  examTitle,
  assignedEmail = "student@examforge.ai",
  isOpen,
  onClose,
}) => {
  const passcode = `EF-${testId.slice(0, 6).toUpperCase()}`;
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [candidateEmailInput, setCandidateEmailInput] = useState(assignedEmail);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const testUrl = typeof window !== "undefined" ? `${window.location.origin}/mock/${testId}` : `/mock/${testId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(passcode);
    setCopiedPasscode(true);
    setTimeout(() => setCopiedPasscode(false), 2000);
  };

  const handleCopyFullInvite = () => {
    const invite = `SSC CBT Examination Access Invitation\nExam: ${examTitle}\nTest Link: ${testUrl}\nAuthorized Email: ${candidateEmailInput}\nTest Passcode: ${passcode}\n\nPlease open the link and verify your candidate identity to start the examination.`;
    navigator.clipboard.writeText(invite);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-blue-400 font-bold uppercase">
                Admin Control
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Candidate Access &amp; Permissions
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-blue-900 block">Exam Details</span>
            <p className="font-bold text-slate-900 text-sm">{examTitle}</p>
            <p className="text-[11px] text-slate-500 font-mono">Test ID: {testId}</p>
          </div>

          {/* Form to set candidate email */}
          <form onSubmit={handleSaveEmail} className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Authorized Candidate Email Address
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={candidateEmailInput}
                onChange={(e) => setCandidateEmailInput(e.target.value)}
                placeholder="candidate@example.com"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Button type="submit" variant="primary" size="sm">
                Save
              </Button>
            </div>
            {savedSuccess && (
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Candidate permission saved!
              </p>
            )}
          </form>

          {/* Passcode Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Test Access Passcode
              </span>
              <span className="text-base font-bold font-mono text-slate-900 tracking-wider">
                {passcode}
              </span>
            </div>
            <button
              onClick={handleCopyPasscode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-medium text-slate-700 transition-colors shadow-xs"
            >
              {copiedPasscode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Key</span>
                </>
              )}
            </button>
          </div>

          {/* Test Link Card */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              Candidate Direct Exam Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={testUrl}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-600 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-medium text-slate-700 transition-colors shadow-xs shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Copy Full Invitation CTA */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={handleCopyFullInvite}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Candidate Invitation Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Full Candidate Invitation</span>
                </>
              )}
            </button>

            <Button variant="outline" size="md" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
