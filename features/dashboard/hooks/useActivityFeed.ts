"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { DashboardFeedItem } from "../types";

export function useActivityFeed() {
  const [items, setItems] = useState<DashboardFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchingRef = useRef(false);

  const fetchPage = useCallback(async (reset = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    if (reset) {
      setIsLoading(true);
      cursorRef.current = null;
    } else {
      setIsLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({ limit: "20" });
      if (cursorRef.current && !reset) params.set("cursor", cursorRef.current);

      const res = await fetch(`/api/dashboard/feed?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      const json = await res.json();
      const newItems: DashboardFeedItem[] = json.data || [];

      if (reset) setItems(newItems);
      else setItems((prev) => [...prev, ...newItems]);

      cursorRef.current = json.nextCursor;
      setHasMore(!!json.nextCursor);
    } catch {
      // Silently fail on refresh
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      fetchingRef.current = false;
    }
  }, []);

  // Initial load + auto-refresh every 60s
  useEffect(() => {
    fetchPage(true);
    intervalRef.current = setInterval(() => {
      if (document.visibilityState === "visible") fetchPage(true);
    }, 60000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchPage]);

  return {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore: () => fetchPage(false),
    refresh: () => fetchPage(true),
  };
}
