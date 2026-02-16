'use client';

import { Play } from 'lucide-react';

interface Props {
  videoId?: string;
  libraryId?: string;
  src?: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
}

function parseBunnyEmbed(url: string): { libraryId: string; videoId: string } | null {
  const match = url.match(/mediadelivery\.net\/embed\/(\w+)\/([a-f0-9-]+)/);
  if (match) return { libraryId: match[1], videoId: match[2] };

  const bunnyMatch = url.match(/\.b-cdn\.net.*?([a-f0-9-]{36})/);
  if (bunnyMatch) return null;
  return null;
}

export function VideoPlayer({ videoId, libraryId, src, thumbnailUrl, title, className = '' }: Props) {
  const resolvedId = videoId;
  const resolvedLib = libraryId;

  // Try to parse from src URL if videoId/libraryId not provided directly
  if (!resolvedId && src) {
    const parsed = parseBunnyEmbed(src);
    if (parsed) {
      return (
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${parsed.libraryId}/${parsed.videoId}?autoplay=false&preload=true`}
          title={title || 'Video'}
          loading="lazy"
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          className={`w-full aspect-video ${className}`}
          style={{ border: 'none', borderRadius: 'var(--border-radius, 0.5rem)' }}
        />
      );
    }

    // Fallback to native video element for direct URLs
    return (
      <video
        src={src}
        controls
        poster={thumbnailUrl || undefined}
        className={`w-full aspect-video bg-black ${className}`}
        style={{ borderRadius: 'var(--border-radius, 0.5rem)' }}
      />
    );
  }

  if (resolvedId && resolvedLib) {
    return (
      <iframe
        src={`https://iframe.mediadelivery.net/embed/${resolvedLib}/${resolvedId}?autoplay=false&preload=true`}
        title={title || 'Video'}
        loading="lazy"
        allowFullScreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        className={`w-full aspect-video ${className}`}
        style={{ border: 'none', borderRadius: 'var(--border-radius, 0.5rem)' }}
      />
    );
  }

  return (
    <div
      className={`w-full aspect-video bg-gray-100 flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 ${className}`}
      style={{ borderRadius: 'var(--border-radius, 0.5rem)' }}
    >
      <Play className="h-10 w-10 text-gray-400" />
      <p className="text-sm text-gray-400">No video</p>
    </div>
  );
}
