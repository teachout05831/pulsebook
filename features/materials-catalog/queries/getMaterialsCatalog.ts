import { createClient } from "@/lib/supabase/server";

const FIELDS =
  "id, company_id, name, description, unit_price, unit_label, sku, is_taxable, is_active, sort_order, created_at, updated_at";

export async function getMaterialsCatalog(from = 0, to = 49) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) throw new Error("No active company");

  const { data, error } = await supabase
    .from("materials_catalog")
    .select(FIELDS)
    .eq("company_id", userData.active_company_id)
    .order("sort_order")
    .range(from, to);

  if (error) throw error;
  return data || [];
}
