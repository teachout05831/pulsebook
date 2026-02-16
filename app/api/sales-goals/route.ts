import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// GET /api/sales-goals?year=2026&month=2
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const params = request.nextUrl.searchParams;
    const year = parseInt(params.get("year") || "", 10);
    const month = parseInt(params.get("month") || "", 10);
    if (!year || year < 2020 || year > 2100) return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    if (!month || month < 1 || month > 12) return NextResponse.json({ error: "Invalid month" }, { status: 400 });

    const { data, error } = await supabase
      .from("sales_goals")
      .select("id, team_member_id, year, month, revenue_target, bookings_target, estimates_target, calls_target, is_active, team_members(name)")
      .eq("company_id", companyId)
      .eq("year", year)
      .eq("month", month)
      .limit(50);

    if (error) return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });

    const goals = (data || []).map((g: Record<string, unknown>) => ({
      id: g.id,
      teamMemberId: g.team_member_id,
      teamMemberName: (g.team_members as Record<string, unknown>)?.name || "Unknown",
      year: g.year,
      month: g.month,
      revenueTarget: g.revenue_target,
      bookingsTarget: g.bookings_target,
      estimatesTarget: g.estimates_target,
      callsTarget: g.calls_target,
      isActive: g.is_active,
    }));

    return NextResponse.json({ data: goals }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/sales-goals
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase, user } = await getAuthCompany();
    const body = await request.json();
    const { teamMemberId, year, month, revenueTarget } = body;

    if (!teamMemberId) return NextResponse.json({ error: "Team member is required" }, { status: 400 });
    if (!year || year < 2020 || year > 2100) return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    if (!month || month < 1 || month > 12) return NextResponse.json({ error: "Invalid month" }, { status: 400 });
    if (revenueTarget == null || revenueTarget < 0) return NextResponse.json({ error: "Revenue target must be >= 0" }, { status: 400 });

    const { data, error } = await supabase
      .from("sales_goals")
      .insert({
        company_id: companyId,
        team_member_id: teamMemberId,
        year,
        month,
        revenue_target: revenueTarget,
        bookings_target: body.bookingsTarget ?? 0,
        estimates_target: body.estimatesTarget ?? 0,
        calls_target: body.callsTarget ?? 0,
        created_by: user.id,
        is_active: true,
      })
      .select("id, team_member_id, year, month, revenue_target, bookings_target, estimates_target, calls_target, is_active")
      .single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Goal already exists for this member/month" }, { status: 409 });
      return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
    }

    return NextResponse.json({ data: { id: data.id, teamMemberId: data.team_member_id, year: data.year, month: data.month, revenueTarget: data.revenue_target, bookingsTarget: data.bookings_target, estimatesTarget: data.estimates_target, callsTarget: data.calls_target, isActive: data.is_active } }, { status: 201 });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
