'use client';

import { useState, useCallback } from 'react';
import type { MediaContext, FileCategory } from '../types';

interface UploadOptions {
  context: MediaContext;
  category: FileCategory;
  customerId?: string;
  jobId?: string;
  description?: string;
}

export function useBunnyUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File, options: UploadOptions) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', options.context);
      formData.append('category', options.category);
      if (options.customerId) formData.append('customerId', options.customerId);
      if (options.jobId) formData.append('jobId', options.jobId);
      if (options.description) formData.append('description', options.description);

      const res = await fetch('/api/media/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) return { error: json.error || 'Upload failed' };
      return { url: json.data.url, fileId: json.data.fileId };
    } catch {
      const msg = 'Upload failed';
      setError(msg);
      return { error: msg };
    } finally {
      setIsUploading(false);
    }
  }, []);

  const remove = useCallback(async (fileId: string) => {
    try {
      const res = await fetch(`/api/media?fileId=${fileId}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) return { error: json.error || 'Delete failed' };
      return { success: true };
    } catch {
      return { error: 'Delete failed' };
    }
  }, []);

  return { upload, remove, isUploading, error };
}
