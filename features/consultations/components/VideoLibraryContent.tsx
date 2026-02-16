'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Play, Loader2 } from 'lucide-react';
import { useAssetsByIds } from '@/features/media/hooks/useAssetsByIds';
import { useCompanyVideos } from '@/features/media/hooks/useCompanyVideos';
import type { SalesAsset } from '@/features/media/types';

interface VideoLibraryContentProps {
  videoAssetIds?: string[];
  showAllLibraryVideos?: boolean;
  singleVideoUrl?: string;
  mockAssets?: SalesAsset[];
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatCategory(cat: string): string {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const CATEGORY_COLORS: Record<string, string> = {
  testimonial: 'bg-amber-500/20 text-amber-300',
  intro: 'bg-blue-500/20 text-blue-300',
  case_study: 'bg-purple-500/20 text-purple-300',
  process: 'bg-green-500/20 text-green-300',
  other: 'bg-gray-500/20 text-gray-300',
};

export function VideoLibraryContent({ videoAssetIds, showAllLibraryVideos, singleVideoUrl, mockAssets }: VideoLibraryContentProps) {
  const [playingAsset, setPlayingAsset] = useState<SalesAsset | null>(null);

  const byIds = useAssetsByIds((!mockAssets && videoAssetIds) || []);
  const allVideos = useCompanyVideos({ autoFetch: !mockAssets && !!showAllLibraryVideos && !videoAssetIds?.length });

  const assets = mockAssets || (videoAssetIds?.length ? byIds.assets : allVideos.videos as SalesAsset[]);
  const isLoading = !mockAssets && (videoAssetIds?.length ? byIds.isLoading : allVideos.isLoading);
  const hasLibrary = !!(videoAssetIds?.length || showAllLibraryVideos || mockAssets);

  // Fallback: single video mode (backward compatible)
  if (!hasLibrary) {
    if (!singleVideoUrl) return <p className="text-white/40 text-sm text-center py-8">No video configured</p>;
    return (
      <div className="rounded-xl overflow-hidden aspect-video bg-black">
        <iframe src={singleVideoUrl} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen title="Video" />
      </div>
    );
  }

  // Playing state: show video with back button
  if (playingAsset) {
    return (
      <div className="space-y-3">
        <button type="button" onClick={() => setPlayingAsset(null)} className="flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to Library
        </button>
        <div className="rounded-xl overflow-hidden aspect-video bg-black">
          <iframe src={playingAsset.bunnyCdnUrl} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen title={playingAsset.title} />
        </div>
        <div>
          <p className="text-white font-medium text-sm">{playingAsset.title}</p>
          {playingAsset.description && <p className="text-white/40 text-xs mt-1">{playingAsset.description}</p>}
        </div>
      </div>
    );
  }

  // Grid state: show video library
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  if (assets.length === 0) {
    return <p className="text-white/40 text-sm text-center py-8">No videos available</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {assets.map((asset) => {
        const colorClass = CATEGORY_COLORS[asset.category] || CATEGORY_COLORS.other;
        return (
          <button
            key={asset.id}
            type="button"
            className="group text-left rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/20 bg-white/[0.03] transition-colors"
            onClick={() => setPlayingAsset(asset)}
          >
            <div className="aspect-video bg-gray-800 relative">
              {asset.thumbnailUrl ? (
                <Image src={asset.thumbnailUrl} alt={asset.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-80 transition-opacity" fill="white" />
              </div>
              {asset.durationSeconds && (
                <span className="absolute bottom-1.5 right-1.5 text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
                  {formatDuration(asset.durationSeconds)}
                </span>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-white/90 text-xs font-medium truncate">{asset.title}</p>
              <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full ${colorClass}`}>
                {formatCategory(asset.category)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
