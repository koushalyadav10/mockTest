"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SvarAssessmentView } from "@/components/svar/SvarAssessmentView";

export default function SvarAssessmentPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Candidate");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.name) {
          setUserName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 overflow-hidden flex flex-col">
      <SvarAssessmentView
        candidateName={userName}
        onExit={() => router.push("/dashboard")}
      />
    </div>
  );
}
