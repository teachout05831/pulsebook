"use server";

import { createClient } from "@/lib/supabase/server";
import type { RateCardInput } from "../types";

export async function createRateCard(companyId: string, input: RateCardInput) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!input.name || input.name.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }

  const { data, error } = await supabase
    .from("company_rate_cards")
    .insert({
      company_id: companyId,
      name: input.name,
      category: input.category ?? null,
      items: input.items || [],
      is_active: input.isActive ?? true,
    })
    .select("id")
    .single();

  if (error) return { error: "Failed to create rate card" };
  return { success: true, data };
}

export async function updateRateCard(rateCardId: string, companyId: string, input: RateCardInput) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Ownership check
  const { data: existing } = await supabase
    .from("company_rate_cards")
    .select("id")
    .eq("id", rateCardId)
    .eq("company_id", companyId)
    .single();

  if (!existing) return { error: "Rate card not found" };

  const { error } = await supabase
    .from("company_rate_cards")
    .update({
      name: input.name,
      category: input.category ?? null,
      items: input.items || [],
      is_active: input.isActive ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", rateCardId);

  if (error) return { error: "Failed to update rate card" };
  return { success: true };
}

export async function deleteRateCard(rateCardId: string, companyId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("company_rate_cards")
    .delete()
    .eq("id", rateCardId)
    .eq("company_id", companyId);

  if (error) return { error: "Failed to delete rate card" };
  return { success: true };
}
