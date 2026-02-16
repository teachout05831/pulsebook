import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";
import { buildPromptModeSystemPrompt, buildTranscriptModeSystemPrompt } from "./prompts";
import { buildMockResponse } from "./mock-response";

const VALID_MODES = ["prompt", "transcript"];

// POST /api/estimate-pages/ai/generate - AI-powered estimate page generation
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const AI_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
    if (!AI_API_KEY) {
      return NextResponse.json(
        { error: "AI generation not configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY." },
        { status: 503 }
      );
    }

    const body = await request.json();

    if (!body.mode || !VALID_MODES.includes(body.mode)) {
      return NextResponse.json(
        { error: "mode is required and must be one of: prompt, transcript" },
        { status: 400 }
      );
    }

    if (!body.input || typeof body.input !== "string" || body.input.trim().length < 10) {
      return NextResponse.json(
        { error: "input is required and must be at least 10 characters" },
        { status: 400 }
      );
    }

    const { data: rateCards } = await supabase
      .from("company_rate_cards")
      .select("name, items")
      .eq("company_id", companyId)
      .eq("is_active", true)
      .limit(10);

    const { data: brandKit } = await supabase
      .from("company_brand_kits")
      .select("company_description, tagline, tone, default_terms, default_faq")
      .eq("company_id", companyId)
      .limit(1)
      .single();

    const rateCardContext = (rateCards || []).map((rc) => ({
      name: rc.name,
      items: rc.items || [],
    }));

    const brandContext = brandKit
      ? {
          companyDescription: brandKit.company_description,
          tagline: brandKit.tagline,
          tone: brandKit.tone,
          defaultTerms: brandKit.default_terms,
          defaultFaq: brandKit.default_faq || [],
        }
      : null;

    const systemPrompt = body.mode === "prompt"
      ? buildPromptModeSystemPrompt(brandContext, rateCardContext)
      : buildTranscriptModeSystemPrompt(brandContext, rateCardContext);

    // TODO: Replace with actual AI API call (Anthropic Claude or OpenAI GPT-4o)
    // Use systemPrompt as the system message and body.input as the user message
    const mockResponse = buildMockResponse(body.mode, body.input);

    return NextResponse.json({ data: mockResponse });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
