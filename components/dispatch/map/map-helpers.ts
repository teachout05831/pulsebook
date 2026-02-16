import { DispatchJob, DispatchCrew, DispatchTechnician } from "@/types/dispatch";

export const UNASSIGNED_COLOR = "#6b7280";
export const DEFAULT_CENTER: [number, number] = [33.4484, -111.943];

export type MapGroupMode = "technician" | "crew";

export interface MapGroup {
  key: string;
  label: string;
  color: string;
  jobs: DispatchJob[];
}

// In crew mode, find which crew a technician belongs to (if any)
// crewMap has duplicate entries (keyed by both id and databaseId), so dedupe via Set
function findCrewForTech(
  tech: DispatchTechnician,
  crewMap: Map<string, DispatchCrew>,
): DispatchCrew | null {
  const seen = new Set<string>();
  for (const crew of Array.from(crewMap.values())) {
    if (seen.has(crew.databaseId)) continue;
    seen.add(crew.databaseId);
    if (crew.members.some((m) => m.id === tech.id || m.databaseId === tech.databaseId)) {
      return crew;
    }
  }
  return null;
}

export function resolveJobAssignment(
  job: DispatchJob,
  crewMap: Map<string, DispatchCrew>,
  techMap: Map<string, DispatchTechnician>,
  groupMode: MapGroupMode = "crew",
): { color: string; groupLabel: string; groupKey: string } {
  if (groupMode === "technician") {
    // Technician mode: group by tech, ignore crew assignment
    if (job.assignedTechnicianId) {
      const tech = techMap.get(job.assignedTechnicianId);
      if (tech) {
        return { color: tech.color, groupLabel: tech.name, groupKey: `tech-${tech.databaseId}` };
      }
      if (job.assignedTechnicianName) {
        return { color: UNASSIGNED_COLOR, groupLabel: job.assignedTechnicianName, groupKey: `tech-name-${job.assignedTechnicianName}` };
      }
    }
    return { color: UNASSIGNED_COLOR, groupLabel: "Unassigned", groupKey: "__unassigned__" };
  }

  // Crew mode (default): crew first, then check if tech belongs to a crew, then unassigned
  if (job.assignedCrewId) {
    const crew = crewMap.get(job.assignedCrewId);
    if (crew) {
      return { color: crew.color, groupLabel: crew.name, groupKey: `crew-${crew.databaseId}` };
    }
  }
  if (job.assignedTechnicianId) {
    // Check if this tech belongs to a crew — group under that crew
    const tech = techMap.get(job.assignedTechnicianId);
    if (tech) {
      const parentCrew = findCrewForTech(tech, crewMap);
      if (parentCrew) {
        return { color: parentCrew.color, groupLabel: parentCrew.name, groupKey: `crew-${parentCrew.databaseId}` };
      }
    }
  }
  return { color: UNASSIGNED_COLOR, groupLabel: "Unassigned", groupKey: "__unassigned__" };
}

export function buildLookupMaps(
  crews: DispatchCrew[],
  technicians: DispatchTechnician[],
) {
  const crewMap = new Map<string, DispatchCrew>();
  crews.forEach((c) => {
    crewMap.set(c.databaseId, c);
    crewMap.set(c.id, c);
  });
  const techMap = new Map<string, DispatchTechnician>();
  technicians.forEach((t) => {
    techMap.set(t.id, t);
    techMap.set(t.databaseId, t);
  });
  return { crewMap, techMap };
}

export function buildJobNumberMap(
  jobs: DispatchJob[],
  crewMap: Map<string, DispatchCrew>,
  techMap: Map<string, DispatchTechnician>,
  groupMode: MapGroupMode = "crew",
): Map<string, number> {
  const grouped = new Map<string, DispatchJob[]>();
  jobs.forEach((job) => {
    const { groupKey } = resolveJobAssignment(job, crewMap, techMap, groupMode);
    const arr = grouped.get(groupKey) || [];
    arr.push(job);
    grouped.set(groupKey, arr);
  });
  const numMap = new Map<string, number>();
  grouped.forEach((groupJobs) => {
    groupJobs.sort((a, b) =>
      (a.scheduledTime || "99:99").localeCompare(b.scheduledTime || "99:99")
    );
    groupJobs.forEach((job, idx) => numMap.set(job.id, idx + 1));
  });
  return numMap;
}

export function buildGroups(
  jobs: DispatchJob[],
  crews: DispatchCrew[],
  technicians: DispatchTechnician[],
  crewMap: Map<string, DispatchCrew>,
  techMap: Map<string, DispatchTechnician>,
  groupMode: MapGroupMode = "crew",
): MapGroup[] {
  const sortByTime = (a: DispatchJob, b: DispatchJob) =>
    (a.scheduledTime || "99:99").localeCompare(b.scheduledTime || "99:99");

  const buckets = new Map<string, DispatchJob[]>();
  jobs.forEach((job) => {
    const { groupKey } = resolveJobAssignment(job, crewMap, techMap, groupMode);
    const arr = buckets.get(groupKey) || [];
    arr.push(job);
    buckets.set(groupKey, arr);
  });

  const result: MapGroup[] = [];

  if (groupMode === "technician") {
    // Technician mode: iterate techs first, skip crews
    technicians.forEach((t) => {
      const key = `tech-${t.databaseId}`;
      const techJobs = buckets.get(key);
      if (techJobs && techJobs.length > 0) {
        techJobs.sort(sortByTime);
        result.push({ key, label: t.name, color: t.color, jobs: techJobs });
        buckets.delete(key);
      }
    });
  } else {
    // Crew mode (default): only show crew groups (techs roll up to their crew)
    crews.forEach((c) => {
      const key = `crew-${c.databaseId}`;
      const crewJobs = buckets.get(key);
      if (crewJobs && crewJobs.length > 0) {
        crewJobs.sort(sortByTime);
        result.push({ key, label: c.name, color: c.color, jobs: crewJobs });
        buckets.delete(key);
      }
    });
  }

  const remaining: DispatchJob[] = [];
  buckets.forEach((bucketJobs) => remaining.push(...bucketJobs));
  if (remaining.length > 0) {
    remaining.sort(sortByTime);
    result.push({ key: "__unassigned__", label: "Unassigned", color: UNASSIGNED_COLOR, jobs: remaining });
  }

  return result;
}
