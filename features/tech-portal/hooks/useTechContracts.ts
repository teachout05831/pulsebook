"use client";

import { useState, useEffect } from "react";
import type { TechContractInfo } from "../types";

export function useTechContracts(jobId: string) {
  const [contracts, setContracts] = useState<TechContractInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/tech/jobs/${jobId}/contracts`);
        if (!res.ok) return;
        const json = await res.json();
        setContracts(json.data || []);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [jobId]);

  return { contracts, isLoading };
}
