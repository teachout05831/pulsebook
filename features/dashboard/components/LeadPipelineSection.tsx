"use client";

import { BarChart3, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "./SectionContainer";
import type { PipelineStage } from "../types";

interface LeadPipelineSectionProps {
  stages: PipelineStage[];
  isLoading: boolean;
}

const STAGE_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
};

const STAGE_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-400" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-700", bar: "bg-cyan-400" },
  amber: { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-400" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", bar: "bg-purple-400" },
  green: { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" },
};

export function LeadPipelineSection({ stages, isLoading }: LeadPipelineSectionProps) {
  const total = stages.reduce((sum, s) => sum + s.count, 0);

  return (
    <SectionContainer icon={<BarChart3 className="h-4 w-4 text-indigo-500" />} title="Lead Pipeline">
      {isLoading ? (
        <div className="space-y-3">
          <div className="flex justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ) : (
        <>
          {/* Stage circles */}
          <div className="flex items-center justify-between">
            {stages.map((stage, i) => {
              const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue;
              return (
                <div key={stage.stage} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${colors.text}`}>{stage.count}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 font-medium">{STAGE_LABELS[stage.stage] || stage.stage}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-slate-300 mx-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <>
              <div className="flex h-2 rounded-full overflow-hidden mt-3 bg-slate-100">
                {stages.filter(s => s.count > 0).map(stage => {
                  const colors = STAGE_COLORS[stage.color] || STAGE_COLORS.blue;
                  return (
                    <div
                      key={stage.stage}
                      className={`${colors.bar} transition-all`}
                      style={{ width: `${(stage.count / total) * 100}%` }}
                    />
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">{total} total leads in pipeline</p>
            </>
          )}
        </>
      )}
    </SectionContainer>
  );
}
