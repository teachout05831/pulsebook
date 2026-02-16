"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateInput {
  name: string;
  description?: string | null;
  unit_price: number;
  unit_label?: string;
  sku?: string | null;
  is_taxable?: boolean;
}

export async function createMaterial(input: CreateInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) return { error: "No active company" };

  if (!input.name || input.name.trim().length < 1) {
    return { error: "Material name is required" };
  }
  if (input.unit_price < 0) {
    return { error: "Price cannot be negative" };
  }

  const { data, error } = await supabase
    .from("materials_catalog")
    .insert({
      company_id: userData.active_company_id,
      name: input.name.trim(),
      description: input.description || null,
      unit_price: input.unit_price || 0,
      unit_label: input.unit_label || "each",
      sku: input.sku || null,
      is_taxable: input.is_taxable ?? true,
    })
    .select("id, company_id, name, description, unit_price, unit_label, sku, is_taxable, is_active, sort_order, created_at, updated_at")
    .single();

  if (error) return { error: "Failed to create material" };
  return { success: true, data };
}
