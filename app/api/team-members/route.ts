import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const TEAM_MEMBER_FIELDS = "id, company_id, user_id, name, email, phone, role, is_active, created_at, updated_at";

// GET /api/team-members - List all team members
export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("team_members")
      .select(TEAM_MEMBER_FIELDS, { count: "exact" })
      .eq("company_id", companyId);

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    if (role) {
      query = query.eq("role", role);
    }

    query = query.order("name", { ascending: true }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
    }

    // Transform to camelCase
    const teamMembers = (data || []).map((tm) => ({
      id: tm.id,
      companyId: tm.company_id,
      userId: tm.user_id,
      name: tm.name,
      email: tm.email,
      phone: tm.phone,
      role: tm.role,
      isActive: tm.is_active,
      createdAt: tm.created_at,
      updatedAt: tm.updated_at,
    }));

    return NextResponse.json(
      { data: teamMembers, total: count || 0, page, limit },
      { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/team-members - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ error: "Name, email, and role are required" }, { status: 400 });
    }

    const validRoles = ["admin", "technician", "office"];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json({ error: "Invalid role. Must be admin, technician, or office" }, { status: 400 });
    }

    // Check for duplicate email
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("company_id", companyId)
      .ilike("email", body.email)
      .single();

    if (existingMember) {
      return NextResponse.json({ error: "A team member with this email already exists" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("team_members")
      .insert({
        company_id: companyId,
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        role: body.role,
        is_active: true,
      })
      .select(TEAM_MEMBER_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
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

    return NextResponse.json({ data: teamMember }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
