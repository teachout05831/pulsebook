import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const CREW_FIELDS = "id, company_id, name, color, leader_id, member_ids, zone_id, specializations, max_hours_per_day, max_jobs_per_day, vehicle_name, is_active, created_at";

function toClient(r: Record<string, unknown>) {
  return { id: r.id, companyId: r.company_id, name: r.name, color: r.color, leaderId: r.leader_id, memberIds: r.member_ids, zoneId: r.zone_id, specializations: r.specializations, maxHoursPerDay: r.max_hours_per_day, maxJobsPerDay: r.max_jobs_per_day, vehicleName: r.vehicle_name, isActive: r.is_active, createdAt: r.created_at };
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = await params;

    const { data: existing } = await supabase.from("crews").select("company_id").eq("id", id).single();
    if (!existing || existing.company_id !== companyId) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.color !== undefined) updates.color = body.color;
    if (body.leaderId !== undefined) updates.leader_id = body.leaderId;
    if (body.memberIds !== undefined) updates.member_ids = body.memberIds;
    if (body.zoneId !== undefined) updates.zone_id = body.zoneId;
    if (body.specializations !== undefined) updates.specializations = body.specializations;
    if (body.maxHoursPerDay !== undefined) updates.max_hours_per_day = body.maxHoursPerDay;
    if (body.maxJobsPerDay !== undefined) updates.max_jobs_per_day = body.maxJobsPerDay;
    if (body.vehicleName !== undefined) updates.vehicle_name = body.vehicleName;
    if (body.isActive !== undefined) updates.is_active = body.isActive;

    const { data, error } = await supabase.from("crews").update(updates).eq("id", id).select(CREW_FIELDS).single();
    if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    return NextResponse.json({ data: toClient(data as Record<string, unknown>) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = await params;

    const { data: existing } = await supabase.from("crews").select("company_id").eq("id", id).single();
    if (!existing || existing.company_id !== companyId) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { error } = await supabase.from("crews").delete().eq("id", id);
    if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
