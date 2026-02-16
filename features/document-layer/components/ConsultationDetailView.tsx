'use client';

import { useRouter } from 'next/navigation';
import { usePipelineStatus } from '../hooks/usePipelineStatus';
import { PipelineStatusBadge } from './PipelineStatusBadge';
import { PipelineTimeline } from './PipelineTimeline';
import { ConsultationRecording } from './ConsultationRecording';
import { AIReviewPanel } from './AIReviewPanel';
import { ArrowLeft, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PipelineStatus } from '../types';

interface Props {
  consultation: {
    id: string;
    title: string;
    customerName: string | null;
    hostName: string;
    pipelineStatus: PipelineStatus;
    pipelineError: string | null;
    dailyRoomName: string | null;
    startedAt: string | null;
    endedAt: string | null;
    durationSeconds: number | null;
    createdAt: string;
  };
}

export function ConsultationDetailView({ consultation }: Props) {
  const router = useRouter();
  const { state } = usePipelineStatus(consultation.id);
  const status = state?.status || consultation.pipelineStatus;
  const error = state?.error || consultation.pipelineError;

  const handleAccepted = (result: { estimateId: string }) => {
    router.push(`/estimates/${result.estimateId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-xl font-semibold">{consultation.title}</h1>
              <PipelineStatusBadge status={status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {consultation.customerName && `${consultation.customerName} · `}
              {consultation.hostName}
              {consultation.durationSeconds && ` · ${Math.round(consultation.durationSeconds / 60)} min`}
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Timeline (show when processing) */}
      {status !== 'idle' && status !== 'ready' && (
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Processing Pipeline</h3>
          <PipelineTimeline status={status} error={error} />
        </div>
      )}

      {/* Main Content: Recording + AI Review */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-h-[500px]">
          <ConsultationRecording
            consultationId={consultation.id}
            bunnyVideoId={state?.bunnyVideoId || null}
          />
        </div>
        <div>
          <AIReviewPanel
            consultationId={consultation.id}
            onAccepted={handleAccepted}
          />
        </div>
      </div>
    </div>
  );
}
