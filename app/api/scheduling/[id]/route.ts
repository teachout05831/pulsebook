import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { syncUniversalBlocks } from "@/lib/utils/syncUniversalBlocks";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = await params;

    const { data, error } = await supabase
      .from("scheduling_pages")
      .select("id, name, slug, public_token, sections, design_theme, settings, status, is_active, published_at")
      .eq("id", id)
      .eq("company_id", companyId)
      .limit(1)
      .single();

    if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const sections = await syncUniversalBlocks((data.sections || []) as any[], companyId);

    return NextResponse.json({
      data: {
        id: data.id, name: data.name, slug: data.slug, publicToken: data.public_token,
        sections, designTheme: data.design_theme || {}, settings: data.settings || {},
        status: data.status, isActive: data.is_active, publishedAt: data.published_at,
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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.name !== undefined) update.name = body.name;
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.sections !== undefined) update.sections = body.sections;
    if (body.designTheme !== undefined) update.design_theme = body.designTheme;
    if (body.settings !== undefined) update.settings = body.settings;
    if (body.isActive !== undefined) update.is_active = body.isActive;

    const { error } = await supabase
      .from("scheduling_pages")
      .update(update)
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { id } = await params;

    const { error } = await supabase
      .from("scheduling_pages")
      .delete()
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
