'use client';

import { useState, useCallback, useEffect } from 'react';
import type { TranscriptEntry } from '../types';

interface TranscriptState {
  status: 'waiting' | 'transcribing' | 'ready';
  entries: TranscriptEntry[];
  rawTranscript: string | null;
}

export function useTranscriptViewer(consultationId: string | null) {
  const [state, setState] = useState<TranscriptState>({ status: 'waiting', entries: [], rawTranscript: null });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchTranscript = useCallback(async () => {
    if (!consultationId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/document-layer/transcript?consultationId=${consultationId}`);
      if (!res.ok) return;
      const json = await res.json();
      setState({
        status: json.data.status,
        entries: json.data.entries || [],
        rawTranscript: json.data.transcript,
      });
    } catch { /* ignore */ } finally {
      setIsLoading(false);
    }
  }, [consultationId]);

  // Poll until transcript is ready
  useEffect(() => {
    if (!consultationId || state.status === 'ready') return;
    fetchTranscript();
    const interval = setInterval(fetchTranscript, 10000);
    return () => clearInterval(interval);
  }, [consultationId, state.status, fetchTranscript]);

  const filteredEntries = search
    ? state.entries.filter(e => e.text.toLowerCase().includes(search.toLowerCase()))
    : state.entries;

  return {
    status: state.status,
    entries: filteredEntries,
    allEntries: state.entries,
    rawTranscript: state.rawTranscript,
    search, setSearch,
    isLoading,
    refresh: fetchTranscript,
  };
}
