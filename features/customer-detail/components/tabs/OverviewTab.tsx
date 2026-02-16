"use client";

import { OverviewStatsGrid, UpcomingJobsCard, QuickActionsCard, CustomFieldsSection } from "./overview";
import type { CustomerStats } from "../../types";
import type { Job } from "@/types/job";

interface OverviewTabProps {
  stats: CustomerStats;
  upcomingJobs: Job[];
  customerPhone?: string | null;
  customerEmail?: string | null;
  customFields?: Record<string, unknown>;
  isLoadingJobs?: boolean;
}

export function OverviewTab({ stats, upcomingJobs, customerPhone, customerEmail, customFields, isLoadingJobs }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <OverviewStatsGrid stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingJobsCard jobs={upcomingJobs} isLoading={isLoadingJobs} />
        </div>
        <div>
          <QuickActionsCard customerPhone={customerPhone} customerEmail={customerEmail} />
        </div>
      </div>
      <CustomFieldsSection customFields={customFields} />
    </div>
  );
}
