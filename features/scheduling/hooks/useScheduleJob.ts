"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ScheduleInput {
  scheduledDate: string;
  scheduledTime: string;
  assignedTo: string | null;
  assignedCrewId: string | null;
}

export function useScheduleJob() {
  const [isScheduling, setIsScheduling] = useState(false);

  const scheduleJob = useCallback(async (jobId: string, input: ScheduleInput) => {
    setIsScheduling(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to schedule");
      toast.success("Job scheduled");
      return { success: true, data: json.data };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to schedule";
      toast.error(msg);
      return { error: msg };
    } finally {
      setIsScheduling(false);
    }
  }, []);

  return { isScheduling, scheduleJob };
}
