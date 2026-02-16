"use client";

import { ClipboardCheck, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "../types";

interface StatsStripProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

const STAT_CONFIGS = [
  { key: "jobsThisMonth" as const, label: "Jobs This Month", icon: ClipboardCheck, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { key: "jobsToday" as const, label: "Jobs Today", icon: Calendar, iconBg: "bg-green-50", iconColor: "text-green-600" },
  { key: "avgJobValue" as const, label: "Avg Job Value", icon: DollarSign, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  { key: "revenueThisMonth" as const, label: "Revenue This Month", icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
];

function StatValue({ statKey, stats }: { statKey: string; stats: DashboardStats }) {
  if (statKey === "jobsThisMonth") {
    return (
      <p className="text-lg font-bold text-slate-800">
        {stats.jobsThisMonth}{" "}
        <span className="text-sm font-normal text-slate-400">/ {formatCurrency(stats.revenueThisMonth)}</span>
      </p>
    );
  }
  if (statKey === "jobsToday") {
    return <p className="text-lg font-bold text-slate-800">{stats.jobsToday}</p>;
  }
  if (statKey === "avgJobValue") {
    return <p className="text-lg font-bold text-slate-800">{formatCurrency(stats.avgJobValue)}</p>;
  }
  return <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.revenueThisMonth)}</p>;
}

export function StatsStrip({ stats, isLoading }: StatsStripProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          {STAT_CONFIGS.map(cfg => (
            <div key={cfg.key} className="flex items-center gap-3 p-2 sm:p-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                <cfg.icon className={`h-5 w-5 ${cfg.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{cfg.label}</p>
                {isLoading ? (
                  <Skeleton className="h-6 w-20 mt-0.5" />
                ) : stats ? (
                  <StatValue statKey={cfg.key} stats={stats} />
                ) : (
                  <p className="text-lg font-bold text-slate-800">&mdash;</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
