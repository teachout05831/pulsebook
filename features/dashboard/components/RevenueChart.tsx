"use client";

import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "./SectionContainer";
import type { RevenueDataPoint } from "../types";

interface RevenueChartProps {
  data: RevenueDataPoint[];
  isLoading: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const maxRevenue = useMemo(() => Math.max(...data.map(d => d.revenue), 1), [data]);
  const avg = useMemo(() => data.length > 0
    ? Math.round(data.reduce((sum, d) => sum + d.revenue, 0) / data.length)
    : 0, [data]);

  return (
    <SectionContainer icon={<BarChart3 className="h-4 w-4 text-emerald-500" />} title="Revenue (6 Months)">
      {isLoading ? (
        <div className="flex items-end justify-between gap-2 h-32">
          {[65, 45, 80, 55, 70, 40].map((h, i) => (
            <Skeleton key={i} className="flex-1 rounded" style={{ height: `${h}%` }} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between gap-2 h-32">
            {data.map(point => (
              <div key={point.month} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {formatCurrency(point.revenue)}
                </div>
                <div
                  className={`w-full rounded-t transition-all ${point.isCurrent ? "bg-emerald-500" : "bg-blue-500"} hover:opacity-80`}
                  style={{ height: `${Math.max((point.revenue / maxRevenue) * 100, 4)}%` }}
                />
                <span className={`text-[9px] ${point.isCurrent ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                  {point.month}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">6-month avg: {formatCurrency(avg)}</span>
          </div>
        </>
      )}
    </SectionContainer>
  );
}
