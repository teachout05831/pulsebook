import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const TEMPLATE_FIELDS = "id, company_id, name, description, category, thumbnail_url, layout, sections, design_theme, incentive_config, is_active, is_default, is_system, created_at, updated_at";

function transformTemplate(t: Record<string, unknown>) {
  return {
    id: t.id,
    companyId: t.company_id,
    name: t.name,
    description: t.description || null,
    category: t.category || null,
    thumbnailUrl: t.thumbnail_url || null,
    layout: t.layout || "stacked",
    sections: t.sections || [],
    designTheme: t.design_theme || {},
    incentiveConfig: t.incentive_config || null,
    isActive: t.is_active,
    isDefault: t.is_default,
    isSystem: t.is_system,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/estimate-pages/templates/[id] - Get single template
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("estimate_page_templates")
      .select(TEMPLATE_FIELDS)
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Ownership check: must belong to this company OR be a system template
    if (data.company_id !== companyId && !data.is_system) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    return NextResponse.json({ data: transformTemplate(data) }, {
      headers: { "Cache-Control": "private, max-age=30, stale-while-revalidate=60" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/estimate-pages/templates/[id] - Update template
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Ownership check
    const { data: existing } = await supabase
      .from("estimate_page_templates")
      .select("company_id, is_system")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (existing.is_system) {
      return NextResponse.json({ error: "Cannot update system templates" }, { status: 403 });
    }

    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined) updates.category = body.category;
    if (body.thumbnailUrl !== undefined) updates.thumbnail_url = body.thumbnailUrl;
    if (body.layout !== undefined) updates.layout = body.layout;
    if (body.sections !== undefined) updates.sections = body.sections;
    if (body.designTheme !== undefined) updates.design_theme = body.designTheme;
    if (body.isActive !== undefined) updates.is_active = body.isActive;
    if (body.incentiveConfig !== undefined) updates.incentive_config = body.incentiveConfig;
    if (body.isDefault !== undefined) updates.is_default = body.isDefault;

    const { data, error } = await supabase
      .from("estimate_page_templates")
      .update(updates)
      .eq("id", id)
      .select(TEMPLATE_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
    }

    return NextResponse.json({ data: transformTemplate(data) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/estimate-pages/templates/[id] - Delete template
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Ownership check
    const { data: existing } = await supabase
      .from("estimate_page_templates")
      .select("company_id, is_system")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (existing.is_system) {
      return NextResponse.json({ error: "Cannot delete system templates" }, { status: 403 });
    }

    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("estimate_page_templates")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
