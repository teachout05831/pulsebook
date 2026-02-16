'use client';

import { Badge } from '@/components/ui/badge';
import type { PipelineStatus } from '../types';

const STATUS_CONFIG: Record<PipelineStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  idle: { label: 'Idle', variant: 'secondary' },
  recording_ready: { label: 'Recording Ready', variant: 'outline' },
  uploading: { label: 'Uploading', variant: 'outline' },
  transcribing: { label: 'Transcribing', variant: 'outline' },
  analyzing: { label: 'Analyzing', variant: 'outline' },
  generating: { label: 'Generating', variant: 'outline' },
  ready: { label: 'Ready', variant: 'default' },
  error: { label: 'Error', variant: 'destructive' },
};

interface Props {
  status: PipelineStatus;
}

export function PipelineStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  const isProcessing = !['idle', 'ready', 'error'].includes(status);

  return (
    <Badge variant={config.variant} className={isProcessing ? 'animate-pulse' : ''}>
      {config.label}
    </Badge>
  );
}
