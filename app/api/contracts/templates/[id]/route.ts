import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("contract_templates")
      .select("id, company_id, name, description, category, design_theme, blocks, stage_colors, is_active, is_default, version, attachment_mode, applies_to, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (data.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
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
    const { companyId, supabase } = await getAuthCompany();

    const { data: existing } = await supabase
      .from("contract_templates")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.description !== undefined) updates.description = body.description;
    if (body.category !== undefined) updates.category = body.category;
    if (body.designTheme !== undefined) updates.design_theme = body.designTheme;
    if (body.blocks !== undefined) updates.blocks = body.blocks;
    if (body.stageColors !== undefined) updates.stage_colors = body.stageColors;
    if (body.isActive !== undefined) updates.is_active = body.isActive;
    if (body.isDefault !== undefined) updates.is_default = body.isDefault;
    if (body.attachmentMode !== undefined) updates.attachment_mode = body.attachmentMode;
    if (body.appliesTo !== undefined) updates.applies_to = body.appliesTo;

    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("contract_templates")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
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
    const { companyId, supabase } = await getAuthCompany();

    const { data: existing } = await supabase
      .from("contract_templates")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    if (existing.company_id !== companyId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("contract_templates")
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
