import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("contract_templates")
      .select("id, company_id, name, description, category, design_theme, blocks, stage_colors, is_active, is_default, version, attachment_mode, applies_to, created_at, updated_at")
      .eq("company_id", companyId)
      .order("name", { ascending: true })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }

    const templates = (data || []).map((row) => ({
      id: row.id,
      companyId: row.company_id,
      name: row.name,
      description: row.description,
      category: row.category,
      designTheme: row.design_theme,
      blocks: row.blocks,
      stageColors: row.stage_colors,
      isActive: row.is_active,
      isDefault: row.is_default,
      version: row.version,
      attachmentMode: row.attachment_mode || "manual",
      appliesTo: row.applies_to || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

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

export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.name || body.name.trim().length < 1) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("contract_templates")
      .insert({
        company_id: companyId,
        name: body.name.trim(),
        description: body.description || null,
        category: body.category || null,
        design_theme: body.designTheme || null,
        blocks: body.blocks || [],
      })
      .select("id, company_id, name, description, category, design_theme, blocks, stage_colors, is_active, is_default, version, attachment_mode, applies_to, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        id: data.id,
        companyId: data.company_id,
        name: data.name,
        description: data.description,
        category: data.category,
        designTheme: data.design_theme,
        blocks: data.blocks,
        stageColors: data.stage_colors,
        isActive: data.is_active,
        isDefault: data.is_default,
        version: data.version,
        attachmentMode: data.attachment_mode || "manual",
        appliesTo: data.applies_to || [],
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
