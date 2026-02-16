// IDL Pipeline Types

export type PipelineStatus =
  | 'idle'
  | 'recording_ready'
  | 'uploading'
  | 'transcribing'
  | 'analyzing'
  | 'generating'
  | 'ready'
  | 'error';

export interface PipelineState {
  consultationId: string;
  status: PipelineStatus;
  error: string | null;
  videoCallId: string | null;
  bunnyVideoId: string | null;
  hasTranscript: boolean;
  hasEstimate: boolean;
  hasPage: boolean;
  estimateId: string | null;
  pageId: string | null;
}

export interface TranscriptEntry {
  speaker: string;
  startTime: number;
  endTime: number;
  text: string;
}

export interface AIEstimateOutput {
  lineItems: AILineItem[];
  resources: AIResources;
  pricingModel: 'flat' | 'hourly' | 'per_service';
  customerNotes: string;
  internalNotes: string;
  serviceType: string;
}

export interface AILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  category: string;
  catalogItemId?: string;
  isTaxable: boolean;
  unitLabel?: string;
}

export interface AIResources {
  trucks: number;
  teamSize: number;
  estimatedHours: number;
  hourlyRate: number;
}

export interface AIPageContent {
  [sectionType: string]: Record<string, unknown>;
}

export interface VideoCallWithPipeline {
  id: string;
  consultationId: string | null;
  bunnyVideoId: string | null;
  transcript: string | null;
  transcriptSummary: string | null;
  extractedScope: Record<string, unknown> | null;
  extractedPricing: Record<string, unknown> | null;
  aiEstimateOutput: AIEstimateOutput | null;
  aiPageContent: AIPageContent | null;
  recordingUrl: string | null;
  processingError: string | null;
}

export interface ConsultationWithPipeline {
  id: string;
  companyId: string;
  customerId: string | null;
  estimateId: string | null;
  title: string;
  status: string;
  pipelineStatus: PipelineStatus;
  pipelineError: string | null;
  dailyRoomName: string | null;
  hostName: string;
  customerName: string | null;
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
  createdAt: string;
}
