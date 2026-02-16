import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const CREW_FIELDS = "id, company_id, name, color, leader_id, member_ids, zone_id, specializations, max_hours_per_day, max_jobs_per_day, vehicle_name, is_active, created_at";

function toClient(r: Record<string, unknown>) {
  return { id: r.id, companyId: r.company_id, name: r.name, color: r.color, leaderId: r.leader_id, memberIds: r.member_ids, zoneId: r.zone_id, specializations: r.specializations, maxHoursPerDay: r.max_hours_per_day, maxJobsPerDay: r.max_jobs_per_day, vehicleName: r.vehicle_name, isActive: r.is_active, createdAt: r.created_at };
}

export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase.from("crews").select(CREW_FIELDS).eq("company_id", companyId).order("created_at").limit(50);
    if (error) return NextResponse.json({ error: "Failed to fetch crews" }, { status: 500 });

    return NextResponse.json({ data: (data || []).map(c => toClient(c as Record<string, unknown>)) }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();
    if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const { data, error } = await supabase.from("crews").insert({
      company_id: companyId, name: body.name, color: body.color || "#3b82f6",
      leader_id: body.leaderId || null, member_ids: body.memberIds || [],
      zone_id: body.zoneId || null, specializations: body.specializations || [],
      max_hours_per_day: body.maxHoursPerDay || 8, max_jobs_per_day: body.maxJobsPerDay || 6,
      vehicle_name: body.vehicleName || null,
    }).select(CREW_FIELDS).single();

    if (error) return NextResponse.json({ error: "Failed to create crew" }, { status: 500 });
    return NextResponse.json({ data: toClient(data as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
