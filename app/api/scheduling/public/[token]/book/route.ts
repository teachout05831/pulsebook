import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { runScoringEngine } from "@/features/scheduling/utils/scoringEngine";
import type { Crew, ZoneTravelTime } from "@/features/scheduling/types/crews";
import type { PriorityWeights } from "@/features/scheduling/types/config";

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const { token } = params;
  const body = await request.json();

  if (!body.customerName?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!body.preferredDate || !body.preferredTime) return NextResponse.json({ error: "Date and time required" }, { status: 400 });

  const supabase = await createClient();
  const { data: page } = await supabase.from("scheduling_pages")
    .select("id, company_id").eq("public_token", token).eq("status", "published").eq("is_active", true).limit(1).single();
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  const companyId = page.company_id;
  const admin = createAdminClient();

  const [configRes, crewsRes, travelRes, bookingsRes] = await Promise.all([
    admin.from("scheduling_config").select("priority_mode, priority_weights, crew_override_enabled, auto_confirm, default_duration_min").eq("company_id", companyId).limit(1).single(),
    admin.from("crews").select("id, name, color, zone_id, specializations, max_hours_per_day, max_jobs_per_day, is_active").eq("company_id", companyId).eq("is_active", true).limit(20),
    admin.from("zone_travel_times").select("id, from_zone_id, to_zone_id, travel_minutes").eq("company_id", companyId).limit(100),
    admin.from("booking_requests").select("assigned_crew_id, duration_minutes").eq("company_id", companyId).eq("preferred_date", body.preferredDate).in("status", ["pending", "confirmed"]).limit(100),
  ]);

  const config = configRes.data;
  if (!config) return NextResponse.json({ error: "Scheduling not configured" }, { status: 500 });

  const crews: Crew[] = (crewsRes.data || []).map((c: Record<string, unknown>) => ({
    id: c.id as string, companyId, name: c.name as string, color: c.color as string,
    leaderId: null, memberIds: [], zoneId: c.zone_id as string | null,
    specializations: (c.specializations || []) as string[],
    maxHoursPerDay: c.max_hours_per_day as number, maxJobsPerDay: c.max_jobs_per_day as number,
    vehicleName: null, isActive: true, createdAt: "",
  }));

  const travelTimes: ZoneTravelTime[] = (travelRes.data || []).map((t: Record<string, unknown>) => ({
    id: t.id as string, companyId, fromZoneId: t.from_zone_id as string,
    toZoneId: t.to_zone_id as string, travelMinutes: t.travel_minutes as number,
  }));

  // Build workload: sum hours per crew for this date
  const crewWorkloads: Record<string, number> = {};
  for (const b of (bookingsRes.data || []) as Record<string, unknown>[]) {
    const cid = b.assigned_crew_id as string;
    if (cid) crewWorkloads[cid] = (crewWorkloads[cid] || 0) + ((b.duration_minutes as number) || config.default_duration_min || 60) / 60;
  }

  const durationMin = config.default_duration_min || 60;
  const scoring = runScoringEngine({
    crews, weights: config.priority_weights as PriorityWeights, mode: config.priority_mode as string,
    crewOverrideEnabled: config.crew_override_enabled as boolean,
    preferredCrewIds: body.preferredCrewId ? [body.preferredCrewId] : [],
    jobZoneId: null, jobDuration: durationMin / 60, jobSpecializations: [],
    crewWorkloads, travelTimes,
  });

  const status = config.auto_confirm ? "confirmed" : "pending";

  const { data: booking, error } = await admin.from("booking_requests").insert({
    company_id: companyId, scheduling_page_id: page.id,
    customer_name: body.customerName, customer_email: body.customerEmail || null,
    customer_phone: body.customerPhone || null, customer_address: body.customerAddress || null,
    service_type_id: body.serviceTypeId || null,
    preferred_date: body.preferredDate, preferred_time: body.preferredTime,
    date_flexibility: body.dateFlexibility || "must_have",
    preferred_crew_id: body.preferredCrewId || null, assigned_crew_id: scoring.winnerId,
    duration_minutes: durationMin,
    score: scoring.results.find(r => r.crewId === scoring.winnerId)?.totalScore || null,
    scoring_explanation: scoring, status, notes: body.notes || null,
  }).select("id, status, preferred_date, preferred_time, assigned_crew_id").single();

  if (error) return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });

  return NextResponse.json({ data: {
    id: booking.id, status: booking.status, preferredDate: booking.preferred_date,
    preferredTime: booking.preferred_time, assignedCrewId: booking.assigned_crew_id,
    assignedCrewName: scoring.winnerName,
  } }, { status: 201 });
}
