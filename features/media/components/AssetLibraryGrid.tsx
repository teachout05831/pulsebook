'use client';

import Image from 'next/image';
import { Play, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SalesAsset } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  testimonial: 'bg-amber-100 text-amber-700',
  intro: 'bg-blue-100 text-blue-700',
  case_study: 'bg-purple-100 text-purple-700',
  process: 'bg-green-100 text-green-700',
  site_visit: 'bg-cyan-100 text-cyan-700',
  before_after: 'bg-rose-100 text-rose-700',
  personal_message: 'bg-indigo-100 text-indigo-700',
  other: 'bg-gray-100 text-gray-700',
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatCategory(cat: string): string {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface AssetLibraryGridProps {
  assets: SalesAsset[];
  isLoading: boolean;
  onPlay?: (asset: SalesAsset) => void;
  onDelete?: (id: string) => void;
  onSelect?: (asset: SalesAsset) => void;
  selectable?: boolean;
  selectedIds?: string[];
  emptyMessage?: string;
}

export function AssetLibraryGrid({
  assets, isLoading, onPlay, onDelete, onSelect, selectable, selectedIds = [], emptyMessage = 'No videos uploaded yet.',
}: AssetLibraryGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (assets.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-12">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {assets.map((asset) => {
        const isSelected = selectedIds.includes(asset.id);
        const colorClass = CATEGORY_COLORS[asset.category] || CATEGORY_COLORS.other;
        return (
          <button
            key={asset.id}
            type="button"
            className={`group text-left rounded-lg border overflow-hidden transition-colors ${
              isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'
            } ${selectable || onPlay ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (selectable && onSelect) onSelect(asset);
              else if (onPlay) onPlay(asset);
            }}
          >
            <div className="aspect-video bg-muted relative">
              {asset.thumbnailUrl ? (
                <Image src={asset.thumbnailUrl} alt={asset.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              {asset.durationSeconds && (
                <span className="absolute bottom-1.5 right-1.5 text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
                  {formatDuration(asset.durationSeconds)}
                </span>
              )}
              {isSelected && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">✓</div>
                </div>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="absolute top-1.5 right-1.5 h-7 w-7 rounded-md bg-black/50 text-white/70 hover:text-white hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); onDelete(asset.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-sm font-medium truncate">{asset.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${colorClass}`}>
                  {formatCategory(asset.category)}
                </Badge>
                {asset.totalPlays > 0 && (
                  <span className="text-[10px] text-muted-foreground">{asset.totalPlays} plays</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
