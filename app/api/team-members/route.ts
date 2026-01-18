import { NextRequest, NextResponse } from "next/server";
import { mockTeamMembers, getNextId } from "./data";
import type { TeamMember, TeamMemberRole } from "@/types";

// GET /api/team-members - List all team members
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";
  const role = searchParams.get("role") as TeamMemberRole | null;

  let teamMembers = [...mockTeamMembers];

  if (activeOnly) {
    teamMembers = teamMembers.filter((tm) => tm.isActive);
  }

  if (role) {
    teamMembers = teamMembers.filter((tm) => tm.role === role);
  }

  // Sort by name
  teamMembers.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({
    data: teamMembers,
    total: teamMembers.length,
  });
}

// POST /api/team-members - Create a new team member
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.email || !body.role) {
    return NextResponse.json(
      { error: "Name, email, and role are required" },
      { status: 400 }
    );
  }

  // Check for duplicate email
  const existingMember = mockTeamMembers.find(
    (tm) => tm.email.toLowerCase() === body.email.toLowerCase()
  );
  if (existingMember) {
    return NextResponse.json(
      { error: "A team member with this email already exists" },
      { status: 400 }
    );
  }

  const validRoles: TeamMemberRole[] = ["admin", "technician", "office"];
  if (!validRoles.includes(body.role)) {
    return NextResponse.json(
      { error: "Invalid role. Must be admin, technician, or office" },
      { status: 400 }
    );
  }

  const newTeamMember: TeamMember = {
    id: getNextId(),
    companyId: "company-001",
    name: body.name,
    email: body.email,
    phone: body.phone || "",
    role: body.role,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockTeamMembers.push(newTeamMember);

  return NextResponse.json({ data: newTeamMember }, { status: 201 });
}
