"use client";

import { Card, CardContent } from "@/components/ui/card";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

interface JobsStatsGridProps {
  totalJobs: number;
  totalRevenue: number;
  avgJobValue: number;
  completionRate: number;
}

export function JobsStatsGrid({ totalJobs, totalRevenue, avgJobValue, completionRate }: JobsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Total Jobs</div>
          <div className="text-2xl font-bold">{totalJobs}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">{fmt(totalRevenue)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Avg Job Value</div>
          <div className="text-2xl font-bold">{fmt(avgJobValue)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">Completion Rate</div>
          <div className="text-2xl font-bold">{completionRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
}
