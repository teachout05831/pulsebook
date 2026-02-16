"use client";

import { useRef, useEffect } from "react";
import { Zap, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedCard } from "./FeedCard";
import { useActivityFeed } from "../hooks/useActivityFeed";

export function ActivityFeed() {
  const { items, isLoading, isLoadingMore, hasMore, loadMore } = useActivityFeed();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isLoadingMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Activity Feed
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-48" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}

            {/* Infinite scroll sentinel + loading indicator */}
            <div ref={sentinelRef} className="h-px" />
            {isLoadingMore && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
