// Applied fee on an estimate
export interface AppliedFee {
  feeId: string;
  name: string;
  type: "percentage" | "fixed";
  rate: number;
  amount: number;
  applied: boolean;
}

// Estimate status types
export type EstimateStatus = "draft" | "sent" | "approved" | "declined" | "expired" | "lost";

// Pricing model types
export type PricingModel = "hourly" | "flat" | "per_service";
export type BindingType = "binding" | "non_binding";
export type DepositType = "percentage" | "fixed";
export type LineItemCategory = "primary_service" | "additional_service" | "materials" | "trip_fee" | "valuation" | "discount" | "custom";

// Line item for estimates (new fields optional for backward compat)
export interface EstimateLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: LineItemCategory;
  catalogItemId?: string | null;
  catalogType?: "service" | "material" | null;
  unitLabel?: string | null;
  isTaxable?: boolean;
  isCustom?: boolean;
  sortOrder?: number;
}

// Resources stored as JSONB on estimate
export interface EstimateResources {
  trucks: number | null;
  teamSize: number | null;
  estimatedHours: number | null;
  hourlyRate: number | null;
  showEstimatedHours: boolean;
  minHours: number | null;
  maxHours: number | null;
  customFields: Record<string, string | number | null>;
}

// Estimate location (stop/address)
export interface EstimateLocation {
  id: string;
  estimateId: string;
  locationType: "origin" | "destination" | "stop" | "service_location";
  label: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  propertyType: string | null;
  accessNotes: string | null;
  lat: number | null;
  lng: number | null;
  sortOrder: number;
}

// Estimate task
export interface EstimateTask {
  id: string;
  estimateId: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  assignedTo: string | null;
  assignedName: string | null;
  sortOrder: number;
}

// Main Estimate interface (list view)
export interface Estimate {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  estimateNumber: string;
  status: EstimateStatus;
  pricingModel: PricingModel;
  issueDate: string;
  expiryDate: string | null;
  lineItems: EstimateLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  terms: string | null;
  address: string | null;
  pageCount: number;
  pageStatus: string | null;
  pageToken: string | null;
  pageId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Full detail view (extends list with all fields)
export interface EstimateDetail extends Estimate {
  bindingType: BindingType;
  source: string | null;
  salesPersonId: string | null;
  salesPersonName: string | null;
  estimatorId: string | null;
  estimatorName: string | null;
  tags: string[];
  leadStatus: string | null;
  serviceType: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  internalNotes: string | null;
  customerNotes: string | null;
  crewNotes: string | null;
  crewFeedback: string | null;
  resources: EstimateResources;
  locations: EstimateLocation[];
  tasks: EstimateTask[];
  depositType: DepositType | null;
  depositAmount: number | null;
  depositPaid: number;
  customFields: Record<string, unknown>;
  appliedFees: AppliedFee[];
  jobId: string | null;
  assignedCrewId: string | null;
  technicianId: string | null;
  estimatePages: EstimatePageLink[];
}

// Linked estimate page info (for detail page)
export interface EstimatePageLink {
  id: string;
  status: string;
  publicToken: string;
  publishedAt: string | null;
  firstViewedAt: string | null;
  approvedAt: string | null;
}

// Re-export status constants (moved to estimate-constants.ts for file size compliance)
export { ESTIMATE_STATUS_LABELS, ESTIMATE_STATUS_COLORS } from "./estimate-constants";
