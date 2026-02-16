"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "../../dispatch-provider";
import { MobileDispatchHeader } from "./MobileDispatchHeader";
import { MobileViewPills } from "./MobileViewPills";
import { MobileStatsBar } from "./MobileStatsBar";
import { MobileViewRenderer } from "./MobileViewRenderer";
import { MobileJobDetailSheet } from "./job-detail/MobileJobDetailSheet";
import { Skeleton } from "@/components/ui/skeleton";

export function MobileDispatchLayout() {
  const { isLoading, error, refetch } = useDispatch();

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <MobileDispatchHeader />
      <MobileViewPills />
      <MobileStatsBar />

      <div className="flex-1 overflow-hidden bg-gray-50">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500 px-4">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <p className="text-sm font-medium text-center">
              Failed to load dispatch data
            </p>
            <p className="text-xs text-gray-400 text-center">
              {error.message}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </Button>
          </div>
        ) : (
          <MobileViewRenderer />
        )}
      </div>

      <MobileJobDetailSheet />
    </div>
  );
}
