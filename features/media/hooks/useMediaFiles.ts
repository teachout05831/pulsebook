'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { MediaFile, FileCategory } from '../types';

interface UseMediaFilesOptions {
  category?: FileCategory;
  customerId?: string;
  jobId?: string;
  autoFetch?: boolean;
}

export function useMediaFiles(options: UseMediaFilesOptions = {}) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.category) params.set('category', options.category);
      if (options.customerId) params.set('customerId', options.customerId);
      if (options.jobId) params.set('jobId', options.jobId);

      const res = await fetch(`/api/media?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setFiles(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, [options.category, options.customerId, options.jobId]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(fetchFiles, 300);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [fetchFiles, options.autoFetch]);

  return { files, isLoading, error, refresh: fetchFiles };
}
