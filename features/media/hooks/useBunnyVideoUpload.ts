'use client';

import { useState, useCallback } from 'react';
import type { VideoCategory } from '@/features/estimate-pages/types/core';

interface UploadVideoOptions {
  title: string;
  category: VideoCategory;
  description?: string;
  isReusable?: boolean;
  estimateId?: string;
}

interface VideoUploadResult {
  error?: string;
  videoId?: string;
}

export function useBunnyVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = useCallback(async (
    file: File,
    options: UploadVideoOptions,
  ): Promise<VideoUploadResult> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Get signed upload URL from Bunny
      const urlRes = await fetch('/api/estimate-pages/videos/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: options.title }),
      });
      const urlJson = await urlRes.json();
      if (!urlRes.ok) return { error: urlJson.error || 'Failed to get upload URL' };

      const { uploadUrl, videoId, libraryId, authSignature, authExpire } = urlJson.data;
      setProgress(10);

      // Step 2: Upload video file to Bunny directly (signed auth)
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'AuthorizationSignature': authSignature,
          'AuthorizationExpire': String(authExpire),
          'LibraryId': libraryId,
          'VideoId': videoId,
        },
        body: file,
      });
      if (!uploadRes.ok) return { error: 'Failed to upload video' };
      setProgress(80);

      // Step 3: Create DB record via existing API
      const cdnUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
      const recordRes = await fetch('/api/estimate-pages/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: options.title,
          description: options.description || null,
          category: options.category,
          bunnyVideoId: videoId,
          bunnyLibraryId: libraryId,
          bunnyCdnUrl: cdnUrl,
          fileSizeBytes: file.size,
          isReusable: options.isReusable ?? true,
          estimateId: options.estimateId || null,
        }),
      });
      const recordJson = await recordRes.json();
      if (!recordRes.ok) return { error: recordJson.error || 'Failed to save video' };

      setProgress(100);
      return { videoId: recordJson.data.id };
    } catch {
      const msg = 'Video upload failed';
      setError(msg);
      return { error: msg };
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadVideo, isUploading, progress, error };
}
