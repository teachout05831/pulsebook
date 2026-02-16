import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { getCustomerJobs } from "@/features/customer-portal/queries/getCustomerJobs";
import { defaultCustomerPortalSettings } from "@/types/company";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch company settings for privacy controls
    const { data: company } = await supabase
      .from("companies")
      .select("settings")
      .eq("id", customerUser.companyId)
      .single();

    const rawSettings = company?.settings as Record<string, unknown> | null;
    const portalSettings = rawSettings?.customerPortal
      ? { ...defaultCustomerPortalSettings, ...(rawSettings.customerPortal as Record<string, unknown>) }
      : defaultCustomerPortalSettings;

    const data = await getCustomerJobs(
      supabase,
      customerUser.customerId,
      customerUser.companyId
    );

    const jobs = (data || []).map((j: Record<string, unknown>) => {
      const crew = j.crews as { name: string } | null;
      return {
        id: j.id,
        title: j.title,
        status: j.status,
        scheduledDate: j.scheduled_date || null,
        crewName: portalSettings.showCrewName ? (crew?.name || null) : null,
      };
    });

    return NextResponse.json({ data: jobs }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
