// Sales stage progression (forward-only)
export type SalesStage =
  | 'greeting'
  | 'discovery'
  | 'needs_assessment'
  | 'solution_presentation'
  | 'pricing_discussion'
  | 'objection_handling'
  | 'closing'
  | 'wrap_up'

// Coaching card visual types
export type CoachCardType =
  | 'stage_prompt'
  | 'service_suggestion'
  | 'objection_response'
  | 'closing_script'
  | 'info_alert'

// Live transcript message from Daily.co
export interface TranscriptMessage {
  id: string
  speaker: string
  text: string
  timestamp: number
  isHost: boolean
}

// Coaching suggestion card shown to the rep
export interface CoachingSuggestion {
  id: string
  type: CoachCardType
  title: string
  body: string
  scriptText?: string
  serviceId?: string
  stage: SalesStage
  priority: number
  createdAt: number
  dismissed: boolean
}

// Catalog item transformed for coach matching
export interface CoachCatalogItem {
  id: string
  name: string
  description: string | null
  category: string
  keywords: string[]
}

// AI Coach settings (stored in consultation_settings.ai_coach JSONB)
export interface AICoachSettings {
  enabled: boolean
  showTranscript: boolean
  showServiceSuggestions: boolean
  showObjectionResponses: boolean
  autoAdvanceStage: boolean
}

// Stage configuration for detection
export interface StageConfig {
  stage: SalesStage
  label: string
  description: string
  keywords: string[][]
  talkingPoints: string[]
}

// Objection pattern for detection
export interface ObjectionPattern {
  id: string
  keywords: string[]
  category: 'price' | 'timing' | 'competitor' | 'trust' | 'scope' | 'custom'
  response: string
  alternateResponses: string[]
}

// --- Customization types (company-specific overrides) ---

// Override for a single coaching card (matched by card ID)
export interface CoachingCardOverride {
  id: string
  title?: string
  body?: string
  scriptText?: string
}

// Override for a single stage
export interface StageOverride {
  cards?: CoachingCardOverride[]
  extraKeywords?: string[][]
  disabledKeywords?: string[]
}

// Override for a default objection's response text
export interface ObjectionOverride {
  response?: string
  alternateResponses?: string[]
  extraKeywords?: string[]
  disabledKeywords?: string[]
}

// A fully custom objection pattern (company-specific)
export interface CustomObjection {
  id: string
  keywords: string[]
  category: 'price' | 'timing' | 'competitor' | 'trust' | 'scope' | 'custom'
  response: string
  alternateResponses: string[]
}

// Top-level customization shape (camelCase in TypeScript)
export interface CoachLibraryCustomization {
  companyContext: string
  stageOverrides: Partial<Record<SalesStage, StageOverride>>
  objectionOverrides: Record<string, ObjectionOverride>
  customObjections: CustomObjection[]
}
