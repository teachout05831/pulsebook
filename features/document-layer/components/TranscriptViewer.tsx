'use client';

import { useTranscriptViewer } from '../hooks/useTranscriptViewer';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

interface Props {
  consultationId: string;
  onTimestampClick?: (time: number) => void;
}

export function TranscriptViewer({ consultationId, onTimestampClick }: Props) {
  const { status, entries, search, setSearch, isLoading } = useTranscriptViewer(consultationId);

  if (status === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm">Waiting for recording...</p>
      </div>
    );
  }

  if (status === 'transcribing') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
        <p className="text-sm">Transcribing audio...</p>
        <p className="text-xs mt-1">This usually takes 2-5 minutes</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search transcript..."
          className="pl-9"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {entries.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            {search ? 'No matching entries' : 'No transcript entries'}
          </p>
        )}

        {entries.map((entry) => (
          <button
            key={`${entry.speaker}-${entry.startTime}`}
            onClick={() => onTimestampClick?.(entry.startTime)}
            className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-medium text-primary">{entry.speaker}</span>
              <span className="text-xs text-muted-foreground">{formatTime(entry.startTime)}</span>
            </div>
            <p className="text-sm">{entry.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
