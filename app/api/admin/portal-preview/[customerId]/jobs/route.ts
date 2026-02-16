import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getCustomerJobs } from "@/features/customer-portal/queries/getCustomerJobs";
import { defaultCustomerPortalSettings } from "@/types/company";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const { supabase, companyId } = await getAuthCompany();

    // Verify ownership + fetch settings in parallel
    const [custRes, compRes] = await Promise.all([
      supabase.from("customers").select("id").eq("id", customerId).eq("company_id", companyId).single(),
      supabase.from("companies").select("settings").eq("id", companyId).single(),
    ]);

    if (!custRes.data) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const rawSettings = compRes.data?.settings as Record<string, unknown> | null;
    const portalSettings = rawSettings?.customerPortal
      ? { ...defaultCustomerPortalSettings, ...(rawSettings.customerPortal as Record<string, unknown>) }
      : defaultCustomerPortalSettings;

    const data = await getCustomerJobs(supabase, customerId, companyId);

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
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
