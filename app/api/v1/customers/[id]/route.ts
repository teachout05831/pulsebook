import { NextRequest, NextResponse } from "next/server";
import { withApiAuth } from "@/lib/api-auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const { data, error } = await supabase
      .from("customers")
      .select("id, name, email, phone, address, status, lead_status, source, estimated_value, service_type, notes, custom_fields, tags, ghl_contact_id, created_at, updated_at")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: data.id, name: data.name, email: data.email, phone: data.phone,
        address: data.address, status: data.status, leadStatus: data.lead_status,
        source: data.source, estimatedValue: data.estimated_value,
        serviceType: data.service_type, notes: data.notes,
        customFields: data.custom_fields || {}, tags: data.tags || [],
        ghlContactId: data.ghl_contact_id || null,
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const body = await request.json();

    // Input validation
    if (body.name !== undefined && (typeof body.name !== "string" || body.name.length < 2)) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    const VALID_STATUSES = ["active", "inactive", "lead"];
    if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Status must be one of: active, inactive, lead" }, { status: 400 });
    }
    if (body.email !== undefined && body.email !== null && body.email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.leadStatus !== undefined) updateData.lead_status = body.leadStatus;
    if (body.source !== undefined) updateData.source = body.source;
    if (body.estimatedValue !== undefined) updateData.estimated_value = body.estimatedValue;
    if (body.serviceType !== undefined) updateData.service_type = body.serviceType;
    if (body.customFields !== undefined) updateData.custom_fields = body.customFields;
    if (body.tags !== undefined) updateData.tags = body.tags;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", id)
      .eq("company_id", companyId)
      .select("id, name, email, phone, address, status, lead_status, source, estimated_value, service_type, notes, custom_fields, tags, ghl_contact_id, created_at, updated_at")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: data.id, name: data.name, email: data.email, phone: data.phone,
        address: data.address, status: data.status, leadStatus: data.lead_status,
        source: data.source, estimatedValue: data.estimated_value,
        serviceType: data.service_type, notes: data.notes,
        customFields: data.custom_fields || {}, tags: data.tags || [],
        ghlContactId: data.ghl_contact_id || null,
        createdAt: data.created_at, updatedAt: data.updated_at,
      },
    });
  });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return withApiAuth(request, async ({ companyId, supabase }) => {
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
    }

    return NextResponse.json({ data: { id, deleted: true } });
  });
}
