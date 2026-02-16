import type { EstimateLineItem, EstimateResources, PricingModel, DepositType, AppliedFee } from "./estimate";

export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type RecurrenceFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export interface RecurrenceConfig {
  frequency: RecurrenceFrequency;
  daysOfWeek: number[]; // 0=Sunday, 6=Saturday
  startDate: string; // ISO date
  endDate: string | null; // ISO date or null for indefinite
  occurrences: number | null; // Max count or null for endDate-based
}

export interface Job {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string; // Denormalized for display
  title: string;
  description: string | null;
  status: JobStatus;
  scheduledDate: string; // ISO date string
  scheduledTime: string | null; // Time string like "09:00"
  arrivalWindow: string | null; // ArrivalWindow ID from company settings
  estimatedDuration: number | null; // In minutes
  address: string | null;
  assignedTo: string | null; // Technician name/id
  assignedCrewId: string | null; // Crew UUID
  dispatchedAt: string | null; // When schedule was pushed to tech portal
  notes: string | null;
  customFields: Record<string, unknown>;
  tags: string[];
  isRecurringTemplate: boolean;
  parentJobId: string | null;
  recurrenceConfig: RecurrenceConfig | null;
  instanceDate: string | null;
  // Pricing fields
  lineItems: EstimateLineItem[];
  pricingModel: PricingModel;
  resources: EstimateResources;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  depositType: DepositType | null;
  depositAmount: number;
  depositPaid: number;
  appliedFees: AppliedFee[];
  sourceEstimateId: string | null;
  internalNotes: string | null;
  customerNotes: string | null;
  crewNotes: string | null;
  crewFeedback: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export type JobDetail = Job;

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};
