import { NextResponse } from "next/server";
import { getCrews } from "@/features/crews/queries/getCrews";
import { createCrew } from "@/features/crews/actions/createCrew";

export async function GET() {
  try {
    const { crews, members } = await getCrews();

    // Convert snake_case → camelCase and attach members to crews
    const data = crews.map((c) => {
      const crewMembers = members
        .filter((m) => m.crew_id === c.id)
        .map((m) => ({
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

      return {
        id: c.id,
        companyId: c.company_id,
        name: c.name,
        color: c.color,
        vehicleName: c.vehicle_name,
        leadMemberId: c.lead_member_id,
        leadMemberName: leadMember?.memberName || null,
        isActive: c.is_active,
        sortOrder: c.sort_order,
        members: crewMembers,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      };
    });

    return NextResponse.json({ data }, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch crews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createCrew({
      name: body.name,
      color: body.color || "#3b82f6",
      vehicle_name: body.vehicleName || null,
      lead_member_id: body.leadMemberId || null,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const c = result.data!;
    return NextResponse.json({
      data: {
        id: c.id,
        companyId: c.company_id,
        name: c.name,
        color: c.color,
        vehicleName: c.vehicle_name,
        leadMemberId: c.lead_member_id,
        leadMemberName: null,
        isActive: c.is_active,
        sortOrder: c.sort_order,
        members: [],
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to create crew" }, { status: 500 });
  }
}
