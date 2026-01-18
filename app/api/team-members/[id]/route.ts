import { NextRequest, NextResponse } from "next/server";
import { mockTeamMembers } from "../data";
import type { TeamMemberRole } from "@/types";

// GET /api/team-members/[id] - Get a single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const teamMember = mockTeamMembers.find((tm) => tm.id === id);

  if (!teamMember) {
    return NextResponse.json(
      { error: "Team member not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: teamMember });
}

// PATCH /api/team-members/[id] - Update a team member
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const index = mockTeamMembers.findIndex((tm) => tm.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Team member not found" },
      { status: 404 }
    );
  }

  // Check for duplicate email if email is being changed
  if (body.email && body.email !== mockTeamMembers[index].email) {
    const existingMember = mockTeamMembers.find(
      (tm) => tm.email.toLowerCase() === body.email.toLowerCase() && tm.id !== id
    );
    if (existingMember) {
      return NextResponse.json(
        { error: "A team member with this email already exists" },
        { status: 400 }
      );
    }
  }

  // Validate role if provided
  if (body.role) {
    const validRoles: TeamMemberRole[] = ["admin", "technician", "office"];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be admin, technician, or office" },
        { status: 400 }
      );
    }
  }

  const updated = {
    ...mockTeamMembers[index],
    name: body.name ?? mockTeamMembers[index].name,
    email: body.email ?? mockTeamMembers[index].email,
    phone: body.phone ?? mockTeamMembers[index].phone,
    role: body.role ?? mockTeamMembers[index].role,
    isActive: body.isActive !== undefined ? body.isActive : mockTeamMembers[index].isActive,
    updatedAt: new Date().toISOString(),
  };

  mockTeamMembers[index] = updated;

  return NextResponse.json({ data: updated });
}

// DELETE /api/team-members/[id] - Delete a team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = mockTeamMembers.findIndex((tm) => tm.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Team member not found" },
      { status: 404 }
    );
  }

  mockTeamMembers.splice(index, 1);

  return NextResponse.json({ success: true });
}
