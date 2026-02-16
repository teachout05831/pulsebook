"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface GoalData {
  id: string;
  teamMemberId: string;
  teamMemberName: string;
  year: number;
  month: number;
  revenueTarget: number;
  bookingsTarget: number;
  estimatesTarget: number;
  callsTarget: number;
  isActive: boolean;
}

interface TeamMemberSummary {
  id: string;
  name: string;
  role: string;
}

interface GoalFields {
  revenueTarget: number;
  bookingsTarget: number;
  estimatesTarget: number;
  callsTarget: number;
}

export function useSalesGoalsManager(teamMembers: TeamMemberSummary[]) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchGoals = useCallback(async (y: number, m: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sales-goals?year=${y}&month=${m}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setGoals(json.data || []);
    } catch {
      toast.error("Failed to load goals");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchGoals(year, month); }, [year, month, fetchGoals]);

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    if (direction === "next") {
      if (month === 12) { setMonth(1); setYear((y) => y + 1); }
      else setMonth((m) => m + 1);
    } else {
      if (month === 1) { setMonth(12); setYear((y) => y - 1); }
      else setMonth((m) => m - 1);
    }
  }, [month]);

  const saveGoal = useCallback(async (teamMemberId: string, goalId: string | undefined, data: GoalFields) => {
    setIsSaving(true);
    try {
      const url = goalId ? `/api/sales-goals/${goalId}` : "/api/sales-goals";
      const method = goalId ? "PATCH" : "POST";
      const body = goalId ? data : { teamMemberId, year, month, ...data };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const j = await res.json(); toast.error(j.error || "Failed to save"); return { error: j.error }; }
      toast.success(goalId ? "Goal updated" : "Goal created");
      await fetchGoals(year, month);
      return { success: true };
    } catch {
      toast.error("Failed to save goal");
      return { error: "Failed to save" };
    } finally {
      setIsSaving(false);
    }
  }, [year, month, fetchGoals]);

  return { goals, year, month, isLoading, isSaving, navigateMonth, saveGoal, teamMembers };
}
