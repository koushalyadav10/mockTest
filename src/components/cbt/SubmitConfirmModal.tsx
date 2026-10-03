"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { AlertCircle, CheckCircle2, BookmarkCheck, HelpCircle } from "lucide-react";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  isSubmitting?: boolean;
  summary: {
    total: number;
    answered: number;
    notAnswered: number;
    markedForReview: number;
  };
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  isSubmitting = false,
  summary,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Exam Submission" maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            Are you sure you want to submit your examination? Once submitted, you will not be able to modify your answers.
          </p>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Attempt Summary
          </h4>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Answered:
              </span>
              <span className="font-bold text-emerald-700 font-mono text-base">
                {summary.answered}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 text-xs">
                <HelpCircle className="w-4 h-4 text-red-500" /> Unanswered:
              </span>
              <span className="font-bold text-red-600 font-mono text-base">
                {summary.notAnswered}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5 text-xs">
                <BookmarkCheck className="w-4 h-4 text-purple-600" /> Marked:
              </span>
              <span className="font-bold text-purple-700 font-mono text-base">
                {summary.markedForReview}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
              <span className="text-slate-600 text-xs">Total Questions:</span>
              <span className="font-bold text-slate-900 font-mono text-base">
                {summary.total}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            Resume Exam
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirmSubmit}
            isLoading={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
          >
            Submit &amp; Finish
          </Button>
        </div>
      </div>
    </Modal>
  );
};
