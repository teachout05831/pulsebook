import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// PATCH /api/weekly-goals/:id
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = params;
    if (!id) return NextResponse.json({ error: "Goal ID is required" }, { status: 400 });

    // Ownership check
    const { data: existing } = await supabase
      .from("weekly_goals")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) return NextResponse.json({ error: "Weekly goal not found" }, { status: 404 });
    if (existing.company_id !== companyId) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.bookingsTarget != null) updates.bookings_target = body.bookingsTarget;
    if (body.estimatesTarget != null) updates.estimates_target = body.estimatesTarget;
    if (body.callsTarget != null) updates.calls_target = body.callsTarget;
    if (body.revenueTarget != null) updates.revenue_target = body.revenueTarget;
    if (body.notes !== undefined) updates.notes = body.notes || null;

    if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    const { data, error } = await supabase
      .from("weekly_goals")
      .update(updates)
      .eq("id", id)
      .select("id, team_member_id, week_start, bookings_target, estimates_target, calls_target, revenue_target, notes")
      .single();

    if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });

    return NextResponse.json({
      data: {
        id: data.id, teamMemberId: data.team_member_id, weekStart: data.week_start,
        bookingsTarget: data.bookings_target, estimatesTarget: data.estimates_target,
        callsTarget: data.calls_target, revenueTarget: data.revenue_target, notes: data.notes,
      },
    });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.statusCode });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
