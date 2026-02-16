import { createClient } from "@/lib/supabase/server";

export interface CrewOption {
  id: string;
  name: string;
  color: string;
}

export async function getCrewOptions(): Promise<CrewOption[]> {
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
    .from("crews")
    .select("id, name, color")
    .eq("company_id", userData.active_company_id)
    .eq("is_active", true)
    .order("sort_order")
    .limit(50);

  if (error) throw error;
  return (data || []) as CrewOption[];
}
