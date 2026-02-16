// New unified feed item from activity_log table
export interface DashboardFeedItem {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  metadata: Record<string, unknown> | null;
  performedByName: string | null;
  customerId: string | null;
  customerName: string | null;
  category: "system" | "manual";
  amount: number | null;
  createdAt: string;
}

// Legacy activity feed types (kept for DetailPopup compatibility)
export type ActivityType = "booked" | "lead" | "quote_sent" | "cancelled";

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  jobId?: string;
  jobTitle?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  amount?: number;
  assignedTo?: string;
  address?: string;
  cancellationReason?: string;
  source?: string;
  leadStatus?: string;
  serviceType?: string;
  estimatedValue?: number;
  estimateId?: string;
  estimateNumber?: string;
  estimateTotal?: number;
  estimateStatus?: string;
  timestamp: string;
}

export interface SalesLeader {
  id: string;
  name: string;
  jobCount: number;
  revenue: number;
}

export interface ReferralSource {
  source: string;
  leadCount: number;
  revenue: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
  color: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  isCurrent: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  customerName: string;
  jobTitle: string;
  assignedTo: string | null;
  status: "scheduled" | "in_progress" | "completed";
}

export interface DashboardStats {
  jobsThisMonth: number;
  revenueThisMonth: number;
  jobsToday: number;
  avgJobValue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  salesLeaders: SalesLeader[];
  referralSources: ReferralSource[];
  pipeline: PipelineStage[];
  revenueChart: RevenueDataPoint[];
  todaysSchedule: ScheduleItem[];
}

export type DateRange = "today" | "month";

// Props for detail popup
export interface DetailPopupData {
  type: "sales_leader";
  item: SalesLeader;
}
