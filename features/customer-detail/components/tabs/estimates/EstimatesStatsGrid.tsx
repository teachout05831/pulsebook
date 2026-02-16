"use client";

import { Card, CardContent } from "@/components/ui/card";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

interface EstimatesStatsGridProps {
  totalCount: number;
  pendingCount: number;
  approvedValue: number;
  conversionRate: number;
}

export function EstimatesStatsGrid({ totalCount, pendingCount, approvedValue, conversionRate }: EstimatesStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Total Estimates</div>
          <div className="text-2xl font-bold">{totalCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Approved Value</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(approvedValue)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Conversion Rate</div>
          <div className="text-2xl font-bold">{conversionRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
