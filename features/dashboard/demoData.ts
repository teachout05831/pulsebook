import type { DashboardData } from "./types";

export const DEMO_DATA: DashboardData = {
  stats: { jobsThisMonth: 30, revenueThisMonth: 26079, jobsToday: 5, avgJobValue: 964 },
  salesLeaders: [
    { id: "sl1", name: "Monica Copo", jobCount: 7, revenue: 8096 },
    { id: "sl2", name: "Daniela", jobCount: 8, revenue: 3692 },
    { id: "sl3", name: "Raquel", jobCount: 3, revenue: 3164 },
  ],
  referralSources: [
    { source: "Equate Media", leadCount: 14, revenue: 11241 },
    { source: "Your Website", leadCount: 1, revenue: 2139 },
    { source: "Return Customer", leadCount: 2, revenue: 798 },
    { source: "Word of Mouth", leadCount: 1, revenue: 774 },
  ],
  pipeline: [
    { stage: "new", count: 4, color: "blue" },
    { stage: "contacted", count: 3, color: "cyan" },
    { stage: "qualified", count: 2, color: "amber" },
    { stage: "proposal", count: 1, color: "purple" },
    { stage: "won", count: 1, color: "green" },
  ],
  revenueChart: [
    { month: "Sep", revenue: 15200, isCurrent: false },
    { month: "Oct", revenue: 18400, isCurrent: false },
    { month: "Nov", revenue: 22100, isCurrent: false },
    { month: "Dec", revenue: 20800, isCurrent: false },
    { month: "Jan", revenue: 24250, isCurrent: false },
    { month: "Feb", revenue: 26079, isCurrent: true },
  ],
  todaysSchedule: [
    { id: "ts1", time: "08:00", customerName: "James Rodriguez", jobTitle: "Local Move", assignedTo: "Monica Copo", status: "scheduled" },
    { id: "ts2", time: "09:30", customerName: "Tom Williams", jobTitle: "Pool Cleaning", assignedTo: "Raquel", status: "scheduled" },
    { id: "ts3", time: "11:00", customerName: "Karen L.", jobTitle: "Deep Clean", assignedTo: "Daniela", status: "scheduled" },
    { id: "ts4", time: "13:30", customerName: "Pete F.", jobTitle: "Pool Maintenance", assignedTo: "Raquel", status: "scheduled" },
    { id: "ts5", time: "15:00", customerName: "Office Building", jobTitle: "Weekly Clean", assignedTo: "Monica Copo + Daniela", status: "scheduled" },
  ],
};

export function isDashboardEmpty(data: DashboardData): boolean {
  return data.salesLeaders.length === 0
    && data.referralSources.length === 0
    && data.todaysSchedule.length === 0;
}
