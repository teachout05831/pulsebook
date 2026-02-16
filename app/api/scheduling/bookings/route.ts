import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const FIELDS = "id, company_id, scheduling_page_id, customer_id, job_id, customer_name, customer_email, customer_phone, service_type_id, preferred_date, preferred_time, date_flexibility, preferred_crew_id, assigned_crew_id, assigned_team_member_id, status, confirmed_date, confirmed_time, duration_minutes, score, scoring_explanation, notes, created_at";

function toClient(r: Record<string, unknown>) {
  return {
    id: r.id, companyId: r.company_id, schedulingPageId: r.scheduling_page_id,
    customerId: r.customer_id, jobId: r.job_id, customerName: r.customer_name,
    customerEmail: r.customer_email, customerPhone: r.customer_phone,
    serviceTypeId: r.service_type_id, preferredDate: r.preferred_date,
    preferredTime: r.preferred_time, dateFlexibility: r.date_flexibility,
    preferredCrewId: r.preferred_crew_id, assignedCrewId: r.assigned_crew_id,
    assignedTeamMemberId: r.assigned_team_member_id, status: r.status,
    confirmedDate: r.confirmed_date, confirmedTime: r.confirmed_time,
    durationMinutes: r.duration_minutes, score: r.score,
    scoringExplanation: r.scoring_explanation, notes: r.notes, createdAt: r.created_at,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 20;
    const from = (page - 1) * limit;

    let query = supabase.from("booking_requests").select(FIELDS, { count: "exact" }).eq("company_id", companyId);
    if (status && status !== "all") query = query.eq("status", status);

    const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, from + limit - 1);
    if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

    return NextResponse.json({ data: (data || []).map(b => toClient(b as Record<string, unknown>)), total: count || 0, page, limit }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
