"use client";

import { useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { useDispatch } from "@/components/dispatch/dispatch-provider";

export function useTimelineDnd() {
  const {
    jobs,
    technicians,
    selectedDate,
    updateJob,
    optimisticRescheduleJob,
    optimisticAssignJob,
  } = useDispatch();

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const jobId = active.id as string;
      const dropId = over.id as string;

      // Parse drop target: "{techId}-time-{hour}-{minute}" or "unassigned-time-{hour}-{minute}"
      const isUnassigned = dropId.startsWith("unassigned-time-");

      // Extract time from end of ID: "-time-{hour}-{minute}"
      const timeMatch = dropId.match(/-time-(\d+)-(\d+)$/);
      if (!timeMatch) return;

      const hour = parseInt(timeMatch[1]);
      const minute = parseInt(timeMatch[2]);
      if (isNaN(hour) || hour < 0 || hour > 23) return;
      if (isNaN(minute) || minute < 0 || minute > 59) return;

      const newTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

      // Get technician display ID (null for unassigned)
      // Format: "tech-{name}-time-{hour}-{minute}" -> extract "tech-{name}"
      let techDisplayId: string | null = null;
      if (!isUnassigned) {
        const techMatch = dropId.match(/^(tech-.+)-time-\d+-\d+$/);
        if (techMatch) {
          techDisplayId = techMatch[1];
        }
      }

      // Find the technician to get their database ID
      const technician = techDisplayId
        ? technicians.find((t) => t.id === techDisplayId)
        : null;

      const job = jobs.find((j) => j.id === jobId);
      if (!job) return;

      // Skip if no change
      if (job.scheduledTime === newTime && job.assignedTechnicianId === techDisplayId) {
        return;
      }

      // Optimistic updates for instant feedback
      const dateStr = selectedDate.toISOString().split("T")[0];
      optimisticRescheduleJob(jobId, dateStr, newTime);

      if (techDisplayId !== job.assignedTechnicianId) {
        optimisticAssignJob(jobId, techDisplayId, technician?.name ?? null);
      }

      // Persist to database using the actual database UUID
      // Note: API expects assignedTo (for database), not assignedTechnicianId (frontend type)
      try {
        await updateJob(jobId, {
          scheduledDate: dateStr,
          scheduledTime: newTime,
          assignedTo: technician?.databaseId ?? null,
          status: technician ? "scheduled" : "unassigned",
        } as Record<string, unknown>);
      } catch (error) {
        console.error("Failed to update job:", error);
        // Data will refetch and revert on error
      }
    },
    [jobs, technicians, selectedDate, updateJob, optimisticRescheduleJob, optimisticAssignJob]
  );

  return { handleDragEnd };
}
