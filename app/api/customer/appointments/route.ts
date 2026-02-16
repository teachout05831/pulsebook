import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";
import { getCustomerAppointments } from "@/features/customer-portal/queries/getCustomerAppointments";

export async function GET() {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { jobs, consultations } = await getCustomerAppointments(
      supabase,
      customerUser.customerId,
      customerUser.companyId
    );

    // snake_case → camelCase conversion + merge into unified list
    type RawJob = { id: string; title: string; scheduled_date: string; status: string };
    type RawConsultation = { id: string; title: string; scheduled_at: string; status: string; public_token: string };

    const jobItems = (jobs as RawJob[]).map((j) => ({
      id: j.id,
      type: "job" as const,
      title: j.title,
      date: j.scheduled_date,
      status: j.status,
      publicToken: null,
    }));

    const consultationItems = (consultations as RawConsultation[]).map((c) => ({
      id: c.id,
      type: "consultation" as const,
      title: c.title,
      date: c.scheduled_at,
      status: c.status,
      publicToken: c.public_token || null,
    }));

    // Merge and sort by date ascending
    const merged = [...jobItems, ...consultationItems].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({ data: merged }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
