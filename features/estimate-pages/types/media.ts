import type { VideoCategory, VideoCallType } from "./core";

export interface EstimateVideo {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  category: VideoCategory;
  bunnyVideoId: string;
  bunnyLibraryId: string;
  bunnyCdnUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  fileSizeBytes: number | null;
  resolution: string | null;
  isReusable: boolean;
  estimateId: string | null;
  totalPlays: number;
  avgWatchPercentage: number;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VideoCallParticipant {
  name: string;
  role: string;
  joinedAt: string;
  leftAt: string | null;
}

export interface EstimateVideoCall {
  id: string;
  companyId: string;
  estimateId: string | null;
  pageId: string | null;
  customerId: string | null;
  consultationId: string | null;
  dailyRoomName: string;
  dailyRoomUrl: string;
  callType: VideoCallType;
  scheduledAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
  transcript: string | null;
  transcriptSummary: string | null;
  extractedScope: Record<string, unknown> | null;
  extractedPricing: Record<string, unknown> | null;
  aiEstimateOutput: Record<string, unknown> | null;
  aiPageContent: Record<string, unknown> | null;
  bunnyVideoId: string | null;
  recordingUrl: string | null;
  processingError: string | null;
  participants: VideoCallParticipant[] | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}
