export type BlockType =
  | 'heading' | 'text' | 'column_layout' | 'pricing_table' | 'table'
  | 'signature' | 'timestamp_hourly' | 'callout' | 'payment'
  | 'detail_grid' | 'checkbox_list' | 'divider' | 'status_tracker'
  | 'company_header' | 'custom_html'
export type BlockMode = 'edit' | 'view' | 'live'
export type CellType = 'text' | 'heading' | 'signature' | 'detail_grid' | 'callout' | 'checkbox_list' | 'timestamp_hourly' | 'status_tracker' | 'table'
export interface ColumnCell { id: string; cellType: CellType; content: Record<string, unknown>; background?: string }
export type BlockStage = 'before_job' | 'neutral' | 'crew' | 'after_job'
export const STAGE_COLORS: Record<BlockStage, { bg: string; border: string; label: string }> = {
  before_job: { bg: '#FEF3C7', border: '#F59E0B', label: 'Before Job' },
  neutral: { bg: '#FFFFFF', border: '#E5E7EB', label: 'Neutral' },
  crew: { bg: '#DBEAFE', border: '#3B82F6', label: 'Crew' },
  after_job: { bg: '#D1FAE5', border: '#10B981', label: 'After Job' },
}
export type ContractStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'paid' | 'completed' | 'cancelled'
export type TimeEventType = 'start' | 'stop'
export type TimeReason = 'work' | 'break' | 'lunch' | 'travel' | 'waiting' | 'other'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type PaymentType = 'deposit' | 'full' | 'recurring' | 'milestone'
export type PaymentProvider = 'manual' | 'stripe' | 'square' | 'custom'
export type PaymentMethod = 'cash' | 'check' | 'card' | 'ach' | 'venmo' | 'zelle' | 'other'
export interface BlockSettings {
  border: 'none' | 'thin' | 'thick' | 'dashed'
  background: string
  padding: 'sm' | 'md' | 'lg'
  width: 'full' | 'contained'
}
export interface ContractBlock {
  id: string
  type: BlockType
  stage: BlockStage
  content: Record<string, unknown>
  settings: BlockSettings
  order: number
}
export interface ContractTemplate {
  id: string
  companyId: string
  name: string
  description: string | null
  category: string
  designTheme: string
  blocks: ContractBlock[]
  stageColors: Record<string, string>
  isActive: boolean
  isDefault: boolean
  version: number
  attachmentMode: 'auto' | 'manual'
  appliesTo: string[]
  createdAt: string
  updatedAt: string
}
export interface ContractInstance {
  id: string
  companyId: string
  templateId: string
  jobId: string
  customerId: string
  status: ContractStatus
  filledBlocks: ContractBlock[]
  templateSnapshot: ContractTemplate
  signingToken: string
  sentAt: string | null
  viewedAt: string | null
  signedAt: string | null
  paidAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}
export interface ContractSignature {
  id: string
  contractId: string
  blockId: string
  signerRole: string
  signerName: string
  signerEmail: string | null
  signatureData: string
  stage: BlockStage
  gpsLatitude: number | null
  gpsLongitude: number | null
  signedAt: string
}
export interface TimeEntry {
  id: string
  contractId: string
  eventType: TimeEventType
  reason: TimeReason
  isBillable: boolean
  recordedAt: string
  recordedBy: string
  gpsLatitude: number | null
  gpsLongitude: number | null
  notes: string | null
  originalRecordedAt: string | null
  editedAt: string | null
  editedBy: string | null
  editReason: string | null
}
export interface TimePair {
  start: TimeEntry
  stop: TimeEntry | null
  duration: number | null
  reason: TimeReason
  isBillable: boolean
}
export interface CreateTemplateInput {
  name: string
  description?: string
  category?: string
  designTheme?: string
  blocks?: ContractBlock[]
}
export interface UpdateTemplateInput {
  name?: string
  description?: string
  category?: string
  designTheme?: string
  blocks?: ContractBlock[]
  stageColors?: Record<string, string>
  isActive?: boolean
  isDefault?: boolean
  attachmentMode?: 'auto' | 'manual'
  appliesTo?: string[]
}
export interface CreateInstanceInput { templateId: string; jobId: string; customerId: string }
export interface RecordTimeEntryInput {
  contractId: string; eventType: TimeEventType; reason?: TimeReason
  isBillable?: boolean; gpsLatitude?: number; gpsLongitude?: number; notes?: string
}
export interface UpdateTimeEntryInput {
  recordedAt?: string
  reason?: TimeReason
  isBillable?: boolean
  notes?: string
  editReason: string
}
export interface ContractPayment {
  id: string; contractId: string; amount: number; paymentType: PaymentType
  paymentMethod: string | null; externalPaymentId: string | null
  status: PaymentStatus; collectedAt: string | null; createdAt: string
}
export interface CreatePaymentInput { contractId: string; amount: number; paymentType: PaymentType; paymentMethod?: PaymentMethod }

// Contracts list types
export interface ContractListItem {
  id: string
  templateName: string
  templateCategory: string | null
  customerName: string
  customerId: string
  jobTitle: string | null
  jobId: string
  status: ContractStatus
  signedAt: string | null
  createdAt: string
}

export interface ContractsStats {
  total: number
  signed: number
  sentPending: number
  completed: number
}

export interface StatusEvent {
  id: string; contractId: string; stepLabel: string; stepIndex: number
  recordedAt: string; recordedBy: string; gpsLatitude: number | null; gpsLongitude: number | null; notes: string | null
}
