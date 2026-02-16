// Tab type definitions
export type CustomerTab =
  | "overview"
  | "sales"
  | "estimates"
  | "jobs"
  | "invoices"
  | "files"
  | "notes";

export interface TabConfig {
  id: CustomerTab;
  label: string;
  icon: string;
  badgeCount?: number;
  badgeVariant?: "default" | "success" | "warning" | "destructive";
}

// Customer stats for overview
export interface CustomerStats {
  lifetimeValue: number;
  activeJobs: number;
  pendingEstimates: number;
  balanceDue: number;
  totalJobs: number;
  completedJobs: number;
  totalEstimates: number;
  totalInvoices: number;
}

// Activity item for recent activity
export interface ActivityItem {
  id: string;
  type: "job" | "estimate" | "invoice" | "note" | "payment";
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

// Customer status type
export type CustomerStatus = "active" | "inactive" | "lead";

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  lead: "Lead",
};

export const CUSTOMER_STATUS_COLORS: Record<CustomerStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  lead: "bg-blue-100 text-blue-800",
};

// Note type for customer notes
export interface CustomerNote {
  id: string;
  customerId: string;
  content: string;
  isPinned: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  content: string;
  isPinned?: boolean;
}

// File/attachment type
export interface CustomerFile {
  id: string;
  customerId: string;
  name: string;
  type: "photo" | "document" | "contract";
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

// Props interfaces for components
export interface CustomerDetailProps {
  customerId: string;
}

export interface CustomerHeaderProps {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    status?: CustomerStatus;
    tags?: string[];
    userId?: string | null;
    balanceDue?: number;
  };
  from?: string | null;
  onEdit?: () => void;
  onNewJob?: () => void;
  onConsultation?: () => void;
  onPortalAccessChange?: () => void;
}

export interface CustomerTabsProps {
  activeTab: CustomerTab;
  onTabChange: (tab: CustomerTab) => void;
  counts: {
    estimates: number;
    jobs: number;
    invoices: number;
    files: number;
    notes: number;
  };
}

// Lead profile types
export type LeadTab = "activity" | "sales" | "estimates" | "notes";

export interface LeadTabsProps {
  activeTab: LeadTab;
  onTabChange: (tab: LeadTab) => void;
  counts: {
    estimates: number;
    notes: number;
    interactions: number;
  };
}

export interface LeadQuickStatsData {
  estimatedValue: number;
  estimatesCount: number;
  lastContact: string | null;
  interactionsCount: number;
}

// Jobs tab filter
export type JobsFilterStatus = "all" | "scheduled" | "in_progress" | "completed";
