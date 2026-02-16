"use server";

import { createClient } from "@/lib/supabase/server";

interface UpdateInput {
  name?: string;
  description?: string | null;
  category?: string;
  pricing_model?: string;
  default_price?: number;
  unit_label?: string | null;
  is_taxable?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export async function updateCatalogItem(id: string, input: UpdateInput) {
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

  const { data: existing } = await supabase
    .from("service_catalog")
    .select("company_id")
    .eq("id", id)
    .single();

  if (!existing) return { error: "Service not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  if (input.name !== undefined && input.name.trim().length < 1) {
    return { error: "Service name is required" };
  }
  if (input.default_price !== undefined && input.default_price < 0) {
    return { error: "Price cannot be negative" };
  }

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updateData.name = input.name.trim();
  if (input.description !== undefined) updateData.description = input.description;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.pricing_model !== undefined) updateData.pricing_model = input.pricing_model;
  if (input.default_price !== undefined) updateData.default_price = input.default_price;
  if (input.unit_label !== undefined) updateData.unit_label = input.unit_label;
  if (input.is_taxable !== undefined) updateData.is_taxable = input.is_taxable;
  if (input.is_active !== undefined) updateData.is_active = input.is_active;
  if (input.sort_order !== undefined) updateData.sort_order = input.sort_order;

  const { data, error } = await supabase
    .from("service_catalog")
    .update(updateData)
    .eq("id", id)
    .select("id, company_id, name, description, category, pricing_model, default_price, unit_label, is_taxable, is_active, sort_order, created_at, updated_at")
    .single();

  if (error) return { error: "Failed to update service" };
  return { success: true, data };
}
