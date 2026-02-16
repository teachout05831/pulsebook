import { createClient } from "@/lib/supabase/server";

const SELECT_FIELDS = "id, company_id, name, slug, public_token, status, is_active, published_at, total_views, total_bookings, created_at, updated_at";

export async function getSchedulingPages() {
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
    .from("scheduling_pages")
    .select(SELECT_FIELDS)
    .eq("company_id", userData.active_company_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}
