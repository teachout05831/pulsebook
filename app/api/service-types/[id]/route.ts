import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const SERVICE_TYPE_FIELDS = "id, company_id, name, description, default_price, is_active, created_at, updated_at";

// GET /api/service-types/[id] - Get a single service type
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("service_types")
      .select(SERVICE_TYPE_FIELDS)
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Service type not found" }, { status: 404 });
    }

    const serviceType = {
      id: data.id,
      companyId: data.company_id,
      name: data.name,
      description: data.description,
      defaultPrice: data.default_price,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: serviceType }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/service-types/[id] - Update a service type
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify ownership
    const { data: existing } = await supabase
      .from("service_types")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Service type not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.defaultPrice !== undefined) updateData.default_price = parseFloat(body.defaultPrice);
    if (body.isActive !== undefined) updateData.is_active = body.isActive;

    const { data, error } = await supabase
      .from("service_types")
      .update(updateData)
      .eq("id", id)
      .select(SERVICE_TYPE_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update service type" }, { status: 500 });
    }

    const serviceType = {
      id: data.id,
      companyId: data.company_id,
      name: data.name,
      description: data.description,
      defaultPrice: data.default_price,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: serviceType });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/service-types/[id] - Delete a service type
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Verify ownership
    const { data: existing } = await supabase
      .from("service_types")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Service type not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("service_types")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete service type" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
