'use client';

import { useState, useCallback, useEffect } from 'react';
import type { SalesAsset } from '../types';

interface UseSalesAssetsOptions {
  category?: string;
  autoFetch?: boolean;
}

export function useSalesAssets(options: UseSalesAssetsOptions = {}) {
  const [assets, setAssets] = useState<SalesAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.category) params.set('category', options.category);

      const res = await fetch(`/api/estimate-pages/videos?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setAssets(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load assets');
    } finally {
      setIsLoading(false);
    }
  }, [options.category]);

  const deleteAsset = useCallback(async (id: string) => {
    const res = await fetch(`/api/estimate-pages/videos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
    return res.ok;
  }, []);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchAssets();
    }
  }, [fetchAssets, options.autoFetch]);

  return { assets, isLoading, error, refresh: fetchAssets, deleteAsset };
}
