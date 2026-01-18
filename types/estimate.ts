// Estimate status types
export type EstimateStatus = "draft" | "sent" | "approved" | "declined" | "expired";

// Line item for estimates
export interface EstimateLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Main Estimate interface
export interface Estimate {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string;
  estimateNumber: string;
  status: EstimateStatus;
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
  createdAt: string;
  updatedAt: string;
}

// Status labels for display
export const ESTIMATE_STATUS_LABELS: Record<EstimateStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  approved: "Approved",
  declined: "Declined",
  expired: "Expired",
};

// Status colors for badges
export const ESTIMATE_STATUS_COLORS: Record<EstimateStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  expired: "bg-yellow-100 text-yellow-800",
};
