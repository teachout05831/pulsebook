"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ContractsStats } from "../types";

interface ContractsStatsRowProps {
  stats: ContractsStats;
  isLoading: boolean;
}

export function ContractsStatsRow({ stats, isLoading }: ContractsStatsRowProps) {
  const items = [
    { label: "Total Contracts", value: stats.total, color: "text-gray-900" },
    { label: "Signed", value: stats.signed, color: "text-green-600" },
    { label: "Sent / Pending", value: stats.sentPending, color: "text-blue-600" },
    { label: "Completed", value: stats.completed, color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4 text-center">
            {isLoading ? (
              <div className="h-8 w-12 mx-auto bg-gray-100 rounded animate-pulse" />
            ) : (
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
