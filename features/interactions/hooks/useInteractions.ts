'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Interaction, CreateInteractionInput } from '../types';

export function useInteractions(customerId: string) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/interactions?customerId=${customerId}`);
      if (!res.ok) throw new Error('fetch failed');
      const json: { data: Interaction[] } = await res.json();
      setInteractions(json.data || []);
    } catch {
      setError('Failed to load interactions');
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleCreate = useCallback(async (input: Omit<CreateInteractionInput, 'customerId'>) => {
    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, customerId }),
    });
    const json = await res.json();
    if (res.ok) await refresh();
    return json;
  }, [customerId, refresh]);

  return { interactions, isLoading, error, refresh, handleCreate };
}
