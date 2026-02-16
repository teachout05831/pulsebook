'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AIEstimateOutput, AIPageContent } from '../types';

interface AIReviewState {
  estimate: AIEstimateOutput | null;
  pageContent: Record<string, unknown> | null;
  isAccepting: boolean;
  isRegenerating: boolean;
  error: string | null;
}

export function useAIReview(consultationId: string) {
  const [state, setState] = useState<AIReviewState>({
    estimate: null, pageContent: null, isAccepting: false, isRegenerating: false, error: null,
  });

  const loadAIData = useCallback(async () => {
    try {
      const res = await fetch(`/api/document-layer/status?consultationId=${consultationId}`);
      if (!res.ok) return;
      const { data } = await res.json();
      if (data.aiEstimateOutput) {
        setState(s => ({ ...s, estimate: data.aiEstimateOutput as AIEstimateOutput }));
      }
    } catch { /* ignore */ }
  }, [consultationId]);

  // Load existing AI data on mount
  useEffect(() => { loadAIData(); }, [loadAIData]);

  const generateEstimate = useCallback(async () => {
    setState(s => ({ ...s, isRegenerating: true, error: null }));
    try {
      const res = await fetch('/api/document-layer/generate-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationId }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const { data } = await res.json();
      setState(s => ({ ...s, estimate: data, isRegenerating: false }));
      return data as AIEstimateOutput;
    } catch (err) {
      setState(s => ({ ...s, isRegenerating: false, error: 'Failed to generate estimate' }));
      return null;
    }
  }, [consultationId]);

  const generatePage = useCallback(async (templateId?: string) => {
    setState(s => ({ ...s, isRegenerating: true, error: null }));
    try {
      const res = await fetch('/api/document-layer/generate-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationId, templateId }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const { data } = await res.json();
      setState(s => ({ ...s, pageContent: data, isRegenerating: false }));
      return data as AIPageContent;
    } catch (err) {
      setState(s => ({ ...s, isRegenerating: false, error: 'Failed to generate page' }));
      return null;
    }
  }, [consultationId]);

  const accept = useCallback(async (overrides?: {
    lineItems?: unknown[];
    resources?: unknown;
    notes?: string;
  }) => {
    setState(s => ({ ...s, isAccepting: true, error: null }));
    try {
      const res = await fetch('/api/document-layer/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultationId, ...overrides }),
      });
      if (!res.ok) throw new Error('Accept failed');
      const { data } = await res.json();
      setState(s => ({ ...s, isAccepting: false }));
      return data as { estimateId: string; pageId: string | null };
    } catch {
      setState(s => ({ ...s, isAccepting: false, error: 'Failed to accept' }));
      return null;
    }
  }, [consultationId]);

  return {
    ...state,
    setEstimate: (est: AIEstimateOutput) => setState(s => ({ ...s, estimate: est })),
    loadAIData,
    generateEstimate,
    generatePage,
    accept,
  };
}
