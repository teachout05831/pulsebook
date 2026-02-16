import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getCustomerAppointments } from "@/features/customer-portal/queries/getCustomerAppointments";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params;
    const { supabase, companyId } = await getAuthCompany();

    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("id", customerId)
      .eq("company_id", companyId)
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const { jobs, consultations } = await getCustomerAppointments(supabase, customerId, companyId);

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

    const merged = [...jobItems, ...consultationItems].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({ data: merged }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
