"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DispatchHeader } from "./dispatch-header";
import { DispatchViewRenderer } from "./DispatchViewRenderer";
import { useDispatch } from "./dispatch-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyRosterPanel } from "@/features/crews";
import { MobileDispatchLayout } from "./views/mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Crew } from "@/features/crews";

export function DispatchContent() {
  const { isLoading, error, crews, selectedDate, refetch } = useDispatch();
  const [showRoster, setShowRoster] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const dateStr = selectedDate.toISOString().split("T")[0];

  // Map DispatchCrew → Crew shape for DailyRosterPanel
  const rosterCrews: Crew[] = useMemo(() => crews.map(c => ({
    id: c.databaseId, companyId: "", name: c.name, color: c.color,
    vehicleName: c.vehicleName, leadMemberId: c.leadMemberId,
    leadMemberName: c.leadMemberName, isActive: c.isActive,
    sortOrder: 0, members: [], createdAt: "", updatedAt: "",
  })), [crews]);

  if (isMobile) return <MobileDispatchLayout />;

  return (
    <div className="flex flex-col h-[calc(100vh-32px)]">
      <DispatchHeader />
      <div className="flex-1 overflow-hidden bg-gray-50">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-sm font-medium">Failed to load dispatch data</p>
            <p className="text-xs text-gray-400">{error.message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        ) : (
          <DispatchViewRenderer />
        )}
      </div>
      <DailyRosterPanel
        isOpen={showRoster}
        onClose={() => setShowRoster(false)}
        crews={rosterCrews}
        date={dateStr}
        onConfirm={() => refetch()}
      />
    </div>
  );
}
