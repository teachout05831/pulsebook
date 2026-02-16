import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { syncUniversalBlocks } from "@/lib/utils/syncUniversalBlocks";

interface WidgetRow {
  type: string;
  sections?: unknown[];
  designTheme?: Record<string, unknown>;
  [key: string]: unknown;
}

// GET /api/settings/consultations/widgets/[type] — Load widget builder data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { type } = await params;

    const { data } = await supabase
      .from("consultation_settings")
      .select("widgets")
      .eq("company_id", companyId)
      .limit(1)
      .single();

    const widgets = (data?.widgets || []) as WidgetRow[];
    const widget = widgets.find((w) => w.type === type);
    const sections = await syncUniversalBlocks((widget?.sections || []) as any[], companyId);

    return NextResponse.json({
      data: {
        sections,
        designTheme: widget?.designTheme || {},
      },
    }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PATCH /api/settings/consultations/widgets/[type] — Save widget builder data
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const { type } = await params;

    const body = await request.json();

    // Load current settings row (ownership via company_id filter)
    const { data: settings } = await supabase
      .from("consultation_settings")
      .select("id, widgets")
      .eq("company_id", companyId)
      .limit(1)
      .single();

    const widgets = (settings?.widgets || []) as WidgetRow[];
    const exists = widgets.some((w) => w.type === type);

    // Update existing widget or add new one if it doesn't exist yet
    const updated = exists
      ? widgets.map((w) =>
          w.type === type
            ? { ...w, sections: body.sections || [], designTheme: body.designTheme || {} }
            : w
        )
      : [...widgets, { id: crypto.randomUUID(), type, label: type, sections: body.sections || [], designTheme: body.designTheme || {} }];

    if (settings) {
      const { error } = await supabase
        .from("consultation_settings")
        .update({ widgets: updated, updated_at: new Date().toISOString() })
        .eq("id", settings.id);
      if (error) return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    } else {
      // No settings row yet — create one with this widget
      const { error } = await supabase
        .from("consultation_settings")
        .insert({ company_id: companyId, widgets: updated });
      if (error) return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
