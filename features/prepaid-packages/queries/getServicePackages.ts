import { createClient } from "@/lib/supabase/server";

const FIELDS = "id, company_id, name, visit_count, total_price, per_visit_price, discount_percent, is_active, created_at";

export async function getServicePackages() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) throw new Error("No active company");

  const { data, error } = await supabase
    .from("service_packages")
    .select(FIELDS)
    .eq("company_id", userData.active_company_id)
    .order("name")
    .limit(100);

  if (error) throw new Error(error.message || "Failed to load service packages");
  return data || [];
}
