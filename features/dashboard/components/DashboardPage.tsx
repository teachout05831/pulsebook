"use client";

import { useState } from "react";
import { useDashboardData, useDashboardRefresh, useDetailPopup } from "../hooks";
import { StatsStrip } from "./StatsStrip";
import { ActivityFeed } from "./ActivityFeed";
import { SalesLeadersSection } from "./SalesLeadersSection";
import { TopReferralsSection } from "./TopReferralsSection";
import { LeadPipelineSection } from "./LeadPipelineSection";
import { RevenueChart } from "./RevenueChart";
import { QuickActions } from "./QuickActions";
import { TodaysSchedule } from "./TodaysSchedule";
import { DetailPopup } from "./DetailPopup";
import type { DateRange } from "../types";

export function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>("today");
  const { data, isLoading, refresh } = useDashboardData(dateRange);
  useDashboardRefresh(refresh);
  const { popupData, isOpen, openSalesLeader, closeDetail } = useDetailPopup();

  return (
    <div className="-m-4 md:-m-6 lg:-m-8 bg-slate-50 min-h-screen">
      {/* Stats Strip */}
      <StatsStrip stats={data?.stats ?? null} isLoading={isLoading} />

      {/* Date Range Toggle */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="text-xs text-slate-500 mr-2">Show:</span>
          {(["today", "month"] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                dateRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {range === "today" ? "Today" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
            <SalesLeadersSection
              leaders={data?.salesLeaders ?? []}
              isLoading={isLoading}
              onLeaderClick={openSalesLeader}
            />
            <TopReferralsSection
              sources={data?.referralSources ?? []}
              isLoading={isLoading}
            />
            <LeadPipelineSection
              stages={data?.pipeline ?? []}
              isLoading={isLoading}
            />
          </div>

          {/* Center: Activity Feed */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <ActivityFeed />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 order-3 space-y-6">
            <RevenueChart
              data={data?.revenueChart ?? []}
              isLoading={isLoading}
            />
            <QuickActions />
            <TodaysSchedule
              items={data?.todaysSchedule ?? []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Detail Popup */}
      <DetailPopup data={popupData} isOpen={isOpen} onClose={closeDetail} />
    </div>
  );
}
