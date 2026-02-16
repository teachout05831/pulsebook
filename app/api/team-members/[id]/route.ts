import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const TEAM_MEMBER_FIELDS = "id, company_id, user_id, name, email, phone, role, is_active, created_at, updated_at";

// GET /api/team-members/[id] - Get a single team member
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("team_members")
      .select(TEAM_MEMBER_FIELDS)
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const teamMember = {
      id: data.id,
      companyId: data.company_id,
      userId: data.user_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: teamMember }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/team-members/[id] - Update a team member
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify ownership and get existing email
    const { data: existing } = await supabase
      .from("team_members")
      .select("company_id, email")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();

    // Validate role if provided
    if (body.role) {
      const validRoles = ["admin", "technician", "office"];
      if (!validRoles.includes(body.role)) {
        return NextResponse.json({ error: "Invalid role. Must be admin, technician, or office" }, { status: 400 });
      }
    }

    // Check for duplicate email if email is being changed
    if (body.email && body.email.toLowerCase() !== existing.email.toLowerCase()) {
      const { data: duplicateEmail } = await supabase
        .from("team_members")
        .select("id")
        .eq("company_id", companyId)
        .ilike("email", body.email)
        .neq("id", id)
        .single();

      if (duplicateEmail) {
        return NextResponse.json({ error: "A team member with this email already exists" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.isActive !== undefined) updateData.is_active = body.isActive;

    const { data, error } = await supabase
      .from("team_members")
      .update(updateData)
      .eq("id", id)
      .select(TEAM_MEMBER_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
    }

    const teamMember = {
      id: data.id,
      companyId: data.company_id,
      userId: data.user_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: teamMember });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/team-members/[id] - Delete a team member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify ownership
    const { data: existing } = await supabase
      .from("team_members")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
