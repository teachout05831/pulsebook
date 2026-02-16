"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { EstimateTask } from "@/types/estimate";

export function useEstimateTasks(estimateId: string, initial: EstimateTask[]) {
  const [tasks, setTasks] = useState<EstimateTask[]>(initial);
  const togglingRef = useRef<Set<string>>(new Set());

  const addTask = useCallback(
    async (title: string) => {
      const res = await fetch(`/api/estimates/${estimateId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sortOrder: tasks.length }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || "Failed to add"); return; }
      setTasks((prev) => [...prev, json.data]);
    },
    [estimateId, tasks.length]
  );

  const toggleTask = useCallback(
    async (taskId: string) => {
      if (togglingRef.current.has(taskId)) return;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      togglingRef.current.add(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
      const res = await fetch(`/api/estimates/${estimateId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: task.completed } : t)));
      togglingRef.current.delete(taskId);
    },
    [estimateId, tasks]
  );

  const removeTask = useCallback(
    async (taskId: string) => {
      const prev = tasks;
      setTasks((p) => p.filter((t) => t.id !== taskId));
      const res = await fetch(`/api/estimates/${estimateId}/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) { setTasks(prev); toast.error("Failed to delete"); }
    },
    [estimateId, tasks]
  );

  return { tasks, addTask, toggleTask, removeTask };
}
