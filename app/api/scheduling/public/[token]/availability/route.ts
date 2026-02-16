import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAvailableSlots } from "@/features/scheduling/utils/availability";
import { getDailyCapacity } from "@/features/scheduling/utils/capacity";
import type { BusinessHours } from "@/features/scheduling/types";

const CONFIG_FIELDS = "business_hours, buffer_minutes, default_duration_min, booking_window_days, min_notice_hours, crews_per_day, max_jobs_per_crew, time_slot_mode";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  const date = new URL(request.url).searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date param required (YYYY-MM-DD)" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: page } = await supabase.from("scheduling_pages")
    .select("id, company_id").eq("public_token", token).eq("status", "published").eq("is_active", true).limit(1).single();
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const { data: config } = await supabase.from("scheduling_config")
    .select(CONFIG_FIELDS).eq("company_id", page.company_id).limit(1).single();
  if (!config) return NextResponse.json({ error: "Scheduling not configured" }, { status: 404 });

  // Validate date range
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const reqDate = new Date(date + "T12:00:00");
  const diffDays = Math.ceil((reqDate.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return NextResponse.json({ error: "Cannot book in the past" }, { status: 400 });
  if (config.min_notice_hours > 0 && diffDays * 24 < config.min_notice_hours) {
    return NextResponse.json({ error: `Minimum ${config.min_notice_hours}h notice required` }, { status: 400 });
  }
  if (diffDays > config.booking_window_days) {
    return NextResponse.json({ error: "Date beyond booking window" }, { status: 400 });
  }

  // Fetch existing bookings for this date
  const { data: bookings } = await supabase.from("booking_requests")
    .select("preferred_time, duration_minutes").eq("company_id", page.company_id)
    .eq("preferred_date", date).in("status", ["pending", "confirmed"]).limit(100);

  const existing = (bookings || []).map(b => ({
    time: b.preferred_time, durationMinutes: b.duration_minutes || config.default_duration_min || 60,
  }));

  const slotInterval = config.time_slot_mode === "exact" ? 30 : 60;
  const slots = getAvailableSlots({
    date, businessHours: config.business_hours as BusinessHours, existingBookings: existing,
    bufferMinutes: config.buffer_minutes || 30, slotIntervalMinutes: slotInterval,
    defaultDurationMinutes: config.default_duration_min || 60,
  });

  const totalCap = (config.crews_per_day || 3) * (config.max_jobs_per_crew || 6);
  const capacity = getDailyCapacity(totalCap, existing.length);

  return NextResponse.json({ date, slots, capacity: { total: capacity.total, used: capacity.used, remaining: capacity.remaining, status: capacity.status } }, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" }
  });
}
