import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

export async function GET(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const entityType = request.nextUrl.searchParams.get("entityType");

    let query = supabase
      .from("custom_field_definitions")
      .select("id, company_id, entity_type, section, field_key, label, field_type, options, is_required, placeholder, sort_order, section_order, is_active, created_at, updated_at")
      .eq("company_id", companyId)
      .order("section_order", { ascending: true })
      .order("sort_order", { ascending: true })
      .limit(200);

    if (entityType) {
      query = query.eq("entity_type", entityType);
    }

    const { data, error } = await query;

    if (error) {
      // Table may not exist yet (migration not applied) -- return empty
      if (error.code === "42P01" || error.code === "PGRST205") {
        return NextResponse.json({ data: [] });
      }
      return NextResponse.json({ error: "Failed to fetch custom fields" }, { status: 500 });
    }

    const fields = (data || []).map((row) => ({
      id: row.id,
      companyId: row.company_id,
      entityType: row.entity_type,
      section: row.section,
      fieldKey: row.field_key,
      label: row.label,
      fieldType: row.field_type,
      options: row.options,
      isRequired: row.is_required,
      placeholder: row.placeholder,
      sortOrder: row.sort_order,
      sectionOrder: row.section_order,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(
      { data: fields },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.label || body.label.trim().length < 1) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }
    if (!body.fieldType) {
      return NextResponse.json({ error: "Field type is required" }, { status: 400 });
    }
    if (!body.entityType) {
      return NextResponse.json({ error: "Entity type is required" }, { status: 400 });
    }

    const fieldKey = body.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

    // Get next sort order
    const { data: maxOrder, error: orderError } = await supabase
      .from("custom_field_definitions")
      .select("sort_order")
      .eq("company_id", companyId)
      .eq("entity_type", body.entityType)
      .eq("section", body.section || "General")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    if (orderError?.code === "42P01" || orderError?.code === "PGRST205") {
      return NextResponse.json({ error: "Custom fields table not set up. Run migration 007." }, { status: 503 });
    }

    const nextOrder = (maxOrder?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("custom_field_definitions")
      .insert({
        company_id: companyId,
        entity_type: body.entityType,
        section: body.section || "General",
        field_key: fieldKey,
        label: body.label.trim(),
        field_type: body.fieldType,
        options: body.options || null,
        is_required: body.isRequired || false,
        placeholder: body.placeholder || null,
        sort_order: nextOrder,
        section_order: body.sectionOrder || 0,
      })
      .select("id, company_id, entity_type, section, field_key, label, field_type, options, is_required, placeholder, sort_order, section_order, is_active, created_at, updated_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A field with this name already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: "Failed to create custom field" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
        companyId: data.company_id,
        entityType: data.entity_type,
        section: data.section,
        fieldKey: data.field_key,
        label: data.label,
        fieldType: data.field_type,
        options: data.options,
        isRequired: data.is_required,
        placeholder: data.placeholder,
        sortOrder: data.sort_order,
        sectionOrder: data.section_order,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
