import type { DispatchJob, DispatchTechnician, DispatchStats } from "@/types/dispatch";

export function toDispatchJob(
  job: Record<string, unknown>,
  customerName: string,
  customerPhone: string,
  technicianName: string | null,
  crewName: string | null = null,
  photoUrls?: string[]
): DispatchJob {
  const status = job.status as string;
  return {
    id: job.id as string,
    companyId: job.company_id as string,
    customerId: job.customer_id as string,
    customerName,
    customerPhone,
    title: job.title as string,
    description: job.description as string | null,
    status: status === "scheduled" ? "scheduled"
      : status === "in_progress" ? "in_progress"
      : status === "completed" ? "completed"
      : status === "cancelled" ? "cancelled"
      : "unassigned",
    scheduledDate: job.scheduled_date as string,
    scheduledTime: job.scheduled_time as string | null,
    estimatedDuration: (job.estimated_duration as number) || 60,
    address: (job.address as string) || "",
    latitude: (job.latitude as number) || undefined,
    longitude: (job.longitude as number) || undefined,
    assignedTechnicianId: technicianName
      ? `tech-${technicianName.toLowerCase().replace(/\s+/g, "-")}`
      : null,
    assignedTechnicianName: technicianName,
    assignedCrewId: (job.assigned_crew_id as string) || null,
    assignedCrewName: crewName,
    dispatchedAt: (job.dispatched_at as string) || null,
    priority: (job.priority as DispatchJob["priority"]) || "normal",
    notes: job.notes as string | null,
    photoUrls: photoUrls || [],
    customFields: (job.custom_fields as Record<string, unknown>) || {},
  };
}

export function toDispatchTechnician(member: Record<string, unknown>, jobs: DispatchJob[]): DispatchTechnician {
  const memberName = member.name as string;
  const techId = `tech-${memberName.toLowerCase().replace(/\s+/g, "-")}`;
  const technicianJobs = jobs.filter(j => j.assignedTechnicianId === techId);
  const completedJobs = technicianJobs.filter(j => j.status === "completed");
  const currentJob = technicianJobs.find(j => j.status === "in_progress");

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
  const colorIndex = memberName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  const isActive = member.is_active as boolean;
  const status: DispatchTechnician["status"] = !isActive ? "offline" : currentJob ? "busy" : "available";

  const skillSets = [
    ["HVAC", "Plumbing"], ["Electrical", "General"], ["HVAC", "Electrical"],
    ["Plumbing", "General"], ["Emergency", "HVAC"],
  ];
  const skillIndex = memberName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % skillSets.length;

  return {
    id: techId,
    databaseId: member.id as string,
    name: memberName,
    email: member.email as string,
    phone: member.phone as string,
    color: colors[colorIndex],
    isActive,
    isAvailable: isActive && !currentJob,
    currentJobId: currentJob?.id || null,
    todayJobCount: technicianJobs.length,
    todayCompletedCount: completedJobs.length,
    role: member.role === "technician" ? "Technician" : "Lead Technician",
    skills: skillSets[skillIndex],
    status,
  };
}

export function calculateStats(jobs: DispatchJob[]): DispatchStats {
  return {
    total: jobs.length,
    unassigned: jobs.filter(j => j.status === "unassigned" || !j.assignedTechnicianId).length,
    scheduled: jobs.filter(j => j.status === "scheduled").length,
    inProgress: jobs.filter(j => j.status === "in_progress").length,
    completed: jobs.filter(j => j.status === "completed").length,
    cancelled: jobs.filter(j => j.status === "cancelled").length,
  };
}
