'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Film, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCompanyVideos } from '../hooks/useCompanyVideos';
import { VideoUploadButton } from './VideoUploadButton';

interface CompanyVideo {
  id: string;
  title: string;
  bunnyCdnUrl: string;
  thumbnailUrl: string | null;
  category: string;
  durationSeconds: number | null;
  createdAt: string;
}

interface Props {
  onSelect: (video: CompanyVideo) => void;
  triggerLabel?: string;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function VideoLibraryPicker({ onSelect, triggerLabel = 'Choose Video' }: Props) {
  const [open, setOpen] = useState(false);
  const { videos, isLoading, refresh } = useCompanyVideos();

  const handleSelect = (video: CompanyVideo) => {
    onSelect(video);
    setOpen(false);
  };

  const handleUploadComplete = async () => {
    await refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Film className="mr-2 h-3.5 w-3.5" />{triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Video Library</DialogTitle>
        </DialogHeader>

        <VideoUploadButton onUploadComplete={handleUploadComplete} />

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : videos.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No videos uploaded yet. Upload one above.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {videos.map((video) => (
              <button
                key={video.id}
                type="button"
                className="text-left rounded-md border hover:border-primary hover:bg-accent/50 transition-colors overflow-hidden"
                onClick={() => handleSelect(video as CompanyVideo)}
              >
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {video.thumbnailUrl ? (
                    <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                  ) : (
                    <Play className="h-8 w-8 text-muted-foreground" />
                  )}
                  {video.durationSeconds && (
                    <span className="absolute bottom-1 right-1 text-[10px] bg-black/70 text-white px-1 rounded">
                      {formatDuration(video.durationSeconds)}
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{video.title}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{video.category.replace('_', ' ')}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
