import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import type { DispatchCrew, DispatchStatus } from "@/types/dispatch";
import { toDispatchJob, toDispatchTechnician, calculateStats } from "@/lib/dispatch/converters";
import { updateDispatchJob } from "@/features/crews/actions/updateDispatchJob";

const JOB_FIELDS = "id, company_id, customer_id, title, description, status, scheduled_date, scheduled_time, estimated_duration, address, latitude, longitude, assigned_to, assigned_crew_id, dispatched_at, priority, notes, custom_fields, created_at, updated_at";
const TEAM_MEMBER_FIELDS = "id, name, email, phone, role, is_active";
const CREW_FIELDS = "id, company_id, name, color, vehicle_name, lead_member_id, is_active, sort_order";

export async function GET(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const technicianIds = searchParams.get("technicianIds")?.split(",").filter(Boolean) || [];
    const crewIds = searchParams.get("crewIds")?.split(",").filter(Boolean) || [];
    const statuses = searchParams.get("statuses")?.split(",").filter(Boolean) || [];
    const searchQuery = searchParams.get("q")?.toLowerCase();

    // Fetch jobs with customer name, assigned technician, and assigned crew
    let jobsQuery = supabase
      .from("jobs")
      .select(`${JOB_FIELDS}, customers(name, phone), team_members:assigned_to(name), crews:assigned_crew_id(name)`)
      .eq("company_id", companyId);

    if (startDate) jobsQuery = jobsQuery.gte("scheduled_date", startDate);
    if (endDate) jobsQuery = jobsQuery.lte("scheduled_date", endDate);

    // Technician filter: IDs are display format (tech-xxx), filter in JS after conversion
    // Crew filter: IDs are database UUIDs, safe for Supabase query
    if (crewIds.length > 0) {
      jobsQuery = jobsQuery.in("assigned_crew_id", crewIds);
    }

    // Status filter in Supabase query
    if (statuses.length > 0) {
      jobsQuery = jobsQuery.in("status", statuses);
    }

    jobsQuery = jobsQuery.order("scheduled_date", { ascending: true }).limit(200);
    const dateStr = startDate || new Date().toISOString().split("T")[0];

    // Phase 1: Run all independent queries in parallel
    const [jobsResult, membersResult, crewsResult, logResult] = await Promise.all([
      jobsQuery,
      supabase.from("team_members").select(TEAM_MEMBER_FIELDS).eq("company_id", companyId).limit(100),
      supabase.from("crews").select(CREW_FIELDS).eq("company_id", companyId).eq("is_active", true).order("sort_order").limit(50),
      supabase.from("dispatch_logs").select("dispatched_at, dispatched_by").eq("company_id", companyId).eq("dispatch_date", dateStr).limit(1).maybeSingle(),
    ]);

    if (jobsResult.error) return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    if (membersResult.error) return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });

    const jobsData = jobsResult.data || [];
    const crewsData = crewsResult.data || [];
    const jobIds = jobsData.map(j => j.id as string);
    const crewDbIds = crewsData.map(c => c.id);
    // Phase 2: Dependent queries in parallel (coords now read from jobs table)
    const [photosResult, rosterResult] = await Promise.all([
      jobIds.length > 0
        ? supabase.from("file_uploads").select("job_id, storage_path").in("job_id", jobIds).eq("category", "photo").limit(500)
        : Promise.resolve({ data: [] as { job_id: string; storage_path: string }[] }),
      crewDbIds.length > 0
        ? supabase.from("daily_rosters").select("crew_id, team_member_id, is_present").eq("company_id", companyId).eq("roster_date", dateStr).in("crew_id", crewDbIds).limit(200)
        : Promise.resolve({ data: [] as { crew_id: string; team_member_id: string; is_present: boolean }[] }),
    ]);

    // Build photos map
    const photosMap = new Map<string, string[]>();
    for (const row of photosResult.data || []) {
      const list = photosMap.get(row.job_id) || [];
      list.push(row.storage_path);
      photosMap.set(row.job_id, list);
    }

    // Phase 3: Crew members (roster → fallback to permanent members for today/future only)
    const crewMembersMap = new Map<string, string[]>();
    if (crewDbIds.length > 0) {
      const crewsWithRoster = new Set<string>();
      const rosterData = rosterResult.data || [];
      for (const r of rosterData) {
        crewsWithRoster.add(r.crew_id);
        if (r.is_present) {
          const list = crewMembersMap.get(r.crew_id) || [];
          list.push(r.team_member_id);
          crewMembersMap.set(r.crew_id, list);
        }
      }
      // Only auto-populate from permanent members for today and future dates.
      // Past dates with no roster should stay empty — we don't know who actually worked.
      const today = new Date().toISOString().split("T")[0];
      if (dateStr >= today) {
        const crewsNeedingDefaults = crewDbIds.filter(id => !crewsWithRoster.has(id));
        if (crewsNeedingDefaults.length > 0) {
          const { data: cmData } = await supabase
            .from("crew_members").select("crew_id, team_member_id").in("crew_id", crewsNeedingDefaults).limit(200);
          for (const cm of cmData || []) {
            const list = crewMembersMap.get(cm.crew_id) || [];
            list.push(cm.team_member_id);
            crewMembersMap.set(cm.crew_id, list);
          }
        }
      }
    }

    // Convert to dispatch jobs (coords read from DB columns)
    let dispatchJobs = jobsData.map(j => {
      const customer = Array.isArray(j.customers) ? j.customers[0] : j.customers;
      const teamMember = Array.isArray(j.team_members) ? j.team_members[0] : j.team_members;
      const crew = Array.isArray(j.crews) ? j.crews[0] : j.crews;
      return toDispatchJob(j, customer?.name || "Unknown Customer", customer?.phone || "", teamMember?.name || null, crew?.name || null, photosMap.get(j.id as string) || []);
    });

    // Technician filter (display IDs like "tech-xxx" match assignedTechnicianId)
    if (technicianIds.length > 0) {
      dispatchJobs = dispatchJobs.filter(j => j.assignedTechnicianId && technicianIds.includes(j.assignedTechnicianId));
    }

    if (searchQuery) {
      dispatchJobs = dispatchJobs.filter(j => {
        if (j.title.toLowerCase().includes(searchQuery)) return true;
        if (j.customerName.toLowerCase().includes(searchQuery)) return true;
        if (j.address.toLowerCase().includes(searchQuery)) return true;
        if (j.assignedTechnicianName?.toLowerCase().includes(searchQuery)) return true;
        if (j.assignedCrewName?.toLowerCase().includes(searchQuery)) return true;
        if (j.notes?.toLowerCase().includes(searchQuery)) return true;
        if (j.priority.toLowerCase().includes(searchQuery)) return true;
        // Search custom field values
        if (j.customFields) {
          for (const val of Object.values(j.customFields)) {
            if (val && String(val).toLowerCase().includes(searchQuery)) return true;
          }
        }
        return false;
      });
    }
    dispatchJobs.sort((a, b) => {
      const d = a.scheduledDate.localeCompare(b.scheduledDate);
      return d !== 0 ? d : (a.scheduledTime || "00:00").localeCompare(b.scheduledTime || "00:00");
    });

    const technicians = (membersResult.data || []).map(m => toDispatchTechnician(m, dispatchJobs));
    const stats = calculateStats(dispatchJobs);

    const dispatchCrews: DispatchCrew[] = crewsData.map(c => {
      const memberDbIds = crewMembersMap.get(c.id) || [];
      const crewTechs = technicians.filter(t => memberDbIds.includes(t.databaseId));
      const crewJobs = dispatchJobs.filter(j => j.assignedCrewId === c.id);
      const leadTech = c.lead_member_id ? technicians.find(t => t.databaseId === c.lead_member_id) : null;
      return {
        id: `crew-${c.name.toLowerCase().replace(/\s+/g, "-")}`, databaseId: c.id, name: c.name, color: c.color,
        vehicleName: c.vehicle_name, leadMemberId: c.lead_member_id, leadMemberName: leadTech?.name || null,
        members: crewTechs, todayJobCount: crewJobs.length,
        todayCompletedCount: crewJobs.filter(j => j.status === "completed").length, isActive: c.is_active,
      };
    });

    const dispatchLog = logResult.data;
    const hasChanges = dispatchLog?.dispatched_at
      ? dispatchJobs.some(j => j.dispatchedAt && new Date(j.dispatchedAt) > new Date(dispatchLog.dispatched_at))
      : false;
    const dispatchStatus: DispatchStatus = {
      isDispatched: !!dispatchLog, dispatchedAt: dispatchLog?.dispatched_at || null,
      dispatchedBy: dispatchLog?.dispatched_by || null, hasChangesAfterDispatch: hasChanges,
    };

    return NextResponse.json({ jobs: dispatchJobs, technicians, crews: dispatchCrews, stats, dispatchStatus }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH - Update job status or assignment (for drag-drop)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, updates } = body;

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json({ error: "Valid job ID is required" }, { status: 400 });
    }
    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Updates object is required" }, { status: 400 });
    }

    const VALID_STATUSES = ["pending", "scheduled", "in_progress", "completed", "cancelled", "unassigned"];
    if (updates.status && !VALID_STATUSES.includes(updates.status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const VALID_PRIORITIES = ["low", "normal", "high", "urgent"];
    if (updates.priority && !VALID_PRIORITIES.includes(updates.priority)) {
      return NextResponse.json({ error: "Invalid priority value" }, { status: 400 });
    }

    // Convert camelCase -> snake_case for action
    const result = await updateDispatchJob(jobId, {
      status: updates.status,
      assigned_to: updates.assignedTo,
      assigned_crew_id: updates.assignedCrewId,
      scheduled_date: updates.scheduledDate,
      scheduled_time: updates.scheduledTime,
      estimated_duration: updates.estimatedDuration,
      notes: updates.notes,
      priority: updates.priority,
    });

    if (result.error) {
      const status = result.error === "Not authenticated" ? 401
        : result.error === "Not authorized" ? 403
        : result.error === "Job not found" ? 404
        : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    const data = result.data!;
    const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers;
    const teamMember = Array.isArray(data.team_members) ? data.team_members[0] : data.team_members;
    const crew = Array.isArray(data.crews) ? data.crews[0] : data.crews;

    return NextResponse.json({
      data: toDispatchJob(data as Record<string, unknown>, customer?.name || "Unknown Customer", customer?.phone || "", teamMember?.name || null, crew?.name || null),
    });
  } catch (error) {
    console.error("[API /dispatch PATCH]", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
