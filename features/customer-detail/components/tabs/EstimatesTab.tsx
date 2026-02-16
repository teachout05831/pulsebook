"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Estimate, EstimateStatus } from "@/types/estimate";
import { CreateEstimateModal } from "@/features/estimates";
import { EstimatesStatsGrid, EstimatesTable } from "./estimates";

interface EstimatesTabProps {
  estimates: Estimate[];
  customerId: string;
  customerName?: string;
  onRefresh?: () => void;
  backTo?: string;
}

type FilterStatus = "all" | EstimateStatus;

export function EstimatesTab({ estimates, customerId, customerName, onRefresh, backTo }: EstimatesTabProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const pendingEstimates = estimates.filter((e) => e.status === "sent" || e.status === "draft");
  const approvedEstimates = estimates.filter((e) => e.status === "approved");
  const declinedEstimates = estimates.filter((e) => e.status === "declined");

  const filteredEstimates = filter === "all" ? estimates : estimates.filter((e) => e.status === filter);

  const approvedValue = approvedEstimates.reduce((sum, e) => sum + e.total, 0);
  const conversionRate = estimates.length > 0
    ? Math.round((approvedEstimates.length / estimates.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Estimates</h2>
          <p className="text-sm text-muted-foreground">{estimates.length} total estimates</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setCreateModalOpen(true)}>+ Create Estimate</Button>
      </div>

      <EstimatesStatsGrid
        totalCount={estimates.length}
        pendingCount={pendingEstimates.length}
        approvedValue={approvedValue}
        conversionRate={conversionRate}
      />

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {([
          { key: "all" as const, label: "All", count: estimates.length },
          { key: "sent" as const, label: "Pending", count: pendingEstimates.length },
          { key: "approved" as const, label: "Approved", count: approvedEstimates.length },
          { key: "declined" as const, label: "Declined", count: declinedEstimates.length },
        ]).map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            size="sm"
            className="shrink-0"
            onClick={() => setFilter(f.key)}
          >
            {f.label} ({f.count})
          </Button>
        ))}
      </div>

      <EstimatesTable estimates={filteredEstimates} backTo={backTo} />

      <CreateEstimateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        customerId={customerId}
        customerName={customerName}
        onSuccess={onRefresh}
      />
    </div>
  );
}
