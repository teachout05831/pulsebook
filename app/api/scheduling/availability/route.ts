import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { getAvailableSlots } from "@/features/scheduling/utils/availability";
import { getDailyCapacity } from "@/features/scheduling/utils/capacity";
import type { BusinessHours } from "@/features/scheduling/types";

const CONFIG_FIELDS = "business_hours, buffer_minutes, default_duration_min, crews_per_day, max_jobs_per_crew, time_slot_mode";

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const date = new URL(request.url).searchParams.get("date");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "date param required (YYYY-MM-DD)" }, { status: 400 });
    }

    // Fetch scheduling config
    const { data: config } = await supabase.from("scheduling_config")
      .select(CONFIG_FIELDS).eq("company_id", companyId).limit(1).single();
    if (!config) {
      return NextResponse.json({ error: "Scheduling not configured" }, { status: 404 });
    }

    // Fetch existing jobs for this date (not cancelled/completed)
    const { data: jobs } = await supabase.from("jobs")
      .select("scheduled_time, estimated_duration")
      .eq("company_id", companyId).eq("scheduled_date", date)
      .not("status", "in", '("cancelled","completed")')
      .limit(100);

    // Fetch existing booking requests for this date
    const { data: bookings } = await supabase.from("booking_requests")
      .select("preferred_time, duration_minutes")
      .eq("company_id", companyId).eq("preferred_date", date)
      .in("status", ["pending", "confirmed"])
      .limit(100);

    const defaultDuration = config.default_duration_min || 60;

    // Combine jobs + bookings into one array
    const existing = [
      ...(jobs || []).filter(j => j.scheduled_time).map(j => ({
        time: j.scheduled_time, durationMinutes: j.estimated_duration || defaultDuration,
      })),
      ...(bookings || []).map(b => ({
        time: b.preferred_time, durationMinutes: b.duration_minutes || defaultDuration,
      })),
    ];

    const slotInterval = config.time_slot_mode === "exact" ? 30 : 60;
    const slots = getAvailableSlots({
      date,
      businessHours: config.business_hours as BusinessHours,
      existingBookings: existing,
      bufferMinutes: config.buffer_minutes || 30,
      slotIntervalMinutes: slotInterval,
      defaultDurationMinutes: defaultDuration,
    });

    const totalCap = (config.crews_per_day || 3) * (config.max_jobs_per_crew || 6);
    const capacity = getDailyCapacity(totalCap, existing.length);

    return NextResponse.json({ date, slots, capacity: { total: capacity.total, used: capacity.used, remaining: capacity.remaining, status: capacity.status } }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
