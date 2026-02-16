"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { WeeklyGoal, CreateWeeklyGoalInput } from "../types/weekly";
import { getWeekStats, type WeekActuals } from "../queries/getWeekStats";

function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function getSunday(mondayStr: string): string {
  const d = new Date(mondayStr);
  d.setDate(d.getDate() + 6);
  return d.toISOString().split("T")[0];
}

export function useWeeklyGoals(teamMemberId: string | null) {
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal | null>(null);
  const [weekActuals, setWeekActuals] = useState<WeekActuals>({ bookings: 0, estimates: 0, calls: 0, revenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const currentMonday = getMonday(new Date());
  const currentSunday = getSunday(currentMonday);
  const needsGoal = !isLoading && !weeklyGoal;

  const fetchWeeklyGoal = useCallback(async () => {
    if (!teamMemberId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const [goalRes, stats] = await Promise.all([
        fetch(`/api/weekly-goals?week_start=${currentMonday}&team_member_id=${teamMemberId}`),
        getWeekStats(teamMemberId, currentMonday),
      ]);
      if (!goalRes.ok) throw new Error("Failed to fetch");
      const json = await goalRes.json();
      setWeeklyGoal(json.data || null);
      setWeekActuals(stats);
    } catch {
      toast.error("Failed to load weekly goal");
    } finally {
      setIsLoading(false);
    }
  }, [teamMemberId, currentMonday]);

  useEffect(() => { fetchWeeklyGoal(); }, [fetchWeeklyGoal]);

  const saveWeeklyGoal = useCallback(async (input: CreateWeeklyGoalInput) => {
    if (!teamMemberId) return { error: "No team member" };
    setIsSaving(true);
    try {
      const isUpdate = weeklyGoal?.id;
      const url = isUpdate ? `/api/weekly-goals/${weeklyGoal.id}` : "/api/weekly-goals";
      const method = isUpdate ? "PATCH" : "POST";
      const body = isUpdate ? input : { teamMemberId, ...input };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { const j = await res.json(); toast.error(j.error || "Failed to save"); return { error: j.error }; }
      toast.success(isUpdate ? "Weekly goal updated" : "Weekly goal set!");
      await fetchWeeklyGoal();
      return { success: true };
    } catch {
      toast.error("Failed to save weekly goal");
      return { error: "Failed to save" };
    } finally {
      setIsSaving(false);
    }
  }, [teamMemberId, weeklyGoal, fetchWeeklyGoal]);

  return { weeklyGoal, weekActuals, isLoading, isSaving, needsGoal, currentMonday, currentSunday, saveWeeklyGoal };
}
