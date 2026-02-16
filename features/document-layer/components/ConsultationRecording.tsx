'use client';

import { TranscriptViewer } from './TranscriptViewer';

interface Props {
  consultationId: string;
  bunnyVideoId: string | null;
  bunnyLibraryId?: string;
}

export function ConsultationRecording({ consultationId, bunnyVideoId, bunnyLibraryId }: Props) {
  const libraryId = bunnyLibraryId || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || '';

  return (
    <div className="flex flex-col h-full gap-4">
      {bunnyVideoId ? (
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://iframe.mediadelivery.net/embed/${libraryId}/${bunnyVideoId}?autoplay=false`}
            className="w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Recording not yet available</p>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <h3 className="text-sm font-medium mb-2">Transcript</h3>
        <TranscriptViewer consultationId={consultationId} />
      </div>
    </div>
  );
}
