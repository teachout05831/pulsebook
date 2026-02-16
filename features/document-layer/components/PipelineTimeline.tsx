'use client';

import { Check, Loader2, Circle, AlertCircle } from 'lucide-react';
import type { PipelineStatus } from '../types';

const STEPS: Array<{ key: PipelineStatus[]; label: string }> = [
  { key: ['recording_ready'], label: 'Recording captured' },
  { key: ['uploading'], label: 'Uploading to cloud' },
  { key: ['transcribing'], label: 'Transcribing audio' },
  { key: ['analyzing'], label: 'AI analyzing call' },
  { key: ['generating'], label: 'Generating estimate' },
  { key: ['ready'], label: 'Ready for review' },
];

const STATUS_ORDER: PipelineStatus[] = [
  'idle', 'recording_ready', 'uploading', 'transcribing', 'analyzing', 'generating', 'ready',
];

interface Props {
  status: PipelineStatus;
  error?: string | null;
}

export function PipelineTimeline({ status, error }: Props) {
  const currentIdx = STATUS_ORDER.indexOf(status);

  return (
    <div className="space-y-3">
      {STEPS.map((step, i) => {
        const stepIdx = STATUS_ORDER.indexOf(step.key[0]);
        const isComplete = currentIdx > stepIdx;
        const isActive = step.key.includes(status);
        const isError = status === 'error' && isActive;

        return (
          <div key={step.label} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {isError ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : isComplete ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/30" />
              )}
            </div>
            <span className={`text-sm ${isComplete ? 'text-muted-foreground' : isActive ? 'font-medium' : 'text-muted-foreground/50'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
      {error && (
        <p className="text-sm text-destructive ml-8">{error}</p>
      )}
    </div>
  );
}
