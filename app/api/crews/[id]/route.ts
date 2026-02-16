import { NextResponse } from "next/server";
import { getCrewById } from "@/features/crews/queries/getCrewById";
import { updateCrew } from "@/features/crews/actions/updateCrew";
import { deleteCrew } from "@/features/crews/actions/deleteCrew";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { crew: c, members } = await getCrewById(id);

    const crewMembers = members.map((m) => ({
      id: m.id,
      crewId: m.crew_id,
      teamMemberId: m.team_member_id,
      memberName: (m as Record<string, unknown>).team_members
        ? ((m as Record<string, unknown>).team_members as Record<string, unknown>).name
        : "Unknown",
      memberRole: (m as Record<string, unknown>).team_members
        ? ((m as Record<string, unknown>).team_members as Record<string, unknown>).role
        : "technician",
      isDefault: m.is_default,
    }));

    const leadMember = crewMembers.find((m) => m.teamMemberId === c.lead_member_id);

    return NextResponse.json({
      data: {
        id: c.id, companyId: c.company_id, name: c.name, color: c.color,
        vehicleName: c.vehicle_name, leadMemberId: c.lead_member_id,
        leadMemberName: leadMember?.memberName || null,
        isActive: c.is_active, sortOrder: c.sort_order,
        members: crewMembers, createdAt: c.created_at, updatedAt: c.updated_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch crew" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const input: Record<string, unknown> = {};
    if (body.name !== undefined) input.name = body.name;
    if (body.color !== undefined) input.color = body.color;
    if (body.vehicleName !== undefined) input.vehicle_name = body.vehicleName;
    if (body.leadMemberId !== undefined) input.lead_member_id = body.leadMemberId;
    if (body.isActive !== undefined) input.is_active = body.isActive;
    if (body.sortOrder !== undefined) input.sort_order = body.sortOrder;

    const result = await updateCrew(id, input);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

    const c = result.data!;
    return NextResponse.json({
      data: {
        id: c.id, companyId: c.company_id, name: c.name, color: c.color,
        vehicleName: c.vehicle_name, leadMemberId: c.lead_member_id,
        isActive: c.is_active, sortOrder: c.sort_order,
        createdAt: c.created_at, updatedAt: c.updated_at,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to update crew" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await deleteCrew(id);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete crew" }, { status: 500 });
  }
}
