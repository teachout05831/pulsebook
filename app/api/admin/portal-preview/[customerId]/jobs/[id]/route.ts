import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getCustomerJobDetail } from "@/features/customer-portal/queries/getCustomerJobDetail";
import { defaultCustomerPortalSettings } from "@/types/company";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string; id: string }> }
) {
  try {
    const { customerId, id } = await params;
    const { supabase, companyId } = await getAuthCompany();

    // Verify ownership + fetch settings in parallel
    const [custRes, compRes] = await Promise.all([
      supabase.from("customers").select("id").eq("id", customerId).eq("company_id", companyId).single(),
      supabase.from("companies").select("settings").eq("id", companyId).single(),
    ]);

    if (!custRes.data) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const raw = compRes.data?.settings as Record<string, unknown> | null;
    const ps = raw?.customerPortal
      ? { ...defaultCustomerPortalSettings, ...(raw.customerPortal as Record<string, unknown>) }
      : defaultCustomerPortalSettings;

    const { job, photos } = await getCustomerJobDetail(supabase, id, customerId, companyId);

    const crew = (job as Record<string, unknown>).crews as { name: string } | null;
    return NextResponse.json({
      data: {
        id: job.id,
        title: job.title,
        description: job.description,
        status: job.status,
        scheduledDate: job.scheduled_date,
        scheduledTime: job.scheduled_time,
        address: job.address,
        notes: ps.showNotes ? job.notes : null,
        crewName: ps.showCrewName ? (crew?.name || null) : null,
        photos: ps.showPhotos
          ? photos.map((p) => ({
              id: p.id,
              url: p.storage_path,
              fileName: p.file_name,
              createdAt: p.created_at,
            }))
          : [],
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}
