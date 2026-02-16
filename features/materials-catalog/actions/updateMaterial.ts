"use server";

import { createClient } from "@/lib/supabase/server";

interface UpdateInput {
  name?: string;
  description?: string | null;
  unit_price?: number;
  unit_label?: string;
  sku?: string | null;
  is_taxable?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export async function updateMaterial(id: string, input: UpdateInput) {
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
    .from("materials_catalog")
    .select("company_id")
    .eq("id", id)
    .single();

  if (!existing) return { error: "Material not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  if (input.name !== undefined && input.name.trim().length < 1) {
    return { error: "Material name is required" };
  }
  if (input.unit_price !== undefined && input.unit_price < 0) {
    return { error: "Price cannot be negative" };
  }

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updateData.name = input.name.trim();
  if (input.description !== undefined) updateData.description = input.description;
  if (input.unit_price !== undefined) updateData.unit_price = input.unit_price;
  if (input.unit_label !== undefined) updateData.unit_label = input.unit_label;
  if (input.sku !== undefined) updateData.sku = input.sku;
  if (input.is_taxable !== undefined) updateData.is_taxable = input.is_taxable;
  if (input.is_active !== undefined) updateData.is_active = input.is_active;
  if (input.sort_order !== undefined) updateData.sort_order = input.sort_order;

  const { data, error } = await supabase
    .from("materials_catalog")
    .update(updateData)
    .eq("id", id)
    .select("id, company_id, name, description, unit_price, unit_label, sku, is_taxable, is_active, sort_order, created_at, updated_at")
    .single();

  if (error) return { error: "Failed to update material" };
  return { success: true, data };
}
