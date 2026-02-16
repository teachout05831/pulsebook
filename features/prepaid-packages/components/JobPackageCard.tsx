"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ticket, RefreshCw } from "lucide-react";
import { useJobPackage } from "../hooks/useJobPackage";

interface Props {
  customerId: string;
}

export function JobPackageCard({ customerId }: Props) {
  const { activePackage, isLoading } = useJobPackage(customerId);

  if (isLoading || !activePackage) return null;

  const pct = (activePackage.visitsUsed / activePackage.visitsTotal) * 100;
  const remaining = activePackage.visitsTotal - activePackage.visitsUsed;

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Ticket className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[13px] font-semibold">Prepaid Package</span>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 text-[11px]">Active</Badge>
        </div>
        <div className="text-sm font-medium">{activePackage.packageName}</div>
        <div className="text-xs text-muted-foreground">
          {activePackage.visitsUsed} of {activePackage.visitsTotal} visits used &middot; {remaining} remaining
        </div>
        <Progress value={pct} className="h-2" />
        {activePackage.autoRenew && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <RefreshCw className="h-3 w-3" />Auto-renew
          </div>
        )}
      </CardContent>
    </Card>
  );
}
