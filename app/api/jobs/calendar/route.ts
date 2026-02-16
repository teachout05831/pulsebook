import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// Lightweight fields — only what the calendar grid needs
const CALENDAR_FIELDS = "id, title, status, scheduled_date, scheduled_time, assigned_to, address, customers(name), team_members!assigned_to(name)";

// GET /api/jobs/calendar?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// ~10x faster than /api/dispatch — skips crews, photos, geocoding, rosters, stats
export async function GET(request: NextRequest) {
  try {
    const { supabase, companyId } = await getAuthCompany();

    const startDate = request.nextUrl.searchParams.get("startDate");
    const endDate = request.nextUrl.searchParams.get("endDate");

    let query = supabase
      .from("jobs")
      .select(CALENDAR_FIELDS)
      .eq("company_id", companyId)
      .not("status", "eq", "cancelled")
      .order("scheduled_date", { ascending: true })
      .order("scheduled_time", { ascending: true, nullsFirst: false })
      .limit(500);

    if (startDate) query = query.gte("scheduled_date", startDate);
    if (endDate) query = query.lte("scheduled_date", endDate);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }

    const jobs = (data || []).map(j => {
      const customer = Array.isArray(j.customers) ? j.customers[0] : j.customers;
      const tech = Array.isArray(j.team_members) ? j.team_members[0] : j.team_members;

      return {
        id: j.id,
        title: j.title,
        status: j.status === "pending" ? "unassigned" : j.status,
        scheduledDate: j.scheduled_date,
        scheduledTime: j.scheduled_time,
        customerName: customer?.name || "Unknown",
        assignedTechnicianName: tech?.name || null,
        address: j.address || "",
      };
    });

    return NextResponse.json({ jobs }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
