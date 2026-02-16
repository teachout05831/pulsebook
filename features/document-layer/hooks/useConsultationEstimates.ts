"use client";

import { useState, useEffect, useCallback } from "react";

interface ConsultationEstimate {
  id: string;
  title: string;
  customerName: string | null;
  hostName: string;
  status: string;
  pipelineStatus: string;
  pipelineError: string | null;
  estimateId: string | null;
  durationSeconds: number | null;
  createdAt: string;
}

export function useConsultationEstimates() {
  const [items, setItems] = useState<ConsultationEstimate[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/document-layer/consultations?page=${page}&limit=20`);
      if (!res.ok) return;
      const json = await res.json();
      setItems(json.data || []);
      setTotal(json.total || 0);
    } catch { /* ignore */ } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { items, total, isLoading, page, setPage, refresh: fetchData };
}
