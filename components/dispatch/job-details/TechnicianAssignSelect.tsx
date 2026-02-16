"use client";

import { useState, useMemo } from "react";
import { DispatchJob } from "@/types/dispatch";
import { useDispatch } from "../dispatch-provider";
import { cn } from "@/lib/utils";

interface TechnicianAssignSelectProps {
  job: DispatchJob;
}

const UNASSIGNED_VALUE = "__unassigned__";

export function TechnicianAssignSelect({ job }: TechnicianAssignSelectProps) {
  const { technicians, crews, optimisticAssignJob, optimisticAssignCrew, updateJob } = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<"individual" | "crew">(job.assignedCrewId ? "crew" : "individual");

  const handleAssignTechnician = async (value: string) => {
    const isUnassigning = value === UNASSIGNED_VALUE;
    const techId = isUnassigning ? null : value;
    const tech = isUnassigning ? null : technicians.find((t) => t.id === value);
    const techName = tech?.name ?? null;
    if (techId === job.assignedTechnicianId) return;

    const prevTechId = job.assignedTechnicianId;
    const prevTechName = job.assignedTechnicianName;
    setIsLoading(true);
    optimisticAssignJob(job.id, techId, techName);
    try {
      await updateJob(job.id, { assignedTechnicianId: techId, assignedTechnicianName: techName, assignedCrewId: null, assignedCrewName: null });
    } catch {
      optimisticAssignJob(job.id, prevTechId, prevTechName);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignCrew = async (value: string) => {
    const isUnassigning = value === UNASSIGNED_VALUE;
    const crewId = isUnassigning ? null : value;
    const crew = isUnassigning ? null : crews.find((c) => c.databaseId === value);
    const crewName = crew?.name ?? null;
    if (crewId === job.assignedCrewId) return;

    const prevCrewId = job.assignedCrewId;
    const prevCrewName = job.assignedCrewName;
    setIsLoading(true);
    optimisticAssignCrew(job.id, crewId, crewName);
    try {
      await updateJob(job.id, { assignedCrewId: crewId, assignedCrewName: crewName, assignedTechnicianId: null, assignedTechnicianName: null });
    } catch {
      optimisticAssignCrew(job.id, prevCrewId, prevCrewName);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTechnicians = useMemo(() => technicians.filter((t) => t.isActive), [technicians]);
  const activeCrews = useMemo(() => crews.filter((c) => c.isActive), [crews]);
  const showCrewTab = crews.length > 0;

  return (
    <div className="space-y-2">
      {showCrewTab && (
        <div className="flex gap-1 p-0.5 bg-gray-100 rounded-md">
          <button type="button" className={cn("flex-1 text-xs py-1 rounded", tab === "individual" ? "bg-white shadow-sm font-medium" : "text-gray-500")} onClick={() => setTab("individual")}>
            Individual
          </button>
          <button type="button" className={cn("flex-1 text-xs py-1 rounded", tab === "crew" ? "bg-white shadow-sm font-medium" : "text-gray-500")} onClick={() => setTab("crew")}>
            Crew
          </button>
        </div>
      )}

      {tab === "individual" ? (
        <select
          value={job.assignedTechnicianId ?? UNASSIGNED_VALUE}
          onChange={(e) => handleAssignTechnician(e.target.value)}
          disabled={isLoading}
          className={cn("w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", isLoading && "opacity-50")}
        >
          <option value={UNASSIGNED_VALUE}>Unassigned</option>
          {activeTechnicians.map((tech) => (
            <option key={tech.id} value={tech.id}>{tech.name}</option>
          ))}
        </select>
      ) : (
        <select
          value={job.assignedCrewId ?? UNASSIGNED_VALUE}
          onChange={(e) => handleAssignCrew(e.target.value)}
          disabled={isLoading}
          className={cn("w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", isLoading && "opacity-50")}
        >
          <option value={UNASSIGNED_VALUE}>Unassigned</option>
          {activeCrews.map((crew) => (
            <option key={crew.databaseId} value={crew.databaseId}>
              {crew.name}{crew.vehicleName ? ` (${crew.vehicleName})` : ""}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
