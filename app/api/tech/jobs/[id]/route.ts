import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTechUser } from "@/lib/auth/getTechUser";
import { getTechJobById, getTechCrewIds } from "@/features/tech-portal/queries";
import { getTechSettings, formatTechJob } from "@/lib/tech/formatTechJob";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const techUser = await getTechUser(supabase);
  if (!techUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getTechSettings(supabase, techUser.companyId);

  try {
    const crewIds = await getTechCrewIds(supabase, techUser.companyId, techUser.teamMemberId);
    const j = await getTechJobById(supabase, techUser.companyId, techUser.teamMemberId, crewIds, id);
    return NextResponse.json({ data: formatTechJob(j, settings) }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const techUser = await getTechUser(supabase);
  if (!techUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ownership check: job must be assigned to this tech or their crew
  const { data: job } = await supabase
    .from("jobs")
    .select("id, company_id, assigned_to, assigned_crew_id")
    .eq("id", id)
    .single();

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const crewIds = await getTechCrewIds(supabase, techUser.companyId, techUser.teamMemberId);
  const isOwner = job.company_id === techUser.companyId && (
    job.assigned_to === techUser.teamMemberId ||
    (job.assigned_crew_id && crewIds.includes(job.assigned_crew_id))
  );
  if (!isOwner) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.status) {
    const validStatuses = ["in_progress", "completed"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (body.crewFeedback !== undefined) {
    if (typeof body.crewFeedback !== "string" || body.crewFeedback.length > 2000) {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    }
    updates.crew_feedback = body.crewFeedback;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates" }, { status: 400 });
  }

  const { error } = await supabase.from("jobs").update(updates).eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
