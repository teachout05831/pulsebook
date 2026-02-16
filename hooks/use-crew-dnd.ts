"use client";

import { useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { useDispatch } from "@/components/dispatch/dispatch-provider";

export function useCrewDnd() {
  const {
    jobs,
    crews,
    selectedDate,
    updateJob,
    optimisticAssignCrew,
    optimisticRescheduleJob,
  } = useDispatch();

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const jobId = active.id as string;
      const dropId = over.id as string;
      const job = jobs.find((j) => j.id === jobId);
      if (!job) return;

      // Drop on unassigned area
      if (dropId === "unassigned") {
        if (!job.assignedCrewId && !job.assignedTechnicianId) return;
        optimisticAssignCrew(jobId, null, null);
        try {
          await updateJob(jobId, {
            assignedCrewId: null,
            assignedTo: null,
            status: "unassigned",
          } as Record<string, unknown>);
        } catch (error) {
          console.error("Failed to unassign job:", error);
        }
        return;
      }

      // Parse: "crew-{uuid}-time-{hour}-{minute}"
      const match = dropId.match(/^crew-(.+)-time-(\d+)-(\d+)$/);
      if (!match) return;

      const crewDbId = match[1];
      const hour = parseInt(match[2]);
      const minute = parseInt(match[3]);
      if (isNaN(hour) || isNaN(minute)) return;

      const newTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const crew = crews.find((c) => c.databaseId === crewDbId);
      if (!crew) return;

      // Skip if no change
      if (job.assignedCrewId === crewDbId && job.scheduledTime === newTime) return;

      // Optimistic updates
      const dateStr = selectedDate.toISOString().split("T")[0];
      optimisticRescheduleJob(jobId, dateStr, newTime);
      if (job.assignedCrewId !== crewDbId) {
        optimisticAssignCrew(jobId, crewDbId, crew.name);
      }

      try {
        await updateJob(jobId, {
          assignedCrewId: crewDbId,
          assignedTo: null,
          scheduledDate: dateStr,
          scheduledTime: newTime,
          status: "scheduled",
        } as Record<string, unknown>);
      } catch (error) {
        console.error("Failed to update job:", error);
      }
    },
    [jobs, crews, selectedDate, updateJob, optimisticAssignCrew, optimisticRescheduleJob]
  );

  return { handleDragEnd };
}
