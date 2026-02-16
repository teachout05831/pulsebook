import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("customers")
      .select("id, company_id, user_id, name, email, phone, address, notes, status, lead_status, source, estimated_value, service_type, service_date, last_contact_date, assigned_to, custom_fields, tags, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
        companyId: data.company_id,
        userId: data.user_id || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        status: data.status || "active",
        leadStatus: data.lead_status || null,
        source: data.source || null,
        estimatedValue: data.estimated_value || null,
        serviceType: data.service_type || null,
        serviceDate: data.service_date || null,
        lastContactDate: data.last_contact_date || null,
        assignedTo: data.assigned_to || null,
        customFields: data.custom_fields || {},
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { supabase, companyId } = await getAuthCompany();

    // Ownership check: verify customer belongs to this company
    const { data: existing } = await supabase
      .from("customers")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing || existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();

    // Build update object (only include provided fields)
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.leadStatus !== undefined) {
      updateData.lead_status = body.leadStatus;
      // If status is 'won', convert to active customer
      if (body.leadStatus === "won") updateData.status = "active";
    }
    if (body.source !== undefined) updateData.source = body.source;
    if (body.estimatedValue !== undefined) updateData.estimated_value = body.estimatedValue;
    if (body.customFields !== undefined) updateData.custom_fields = body.customFields;
    if (body.tags !== undefined) updateData.tags = body.tags;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .select("id, company_id, name, email, phone, address, notes, status, lead_status, source, estimated_value, custom_fields, tags, created_at, updated_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
        companyId: data.company_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        status: data.status || "active",
        leadStatus: data.lead_status || null,
        source: data.source || null,
        estimatedValue: data.estimated_value || null,
        customFields: data.custom_fields || {},
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { supabase, companyId } = await getAuthCompany();

    // Get customer before deleting (for response) + ownership check
    const { data: existing } = await supabase
      .from("customers")
      .select("id, company_id, name, email, phone, address, notes, status, custom_fields, tags, created_at, updated_at")
      .eq("id", id)
      .single();

    if (!existing || existing.company_id !== companyId) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: existing.id,
        companyId: existing.company_id,
        name: existing.name,
        email: existing.email,
        phone: existing.phone,
        address: existing.address,
        notes: existing.notes,
        status: existing.status || "active",
        customFields: existing.custom_fields || {},
        tags: existing.tags || [],
        createdAt: existing.created_at,
        updatedAt: existing.updated_at,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
