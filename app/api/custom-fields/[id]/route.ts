import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data: existing } = await supabase
      .from("custom_field_definitions")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.label !== undefined) updates.label = body.label.trim();
    if (body.fieldType !== undefined) updates.field_type = body.fieldType;
    if (body.section !== undefined) updates.section = body.section;
    if (body.options !== undefined) updates.options = body.options;
    if (body.isRequired !== undefined) updates.is_required = body.isRequired;
    if (body.placeholder !== undefined) updates.placeholder = body.placeholder;
    if (body.sortOrder !== undefined) updates.sort_order = body.sortOrder;
    if (body.sectionOrder !== undefined) updates.section_order = body.sectionOrder;
    if (body.isActive !== undefined) updates.is_active = body.isActive;

    const { data, error } = await supabase
      .from("custom_field_definitions")
      .update(updates)
      .eq("id", id)
      .select("id, company_id, entity_type, section, field_key, label, field_type, options, is_required, placeholder, sort_order, section_order, is_active, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id, companyId: data.company_id, entityType: data.entity_type,
        section: data.section, fieldKey: data.field_key, label: data.label,
        fieldType: data.field_type, options: data.options, isRequired: data.is_required,
        placeholder: data.placeholder, sortOrder: data.sort_order,
        sectionOrder: data.section_order, isActive: data.is_active,
        createdAt: data.created_at, updatedAt: data.updated_at,
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
  const { id } = await params;

  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data: existing } = await supabase
      .from("custom_field_definitions")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("custom_field_definitions")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
