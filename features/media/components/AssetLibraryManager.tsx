'use client';

import { useState, useCallback } from 'react';
import { Film, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useSalesAssets } from '../hooks/useSalesAssets';
import { VideoUploadButton } from './VideoUploadButton';
import { AssetLibraryGrid } from './AssetLibraryGrid';

const FILTER_TABS = [
  { value: '', label: 'All' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'intro', label: 'Intro' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'process', label: 'Process' },
  { value: 'other', label: 'Other' },
];

export function AssetLibraryManager() {
  const [activeFilter, setActiveFilter] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { assets, isLoading, refresh, deleteAsset } = useSalesAssets({
    category: activeFilter || undefined,
  });

  const handleUploadComplete = useCallback(() => {
    setShowUpload(false);
    refresh();
  }, [refresh]);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteId) {
      await deleteAsset(deleteId);
      setDeleteId(null);
    }
  }, [deleteId, deleteAsset]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Film className="h-4 w-4" />
            Sales Asset Library
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload and organize videos for your sales team to share during consultations
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowUpload(!showUpload)}>
          <Upload className="h-3.5 w-3.5 mr-1.5" />Upload Video
        </Button>
      </div>

      {showUpload && (
        <VideoUploadButton onUploadComplete={handleUploadComplete} defaultCategory="testimonial" />
      )}

      <div className="flex flex-wrap gap-1.5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              activeFilter === tab.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-accent border-border'
            }`}
            onClick={() => setActiveFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AssetLibraryGrid
        assets={assets}
        isLoading={isLoading}
        onPlay={() => {}}
        onDelete={setDeleteId}
        emptyMessage={activeFilter ? `No ${activeFilter.replace('_', ' ')} videos yet.` : 'No videos uploaded yet. Upload one to get started.'}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the video from your library. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
