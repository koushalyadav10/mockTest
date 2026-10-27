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
    <div className="-m-4 sm:-m-6 lg:-m-10">
      <SvarAssessmentView
        candidateName={userName}
        onExit={() => router.push("/dashboard")}
      />
    </div>
  );
}
