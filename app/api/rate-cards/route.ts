import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const RATE_CARD_FIELDS = "id, company_id, name, category, items, is_active, created_at, updated_at";

// GET /api/rate-cards - List rate cards
export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("company_rate_cards")
      .select(RATE_CARD_FIELDS)
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch rate cards" }, { status: 500 });
    }

    const rateCards = (data || []).map((r) => ({
      id: r.id,
      companyId: r.company_id,
      name: r.name,
      category: r.category,
      items: r.items || [],
      isActive: r.is_active,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json({ data: rateCards, total: rateCards.length }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/rate-cards - Create a rate card
export async function POST(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    if (!body.name || body.name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("company_rate_cards")
      .insert({
        company_id: companyId,
        name: body.name,
        category: body.category ?? null,
        items: body.items || [],
        is_active: body.isActive ?? true,
      })
      .select(RATE_CARD_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to create rate card" }, { status: 500 });
    }

    const rateCard = {
      id: data.id,
      companyId: data.company_id,
      name: data.name,
      category: data.category,
      items: data.items || [],
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json({ data: rateCard }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
