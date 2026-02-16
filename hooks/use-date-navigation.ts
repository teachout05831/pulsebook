"use client";

import { useState, useCallback } from "react";
import type { DispatchDateRange } from "@/types/dispatch";

export function useDateNavigation(initialDate: Date = new Date()) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const goToPrevious = useCallback((unit: "day" | "week" | "month" = "day") => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      if (unit === "day") {
        next.setDate(next.getDate() - 1);
      } else if (unit === "week") {
        next.setDate(next.getDate() - 7);
      } else {
        next.setMonth(next.getMonth() - 1);
      }
      return next;
    });
  }, []);

  const goToNext = useCallback((unit: "day" | "week" | "month" = "day") => {
    setSelectedDate(prev => {
      const next = new Date(prev);
      if (unit === "day") {
        next.setDate(next.getDate() + 1);
      } else if (unit === "week") {
        next.setDate(next.getDate() + 7);
      } else {
        next.setMonth(next.getMonth() + 1);
      }
      return next;
    });
  }, []);

  const goToDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const getDateRange = useCallback((preference: "day" | "3day" | "week", customRange?: DispatchDateRange): DispatchDateRange => {
    if (preference === "custom" as string && customRange) return customRange;

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    if (preference === "day") {
      end.setDate(end.getDate() + 1);
    } else if (preference === "3day") {
      end.setDate(end.getDate() + 3);
    } else {
      end.setDate(end.getDate() + 7);
    }
    end.setMilliseconds(end.getMilliseconds() - 1);

    return { start, end };
  }, [selectedDate]);

  return {
    selectedDate,
    setSelectedDate,
    goToToday,
    goToPrevious,
    goToNext,
    goToDate,
    getDateRange,
  };
}
