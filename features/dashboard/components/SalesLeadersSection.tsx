"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "./SectionContainer";
import type { SalesLeader } from "../types";

interface SalesLeadersSectionProps {
  leaders: SalesLeader[];
  isLoading: boolean;
  onLeaderClick: (leader: SalesLeader) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = ["bg-amber-100 text-amber-700", "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700", "bg-pink-100 text-pink-700"];

export function SalesLeadersSection({ leaders, isLoading, onLeaderClick }: SalesLeadersSectionProps) {
  const maxRevenue = useMemo(() => leaders.length > 0 ? leaders[0].revenue : 1, [leaders]);

  return (
    <SectionContainer icon={<Star className="h-4 w-4 text-amber-500" fill="currentColor" />} title="Sales Leaders" badge="All Time">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : leaders.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">No sales data yet</p>
      ) : (
        <div className="space-y-4">
          {leaders.map((leader, i) => (
            <div
              key={leader.id}
              onClick={() => onLeaderClick(leader)}
              className="cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${i === 0 ? "text-amber-600" : "text-slate-400"}`}>{i + 1}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                    <span className="text-xs font-bold">{getInitials(leader.name)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{leader.name}</p>
                    <p className="text-xs text-slate-400">{leader.jobCount} jobs</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-700">{formatCurrency(leader.revenue)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.max((leader.revenue / maxRevenue) * 100, 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
