import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const SETTINGS_FIELDS =
  "id, ghl_enabled, ghl_api_token, ghl_location_id, ghl_sync_new_leads, ghl_sync_job_booked, ghl_sync_lead_lost, ghl_sync_status_changes, ghl_default_tags";

const CAMEL_DEFAULTS = {
  ghlEnabled: false,
  ghlApiToken: "",
  ghlLocationId: "",
  ghlSyncNewLeads: true,
  ghlSyncJobBooked: false,
  ghlSyncLeadLost: false,
  ghlSyncStatusChanges: false,
  ghlDefaultTags: [],
};

function maskToken(token: string | null): string {
  if (!token || token.length < 8) return "";
  return "••••••••" + token.slice(-4);
}

export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("integration_settings")
      .select(SETTINGS_FIELDS)
      .eq("company_id", companyId)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { data: CAMEL_DEFAULTS },
        { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" } }
      );
    }

    return NextResponse.json({
      data: {
        id: data.id,
        ghlEnabled: data.ghl_enabled,
        ghlApiToken: maskToken(data.ghl_api_token),
        ghlLocationId: data.ghl_location_id || "",
        ghlSyncNewLeads: data.ghl_sync_new_leads,
        ghlSyncJobBooked: data.ghl_sync_job_booked,
        ghlSyncLeadLost: data.ghl_sync_lead_lost,
        ghlSyncStatusChanges: data.ghl_sync_status_changes,
        ghlDefaultTags: data.ghl_default_tags || [],
      },
    }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const body = await request.json();

    // Only update token if user provided a new one (not the masked version)
    const isNewToken = body.ghlApiToken && !body.ghlApiToken.startsWith("••••");

    const payload: Record<string, unknown> = {
      company_id: companyId,
      ghl_enabled: body.ghlEnabled ?? false,
      ghl_location_id: body.ghlLocationId ?? null,
      ghl_sync_new_leads: body.ghlSyncNewLeads ?? true,
      ghl_sync_job_booked: body.ghlSyncJobBooked ?? false,
      ghl_sync_lead_lost: body.ghlSyncLeadLost ?? false,
      ghl_sync_status_changes: body.ghlSyncStatusChanges ?? false,
      ghl_default_tags: body.ghlDefaultTags ?? [],
      updated_at: new Date().toISOString(),
    };

    if (isNewToken) {
      payload.ghl_api_token = body.ghlApiToken;
    }

    const { data, error } = await supabase
      .from("integration_settings")
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
