'use client';

import { useState, useCallback, useEffect } from 'react';
import type { MediaFile } from '@/features/media/types';

export function useJobFiles(jobId: string) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/media?jobId=${jobId}&category=photo`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setFiles(json.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) fetchFiles();
  }, [jobId, fetchFiles]);

  const handleUploadComplete = useCallback(async () => {
    await fetchFiles();
  }, [fetchFiles]);

  const handleDelete = useCallback(async (fileId: string) => {
    try {
      const res = await fetch(`/api/media?fileId=${fileId}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json();
        return { error: json.error || 'Delete failed' };
      }
      await fetchFiles();
      return { success: true };
    } catch {
      return { error: 'Delete failed' };
    }
  }, [fetchFiles]);

  return { files, isLoading, error, refresh: fetchFiles, handleUploadComplete, handleDelete };
}
