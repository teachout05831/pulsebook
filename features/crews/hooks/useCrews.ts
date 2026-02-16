"use client";

import { useState, useCallback } from "react";
import type { Crew } from "../types";

export function useCrews(initialCrews: Crew[]) {
  const [crews, setCrews] = useState<Crew[]>(initialCrews);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crews");
      if (!res.ok) throw new Error("Failed to fetch crews");
      const json = await res.json();
      setCrews(json.data);
    } catch {
      setError("Failed to load crews");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCrew = useCallback(
    async (input: { name: string; color: string; vehicleName?: string; leadMemberId?: string }) => {
      const res = await fetch("/api/crews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to create" };
      if (json.data) {
        setCrews((prev) => [...prev, json.data]);
      } else {
        await refresh();
      }
      return { success: true };
    },
    [refresh]
  );

  const updateCrew = useCallback(
    async (id: string, input: Record<string, unknown>) => {
      const res = await fetch(`/api/crews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) return { error: json.error || "Failed to update" };
      setCrews((prev) => prev.map((c) => (c.id === id ? { ...c, ...json.data } : c)));
      return { success: true };
    },
    []
  );

  const deleteCrew = useCallback(
    async (id: string) => {
      const prev = crews;
      setCrews((p) => p.filter((c) => c.id !== id));
      const res = await fetch(`/api/crews/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setCrews(prev);
        return { error: "Failed to delete" };
      }
      return { success: true };
    },
    [crews]
  );

  const memberAction = useCallback(
    async (crewId: string, teamMemberId: string, method: "POST" | "DELETE") => {
      const res = await fetch(`/api/crews/${crewId}/members`, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teamMemberId }),
      });
      if (!res.ok) return { error: `Failed to ${method === "POST" ? "add" : "remove"} member` };
      await refresh();
      return { success: true };
    },
    [refresh]
  );
  const addMember = useCallback((crewId: string, teamMemberId: string) => memberAction(crewId, teamMemberId, "POST"), [memberAction]);
  const removeMember = useCallback((crewId: string, teamMemberId: string) => memberAction(crewId, teamMemberId, "DELETE"), [memberAction]);

  return { crews, isLoading, error, refresh, createCrew, updateCrew, deleteCrew, addMember, removeMember };
}
