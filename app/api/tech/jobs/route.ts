import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTechUser } from "@/lib/auth/getTechUser";
import { getTechJobs, getTechCrewIds } from "@/features/tech-portal/queries";
import { getTechSettings, formatTechJob } from "@/lib/tech/formatTechJob";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const techUser = await getTechUser(supabase);
  if (!techUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start") || new Date().toISOString().split("T")[0];
  const end = searchParams.get("end") || start;

  const settings = await getTechSettings(supabase, techUser.companyId);

  try {
    const crewIds = await getTechCrewIds(supabase, techUser.companyId, techUser.teamMemberId);
    const data = await getTechJobs(supabase, techUser.companyId, techUser.teamMemberId, crewIds, {
      start,
      end,
    });

    const jobs = (data || []).map((j) => formatTechJob(j, settings));
    return NextResponse.json({ data: jobs }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
