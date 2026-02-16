import type { Customer, LeadStatus } from "@/types/customer";

// Lead is a Customer with status='lead'
export type Lead = Customer & {
  status: "lead";
  leadStatus: LeadStatus;
};

// Tab definitions for Sales page
export type SalesTab = "dashboard" | "new-leads" | "my-leads" | "follow-up" | "sales-goals";

export interface TabConfig {
  id: SalesTab;
  label: string;
  icon: string;
  badge?: number;
  badgeVariant?: "default" | "neutral";
}

// Follow-up item
export interface FollowUpItem {
  id: string;
  customerId: string;
  customerName: string;
  type: "call" | "email" | "meeting";
  details: string;
  dueDate: string;
  status: "overdue" | "today" | "upcoming";
  daysOverdue?: number;
}

// Sales stats for dashboard
export interface SalesStats {
  newLeadsThisWeek: number;
  bookedThisWeek: number;
  conversionRate: number;
  pipelineValue: number;
  overdueFollowUps: number;
}

// Pipeline stage
export interface PipelineStage {
  label: string;
  count: number;
  percent: number;
  color: string;
}

// Lead status colors
export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-purple-100 text-purple-700",
  qualified: "bg-amber-100 text-amber-700",
  proposal: "bg-green-100 text-green-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-gray-100 text-gray-700",
};

// Sidebar filter options for My Leads
export type LeadsSidebarFilter =
  | "active"
  | "accepted"
  | "booked"
  | "job-date-tbd"
  | "unassigned"
  | "closed"
  | "messages";

// Sidebar filter options for Follow-ups
export type FollowUpsSidebarFilter =
  | "open"
  | "due-today"
  | "due-this-week"
  | "overdue"
  | "completed"
  | "all";

// Sidebar filter config
export interface SidebarFilterConfig {
  id: string;
  label: string;
  color?: string;
  comingSoon?: boolean;
}

// My Leads sidebar filters
export const LEADS_SIDEBAR_FILTERS: SidebarFilterConfig[] = [
  { id: "active", label: "Active", color: "text-blue-600" },
  { id: "accepted", label: "Accepted" },
  { id: "booked", label: "Booked" },
  { id: "job-date-tbd", label: "Job Date TBD" },
  { id: "unassigned", label: "Unassigned" },
  { id: "closed", label: "Closed", comingSoon: true },
  { id: "messages", label: "Messages", comingSoon: true },
];

// Follow-ups sidebar filters
export const FOLLOWUPS_SIDEBAR_FILTERS: SidebarFilterConfig[] = [
  { id: "open", label: "Open", color: "text-blue-600" },
  { id: "due-today", label: "Due Today", color: "text-amber-600" },
  { id: "due-this-week", label: "Due This Week" },
  { id: "overdue", label: "Overdue", color: "text-red-600" },
  { id: "completed", label: "Completed", color: "text-green-600" },
  { id: "all", label: "All" },
];

// Filter state for leads view
export interface LeadsFilterState {
  sidebarFilter: LeadsSidebarFilter;
  assignedTo?: string;
  leadStatus?: string;
  source?: string;
  search?: string;
}

// Filter state for follow-ups view
export interface FollowUpsFilterState {
  sidebarFilter: FollowUpsSidebarFilter;
  assignedTo?: string;
  search?: string;
}
