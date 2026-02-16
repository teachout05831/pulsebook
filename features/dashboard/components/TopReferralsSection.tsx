"use client";

import { Link2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "./SectionContainer";
import type { ReferralSource } from "../types";

interface TopReferralsSectionProps {
  sources: ReferralSource[];
  isLoading: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function TopReferralsSection({ sources, isLoading }: TopReferralsSectionProps) {
  const maxRevenue = sources.length > 0 ? sources[0].revenue : 1;

  return (
    <SectionContainer icon={<Link2 className="h-4 w-4 text-blue-500" />} title="Top Referral Sources">
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      ) : sources.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">No referral data yet</p>
      ) : (
        <div className="space-y-3">
          {sources.map(source => (
            <div key={source.source}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-900">{source.source}</span>
                <span className="text-[10px] text-slate-500">
                  {source.leadCount} lead{source.leadCount !== 1 ? "s" : ""} / {formatCurrency(source.revenue)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.max((source.revenue / maxRevenue) * 100, 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}
