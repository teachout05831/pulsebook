import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTechUser } from "@/lib/auth/getTechUser";
import { getTechCrewIds, getTechJobContracts } from "@/features/tech-portal/queries";
import { getTechSettings } from "@/lib/tech/formatTechJob";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: jobId } = await params;
  const supabase = await createClient();

  const techUser = await getTechUser(supabase);
  if (!techUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getTechSettings(supabase, techUser.companyId);
  if (!settings.showContracts) {
    return NextResponse.json({ data: [] });
  }

  // Verify job ownership (direct or crew)
  const { data: job } = await supabase
    .from("jobs")
    .select("id, company_id, assigned_to, assigned_crew_id")
    .eq("id", jobId)
    .eq("company_id", techUser.companyId)
    .not("dispatched_at", "is", null)
    .single();

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const crewIds = await getTechCrewIds(supabase, techUser.companyId, techUser.teamMemberId);
  const isOwner = job.assigned_to === techUser.teamMemberId ||
    (job.assigned_crew_id && crewIds.includes(job.assigned_crew_id));
  if (!isOwner) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  try {
    const data = await getTechJobContracts(supabase, techUser.companyId, jobId);

    const contracts = data.map((row: any) => ({
      id: row.id,
      templateName: row.template_snapshot?.name || "Contract",
      status: row.status,
      signingToken: row.signing_token,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ data: contracts }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
  }
}
