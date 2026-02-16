import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const DEFAULTS = {
  enabled: true,
  showTranscript: true,
  showServiceSuggestions: true,
  showObjectionResponses: true,
  autoAdvanceStage: true,
};

// GET /api/settings/ai-coach - Get AI Coach settings for active company
export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("consultation_settings")
      .select("ai_coach")
      .eq("company_id", companyId)
      .limit(1)
      .single();

    if (error || !data || !data.ai_coach) {
      return NextResponse.json(DEFAULTS, {
        headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
      });
    }

    // snake_case → camelCase conversion
    const raw = data.ai_coach as Record<string, unknown>;
    return NextResponse.json({
      enabled: raw.enabled ?? DEFAULTS.enabled,
      showTranscript: raw.show_transcript ?? DEFAULTS.showTranscript,
      showServiceSuggestions: raw.show_service_suggestions ?? DEFAULTS.showServiceSuggestions,
      showObjectionResponses: raw.show_objection_responses ?? DEFAULTS.showObjectionResponses,
      autoAdvanceStage: raw.auto_advance_stage ?? DEFAULTS.autoAdvanceStage,
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

// PUT /api/settings/ai-coach - Save AI Coach settings
export async function PUT(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();
    const body = await request.json();

    // camelCase → snake_case for JSONB storage
    const aiCoach = {
      enabled: body.enabled ?? DEFAULTS.enabled,
      show_transcript: body.showTranscript ?? DEFAULTS.showTranscript,
      show_service_suggestions: body.showServiceSuggestions ?? DEFAULTS.showServiceSuggestions,
      show_objection_responses: body.showObjectionResponses ?? DEFAULTS.showObjectionResponses,
      auto_advance_stage: body.autoAdvanceStage ?? DEFAULTS.autoAdvanceStage,
    };

    const { error } = await supabase
      .from("consultation_settings")
      .upsert(
        { company_id: companyId, ai_coach: aiCoach, updated_at: new Date().toISOString() },
        { onConflict: "company_id" }
      )
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
