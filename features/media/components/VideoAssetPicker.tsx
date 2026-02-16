'use client';

import { useCallback } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSalesAssets } from '../hooks/useSalesAssets';
import { AssetLibraryGrid } from './AssetLibraryGrid';
import type { SalesAsset } from '../types';

interface VideoAssetPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  showAll?: boolean;
  onShowAllChange?: (showAll: boolean) => void;
}

export function VideoAssetPicker({ selectedIds, onChange, showAll, onShowAllChange }: VideoAssetPickerProps) {
  const { assets, isLoading } = useSalesAssets();
  const hasToggle = onShowAllChange !== undefined;

  const handleSelect = useCallback((asset: SalesAsset) => {
    const isSelected = selectedIds.includes(asset.id);
    if (isSelected) {
      onChange(selectedIds.filter((id) => id !== asset.id));
    } else {
      onChange([...selectedIds, asset.id]);
    }
  }, [selectedIds, onChange]);

  return (
    <div className="space-y-3">
      {hasToggle && (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm">Show all library videos</Label>
            <p className="text-xs text-muted-foreground">
              All videos from your Sales Asset Library will be available during calls
            </p>
          </div>
          <Switch checked={showAll} onCheckedChange={onShowAllChange} />
        </div>
      )}

      {(!hasToggle || !showAll) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Select videos</p>
            {assets.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {selectedIds.length} of {assets.length} selected
              </span>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto rounded-lg border p-2">
            <AssetLibraryGrid
              assets={assets}
              isLoading={isLoading}
              selectable
              selectedIds={selectedIds}
              onSelect={handleSelect}
              emptyMessage="No videos in your library yet. Upload videos in the Asset Library tab."
            />
          </div>
        </div>
      )}
    </div>
  );
}
