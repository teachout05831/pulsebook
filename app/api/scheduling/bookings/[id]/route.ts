import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const FIELDS = "id, company_id, customer_name, customer_email, customer_phone, service_type_id, preferred_date, preferred_time, preferred_crew_id, assigned_crew_id, status, confirmed_date, confirmed_time, duration_minutes, score, scoring_explanation, notes, created_at";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = await params;

    const { data, error } = await supabase.from("booking_requests").select(FIELDS).eq("id", id).eq("company_id", companyId).single();
    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = await params;

    const { data: existing } = await supabase.from("booking_requests").select("company_id, status").eq("id", id).single();
    if (!existing || existing.company_id !== companyId) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.status) {
      const VALID: Record<string, string[]> = {
        pending: ["confirmed", "declined", "cancelled"],
        confirmed: ["completed", "cancelled", "no_show"],
        waitlisted: ["confirmed", "declined", "cancelled"],
      };
      const allowed = VALID[existing.status as string] || [];
      if (!allowed.includes(body.status)) return NextResponse.json({ error: `Cannot transition from ${existing.status} to ${body.status}` }, { status: 400 });
      updates.status = body.status;
      if (body.status === "confirmed") {
        updates.confirmed_date = body.confirmedDate || null;
        updates.confirmed_time = body.confirmedTime || null;
      }
    }

    if (body.assignedCrewId !== undefined) updates.assigned_crew_id = body.assignedCrewId;
    if (body.notes !== undefined) updates.notes = body.notes;

    const { data, error } = await supabase.from("booking_requests").update(updates).eq("id", id).select(FIELDS).single();
    if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
