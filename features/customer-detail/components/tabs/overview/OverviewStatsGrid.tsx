"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { CustomerStats } from "../../../types";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}

interface OverviewStatsGridProps {
  stats: CustomerStats;
}

export function OverviewStatsGrid({ stats }: OverviewStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Lifetime Value</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.lifetimeValue)}
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.totalInvoices} invoices paid
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Active Jobs</div>
          <div className="text-2xl font-bold">{stats.activeJobs}</div>
          <div className="text-xs text-muted-foreground">
            {stats.completedJobs} completed
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Pending Estimates</div>
          <div className="text-2xl font-bold text-amber-600">
            {stats.pendingEstimates}
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.totalEstimates} total
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">Balance Due</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.balanceDue)}
          </div>
          <div className="text-xs text-muted-foreground">outstanding</div>
        </CardContent>
      </Card>
    </div>
  );
}
