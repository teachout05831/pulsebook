import type { DispatchJob } from "@/types/dispatch";

interface JobsState {
  jobs: DispatchJob[];
}

export function applyStatusUpdate<T extends JobsState>(prev: T, jobId: string, status: DispatchJob["status"]): T {
  return { ...prev, jobs: prev.jobs.map(job => job.id === jobId ? { ...job, status } : job) };
}

export function applyAssignJob<T extends JobsState>(
  prev: T, jobId: string, technicianId: string | null, technicianName: string | null,
): T {
  return {
    ...prev,
    jobs: prev.jobs.map(job =>
      job.id === jobId
        ? { ...job, assignedTechnicianId: technicianId, assignedTechnicianName: technicianName, status: technicianId ? ("scheduled" as const) : ("unassigned" as const) }
        : job
    ),
  };
}

export function applyAssignCrew<T extends JobsState>(
  prev: T, jobId: string, crewId: string | null, crewName: string | null,
): T {
  return {
    ...prev,
    jobs: prev.jobs.map(job =>
      job.id === jobId
        ? { ...job, assignedCrewId: crewId, assignedCrewName: crewName, status: crewId ? ("scheduled" as const) : ("unassigned" as const) }
        : job
    ),
  };
}

export function applyRescheduleJob<T extends JobsState>(
  prev: T, jobId: string, date: string, time: string | null,
): T {
  return { ...prev, jobs: prev.jobs.map(job => job.id === jobId ? { ...job, scheduledDate: date, scheduledTime: time } : job) };
}
