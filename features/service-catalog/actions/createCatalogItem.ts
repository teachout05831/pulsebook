"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateInput {
  name: string;
  description?: string | null;
  category: string;
  pricing_model: string;
  default_price: number;
  unit_label?: string | null;
  is_taxable?: boolean;
}

export async function createCatalogItem(input: CreateInput) {
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
    return { error: "Service name is required" };
  }
  if (input.default_price < 0) {
    return { error: "Price cannot be negative" };
  }

  const { data, error } = await supabase
    .from("service_catalog")
    .insert({
      company_id: userData.active_company_id,
      name: input.name.trim(),
      description: input.description || null,
      category: input.category || "primary",
      pricing_model: input.pricing_model || "flat",
      default_price: input.default_price || 0,
      unit_label: input.unit_label || null,
      is_taxable: input.is_taxable ?? true,
    })
    .select("id, company_id, name, description, category, pricing_model, default_price, unit_label, is_taxable, is_active, sort_order, created_at, updated_at")
    .single();

  if (error) return { error: "Failed to create service" };
  return { success: true, data };
}
