import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { getCustomerJobDetail } from "@/features/customer-portal/queries/getCustomerJobDetail";
import { defaultCustomerPortalSettings } from "@/types/company";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const raw = company?.settings as Record<string, unknown> | null;
    const ps = raw?.customerPortal
      ? { ...defaultCustomerPortalSettings, ...(raw.customerPortal as Record<string, unknown>) }
      : defaultCustomerPortalSettings;

    const { job, photos } = await getCustomerJobDetail(
      supabase,
      id,
      customerUser.customerId,
      customerUser.companyId
    );

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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}
