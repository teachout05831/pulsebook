"use client";

import { useState, useCallback } from "react";

export function useTechCrewFeedback(jobId: string, initialFeedback: string | null) {
  const [feedback, setFeedback] = useState(initialFeedback || "");
  const [isSaving, setIsSaving] = useState(false);

  const saveFeedback = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/tech/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crewFeedback: feedback }),
      });
      return res.ok;
    } finally {
      setIsSaving(false);
    }
  }, [jobId, feedback]);

  return { feedback, setFeedback, saveFeedback, isSaving };
}
