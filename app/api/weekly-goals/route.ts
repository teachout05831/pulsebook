import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// GET /api/weekly-goals?week_start=2026-02-09&team_member_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const params = request.nextUrl.searchParams;
    const weekStart = params.get("week_start");
    const teamMemberId = params.get("team_member_id");
    if (!weekStart) return NextResponse.json({ error: "week_start is required" }, { status: 400 });
    if (!teamMemberId) return NextResponse.json({ error: "team_member_id is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("weekly_goals")
      .select("id, team_member_id, week_start, bookings_target, estimates_target, calls_target, revenue_target, notes")
      .eq("company_id", companyId)
      .eq("team_member_id", teamMemberId)
      .eq("week_start", weekStart)
      .limit(1)
      .maybeSingle();

    if (error) return NextResponse.json({ error: "Failed to fetch weekly goal" }, { status: 500 });
    if (!data) return NextResponse.json({ data: null });

    return NextResponse.json({
      data: {
        id: data.id, teamMemberId: data.team_member_id, weekStart: data.week_start,
        bookingsTarget: data.bookings_target, estimatesTarget: data.estimates_target,
        callsTarget: data.calls_target, revenueTarget: data.revenue_target, notes: data.notes,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/weekly-goals
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const body = await request.json();
    const { teamMemberId, weekStart } = body;

    if (!teamMemberId) return NextResponse.json({ error: "team_member_id is required" }, { status: 400 });
    if (!weekStart) return NextResponse.json({ error: "week_start is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("weekly_goals")
      .insert({
        company_id: companyId, team_member_id: teamMemberId, week_start: weekStart,
        bookings_target: body.bookingsTarget ?? 0, estimates_target: body.estimatesTarget ?? 0,
        calls_target: body.callsTarget ?? 0, revenue_target: body.revenueTarget ?? 0,
        notes: body.notes || null,
      })
      .select("id, team_member_id, week_start, bookings_target, estimates_target, calls_target, revenue_target, notes")
      .single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Weekly goal already exists" }, { status: 409 });
      return NextResponse.json({ error: "Failed to create weekly goal" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id, teamMemberId: data.team_member_id, weekStart: data.week_start,
        bookingsTarget: data.bookings_target, estimatesTarget: data.estimates_target,
        callsTarget: data.calls_target, revenueTarget: data.revenue_target, notes: data.notes,
      },
    }, { status: 201 });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
