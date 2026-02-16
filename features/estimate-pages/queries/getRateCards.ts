import { createClient } from "@/lib/supabase/server";
import type { RateCard } from "../types";

const RATE_CARD_FIELDS = "id, company_id, name, category, items, is_active, created_at, updated_at";

export async function getRateCards(companyId: string): Promise<RateCard[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("company_rate_cards")
    .select(RATE_CARD_FIELDS)
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((r) => ({
    id: r.id,
    companyId: r.company_id,
    name: r.name,
    category: r.category,
    items: r.items || [],
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}
