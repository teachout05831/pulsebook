import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const SETTINGS_FIELDS = "id, company_id, enabled, default_title, auto_record, expiration_hours, show_trust_signals, show_portfolio, welcome_message, widgets, idl_settings, created_at, updated_at";

const CAMEL_DEFAULTS = {
  enabled: true,
  defaultTitle: "Video Consultation",
  autoRecord: false,
  expirationHours: 48,
  showTrustSignals: true,
  showPortfolio: true,
  welcomeMessage: "",
  widgets: [],
};

// GET /api/settings/consultations - Get consultation settings for active company
export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    // Specific fields, filter by company_id, limit(1)
    const { data, error } = await supabase
      .from("consultation_settings")
      .select(SETTINGS_FIELDS)
      .eq("company_id", companyId)
      .limit(1)
      .single();

    // If no row exists yet, return defaults
    if (error || !data) {
      return NextResponse.json({ data: CAMEL_DEFAULTS }, {
        headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
      });
    }

    // snake_case -> camelCase conversion
    return NextResponse.json({
      data: {
        id: data.id,
        enabled: data.enabled,
        defaultTitle: data.default_title,
        autoRecord: data.auto_record,
        expirationHours: data.expiration_hours,
        showTrustSignals: data.show_trust_signals,
        showPortfolio: data.show_portfolio,
        welcomeMessage: data.welcome_message || "",
        widgets: data.widgets || [],
        idlSettings: data.idl_settings || {},
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

// PUT /api/settings/consultations - Create or update consultation settings
export async function PUT(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    // Parse input
    const body = await request.json();

    // camelCase -> snake_case conversion
    const payload = {
      company_id: companyId,
      enabled: body.enabled ?? true,
      default_title: body.defaultTitle ?? "Video Consultation",
      auto_record: body.autoRecord ?? false,
      expiration_hours: body.expirationHours ?? 48,
      show_trust_signals: body.showTrustSignals ?? true,
      show_portfolio: body.showPortfolio ?? true,
      welcome_message: body.welcomeMessage ?? null,
      widgets: body.widgets ?? [],
      idl_settings: body.idlSettings ?? {},
      updated_at: new Date().toISOString(),
    };

    // Upsert (same pattern as brand-kit route)
    const { data, error } = await supabase
      .from("consultation_settings")
      .upsert(payload, { onConflict: "company_id" })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }

    return NextResponse.json({ data: { id: data.id } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
