import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const CONFIG_FIELDS = "id, company_id, priority_mode, priority_weights, team_mode, crews_per_day, max_jobs_per_crew, buffer_minutes, default_duration_min, booking_window_days, min_notice_hours, time_slot_mode, auto_confirm, waitlist_enabled, crew_override_enabled, zone_enforcement, payment_required, payment_type, deposit_amount, cancellation_hours, business_hours, created_at, updated_at";

function toClient(r: Record<string, unknown>) {
  return {
    id: r.id, companyId: r.company_id, priorityMode: r.priority_mode,
    priorityWeights: r.priority_weights, teamMode: r.team_mode,
    crewsPerDay: r.crews_per_day, maxJobsPerCrew: r.max_jobs_per_crew,
    bufferMinutes: r.buffer_minutes, defaultDurationMin: r.default_duration_min,
    bookingWindowDays: r.booking_window_days, minNoticeHours: r.min_notice_hours,
    timeSlotMode: r.time_slot_mode, autoConfirm: r.auto_confirm,
    waitlistEnabled: r.waitlist_enabled, crewOverrideEnabled: r.crew_override_enabled,
    zoneEnforcement: r.zone_enforcement, paymentRequired: r.payment_required,
    paymentType: r.payment_type, depositAmount: r.deposit_amount,
    cancellationHours: r.cancellation_hours, businessHours: r.business_hours,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    let { data, error } = await supabase.from("scheduling_config").select(CONFIG_FIELDS).eq("company_id", companyId).limit(1).single();

    if (error && error.code === "PGRST116") {
      const { data: created, error: createErr } = await supabase.from("scheduling_config").insert({ company_id: companyId }).select(CONFIG_FIELDS).single();
      if (createErr) return NextResponse.json({ error: "Failed to create config" }, { status: 500 });
      data = created;
      error = null;
    }
    if (error) return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });

    return NextResponse.json({ data: toClient(data as Record<string, unknown>) }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.priorityMode !== undefined) updates.priority_mode = body.priorityMode;
    if (body.priorityWeights !== undefined) updates.priority_weights = body.priorityWeights;
    if (body.teamMode !== undefined) updates.team_mode = body.teamMode;
    if (body.crewsPerDay !== undefined) updates.crews_per_day = body.crewsPerDay;
    if (body.maxJobsPerCrew !== undefined) updates.max_jobs_per_crew = body.maxJobsPerCrew;
    if (body.bufferMinutes !== undefined) updates.buffer_minutes = body.bufferMinutes;
    if (body.defaultDurationMin !== undefined) updates.default_duration_min = body.defaultDurationMin;
    if (body.bookingWindowDays !== undefined) updates.booking_window_days = body.bookingWindowDays;
    if (body.minNoticeHours !== undefined) updates.min_notice_hours = body.minNoticeHours;
    if (body.timeSlotMode !== undefined) updates.time_slot_mode = body.timeSlotMode;
    if (body.autoConfirm !== undefined) updates.auto_confirm = body.autoConfirm;
    if (body.waitlistEnabled !== undefined) updates.waitlist_enabled = body.waitlistEnabled;
    if (body.crewOverrideEnabled !== undefined) updates.crew_override_enabled = body.crewOverrideEnabled;
    if (body.zoneEnforcement !== undefined) updates.zone_enforcement = body.zoneEnforcement;
    if (body.businessHours !== undefined) updates.business_hours = body.businessHours;

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from("scheduling_config").update(updates).eq("company_id", companyId).select(CONFIG_FIELDS).single();

    if (error) return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
    return NextResponse.json({ data: toClient(data as Record<string, unknown>) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
