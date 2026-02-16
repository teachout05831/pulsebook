import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const RATE_CARD_FIELDS = "id, company_id, name, category, items, is_active, created_at, updated_at";

// PATCH /api/rate-cards/[id] - Update a rate card
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    // Ownership check
    const { data: existing } = await supabase
      .from("company_rate_cards")
      .select("id")
      .eq("id", id)
      .eq("company_id", companyId)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Rate card not found" }, { status: 404 });
    }

    const body = await request.json();

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (body.name !== undefined) payload.name = body.name;
    if (body.category !== undefined) payload.category = body.category;
    if (body.items !== undefined) payload.items = body.items;
    if (body.isActive !== undefined) payload.is_active = body.isActive;

    const { data, error } = await supabase
      .from("company_rate_cards")
      .update(payload)
      .eq("id", id)
      .select(RATE_CARD_FIELDS)
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update rate card" }, { status: 500 });
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

    return NextResponse.json({ data: rateCard });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// DELETE /api/rate-cards/[id] - Delete a rate card
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { companyId, supabase } = await getAuthCompany();

    const { error } = await supabase
      .from("company_rate_cards")
      .delete()
      .eq("id", id)
      .eq("company_id", companyId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete rate card" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
