'use client';

import { useState, useCallback, useEffect } from 'react';

interface CompanyVideo {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  category: string;
  bunnyCdnUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  isReusable: boolean;
  estimateId: string | null;
  totalPlays: number;
  createdAt: string;
}

interface UseCompanyVideosOptions {
  category?: string;
  autoFetch?: boolean;
}

export function useCompanyVideos(options: UseCompanyVideosOptions = {}) {
  const [videos, setVideos] = useState<CompanyVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.category) params.set('category', options.category);

      const res = await fetch(`/api/estimate-pages/videos?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setVideos(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  }, [options.category]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchVideos();
    }
  }, [fetchVideos, options.autoFetch]);

  return { videos, isLoading, error, refresh: fetchVideos };
}
