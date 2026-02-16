"use client";

import { useState, useEffect } from "react";
import type { Job } from "@/types/job";

export function useJobDetail(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/jobs/${jobId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setJob(json.data);
      })
      .catch((err) => {
        if (!cancelled) console.error("Error fetching job detail:", err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  return { job, isLoading };
}
