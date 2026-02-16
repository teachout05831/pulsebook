'use client';

import { useState, useCallback, useEffect } from 'react';
import type { PipelineState, PipelineStatus } from '../types';

const TERMINAL_STATES: PipelineStatus[] = ['ready', 'error', 'idle'];

export function usePipelineStatus(consultationId: string | null) {
  const [state, setState] = useState<PipelineState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!consultationId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/document-layer/status?consultationId=${consultationId}`);
      if (!res.ok) return;
      const json = await res.json();
      setState(json.data);
    } catch { /* ignore */ } finally {
      setIsLoading(false);
    }
  }, [consultationId]);

  // Poll every 5s until terminal state
  useEffect(() => {
    if (!consultationId) return;
    fetchStatus();
    const interval = setInterval(() => {
      if (state && TERMINAL_STATES.includes(state.status)) return;
      fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [consultationId, state?.status, fetchStatus]);

  return { state, isLoading, refresh: fetchStatus };
}
