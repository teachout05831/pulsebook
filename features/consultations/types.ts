import type { PageSection, DesignTheme } from "@/features/estimate-pages/types"

export type ConsultationStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'expired'
export type ConsultationPurpose = 'discovery' | 'estimate_review' | 'follow_up'
export type PresetWidgetType = "reviews" | "portfolio" | "estimate" | "process" | "video" | "faq" | "contract" | "custom_link"
export type WidgetType = PresetWidgetType | (string & {})

export interface ProcessStep { title: string; description: string; imageUrl?: string }
export interface FaqItem { question: string; answer: string }
export interface BeforeAfterPhoto { before: string; after: string; label?: string }
export interface Testimonial { quote: string; author: string; role?: string }

export interface ConsultationBrandKit {
  logoUrl: string | null
  primaryColor: string
  googleRating: number | null
  googleReviewCount: number | null
  certifications: string[]
  companyPhotos: string[]
  beforeAfterPhotos: BeforeAfterPhoto[]
  testimonials: Testimonial[]
  companyDescription: string | null
  yearsInBusiness: number | null
  insuranceInfo: string | null
}

export interface VideoAssetData {
  id: string; companyId: string; title: string; description: string | null
  category: string; bunnyCdnUrl: string; thumbnailUrl: string | null
  durationSeconds: number | null; isReusable: boolean; estimateId: string | null
  totalPlays: number; createdAt: string
}

export interface CallWidget {
  id: string; type: WidgetType; label: string; icon?: string; url?: string
  processSteps?: ProcessStep[]; faqs?: FaqItem[]; videoUrl?: string; content?: string
  videoAssetIds?: string[]; showAllLibraryVideos?: boolean; videoAssets?: VideoAssetData[]
  sections?: PageSection[]; designTheme?: DesignTheme
}

export interface ConsultationSettings {
  id?: string; enabled: boolean; defaultTitle: string; autoRecord: boolean
  expirationHours: number; showTrustSignals: boolean; showPortfolio: boolean
  welcomeMessage: string; widgets: CallWidget[]
  aiCoach?: {
    enabled: boolean; showTranscript: boolean; showServiceSuggestions: boolean
    showObjectionResponses: boolean; autoAdvanceStage: boolean
  }
  idlSettings?: IDLSettings
}

export interface IDLSettings {
  enablePipeline: boolean
  autoGenerateEstimate: boolean
  autoPopulatePage: boolean
  enableLiveWidget: boolean
  allowLiveApproval: boolean
  defaultPricingModel: 'flat' | 'hourly' | 'per_service'
  notifyWhenReady: boolean
}

export const IDL_DEFAULTS: IDLSettings = {
  enablePipeline: true,
  autoGenerateEstimate: false,
  autoPopulatePage: false,
  enableLiveWidget: false,
  allowLiveApproval: false,
  defaultPricingModel: 'flat',
  notifyWhenReady: true,
}

export type PipelineStatus = 'idle' | 'recording_ready' | 'uploading' | 'transcribing' | 'analyzing' | 'generating' | 'ready' | 'error'

export interface Consultation {
  id: string; companyId: string; customerId: string | null; estimateId: string | null
  presentedEstimateId: string | null
  title: string; purpose: ConsultationPurpose | null; publicToken: string
  dailyRoomName: string | null; dailyRoomUrl: string | null
  status: ConsultationStatus; pipelineStatus: PipelineStatus; pipelineError: string | null
  scheduledAt: string | null; startedAt: string | null; endedAt: string | null
  durationSeconds: number | null; expiresAt: string | null
  hostUserId: string; hostName: string
  customerName: string | null; customerEmail: string | null; customerPhone: string | null
  createdAt: string
}

export interface CreateConsultationInput {
  customerId?: string; estimateId?: string; title?: string
  purpose?: ConsultationPurpose; scheduledAt?: string
}

export interface PreviewConsultationData {
  companyName: string; logoUrl: string | null; primaryColor: string
  hostName: string; defaultTitle: string
  brandKit: ConsultationBrandKit | null
  widgets: CallWidget[]
}

export interface PublicConsultationData {
  id: string; title: string; purpose: string | null; status: ConsultationStatus
  hostName: string; customerName: string | null; dailyRoomUrl: string | null
  scheduledAt: string | null; companyName: string
  brandKit: (ConsultationBrandKit & { secondaryColor: string; accentColor: string }) | null
  widgets: CallWidget[]
}
