import type { EstimateStatus } from "./estimate";

// Status labels for display
export const ESTIMATE_STATUS_LABELS: Record<EstimateStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  approved: "Approved",
  declined: "Declined",
  expired: "Expired",
  lost: "Lost",
};

// Status colors for badges
export const ESTIMATE_STATUS_COLORS: Record<EstimateStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  expired: "bg-yellow-100 text-yellow-800",
  lost: "bg-orange-100 text-orange-800",
};
