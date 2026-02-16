"use client";

import { useEffect, useRef } from "react";

const REFRESH_INTERVAL_MS = 60_000; // 60 seconds

export function useDashboardRefresh(refresh: () => Promise<void>) {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const startInterval = () => {
      intervalId = setInterval(() => {
        if (document.visibilityState === "visible") {
          refreshRef.current();
        }
      }, REFRESH_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshRef.current();
      }
    };

    startInterval();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
