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

// GET /api/estimate-pages/templates - List templates for the company
export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    // Fetch company templates + system templates visible to all
    const { data, error } = await supabase
      .from("estimate_page_templates")
      .select(TEMPLATE_FIELDS)
      .or(`company_id.eq.${companyId},is_system.eq.true`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }

    const templates = (data || []).map(transformTemplate);

    return NextResponse.json({ data: templates }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/estimate-pages/templates - Create a custom template
export async function POST(request: NextRequest) {
  try {
    const { user, companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 1) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 });
    }

    if (!body.sections || !Array.isArray(body.sections)) {
      return NextResponse.json({ error: "Sections array is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("estimate_page_templates")
      .insert({
        company_id: companyId,
        name: body.name.trim(),
        description: body.description || null,
        category: body.category || null,
        layout: body.layout || "stacked",
        sections: body.sections,
        design_theme: body.designTheme || {},
        incentive_config: body.incentiveConfig || null,
        is_system: false,
        created_by: user.id,
      })
      .select(TEMPLATE_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }

    return NextResponse.json({ data: transformTemplate(data) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
