"use client";

import { useState, useEffect, useCallback } from "react";
import type { TechJob } from "../types";

export function useTechJobs(startDate: string, endDate: string) {
  const [jobs, setJobs] = useState<TechJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/tech/jobs?start=${startDate}&end=${endDate}`
      );
      if (!res.ok) return;
      const json = await res.json();
      setJobs(json.data || []);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateStatus = useCallback(
    async (jobId: string, status: string) => {
      const res = await fetch(`/api/tech/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status } : j))
        );
      }
      return res.ok;
    },
    []
  );

  return { jobs, isLoading, refresh: fetchJobs, updateStatus };
}

export function useTechJobDetail(jobId: string) {
  const [job, setJob] = useState<TechJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/tech/jobs/${jobId}`);
        if (!res.ok) return;
        const json = await res.json();
        setJob(json.data || null);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [jobId]);

  const updateStatus = useCallback(
    async (status: string) => {
      const res = await fetch(`/api/tech/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setJob((prev) => (prev ? { ...prev, status } : null));
      }
      return res.ok;
    },
    [jobId]
  );

  return { job, isLoading, updateStatus };
}
