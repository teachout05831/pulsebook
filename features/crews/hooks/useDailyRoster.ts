"use client";

import { useState, useCallback } from "react";
import type { DailyRosterEntry } from "../types";

export function useDailyRoster(date: string) {
  const [entries, setEntries] = useState<DailyRosterEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoster = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/crews/roster?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch roster");
      const json = await res.json();
      setEntries(json.data);
    } catch {
      setError("Failed to load roster");
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  const saveRoster = useCallback(
    async (rosterEntries: DailyRosterEntry[]) => {
      const res = await fetch("/api/crews/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, entries: rosterEntries }),
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to save" };
      await fetchRoster();
      return { success: true };
    },
    [date, fetchRoster]
  );

  const togglePresence = useCallback(
    (teamMemberId: string) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.teamMemberId === teamMemberId ? { ...e, isPresent: !e.isPresent } : e
        )
      );
    },
    []
  );

  const addFillIn = useCallback(
    (crewId: string, teamMemberId: string, memberName: string) => {
      setEntries((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          crewId,
          rosterDate: date,
          teamMemberId,
          memberName,
          isPresent: true,
          isFillIn: true,
        },
      ]);
    },
    [date]
  );

  return { entries, isLoading, error, fetchRoster, saveRoster, togglePresence, addFillIn };
}
