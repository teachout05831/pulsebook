import { createClient } from "@/lib/supabase/server";
import type { AuthContext } from "@/lib/supabase/getAuthContext";

export interface TeamMemberOption {
  id: string;
  name: string;
}

export async function getTeamMemberOptions(auth?: AuthContext): Promise<TeamMemberOption[]> {
  let supabase, companyId;
  if (auth) {
    supabase = auth.supabase;
    companyId = auth.companyId;
  } else {
    supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data: userData } = await supabase.from("users").select("active_company_id").eq("id", user.id).single();
    if (!userData?.active_company_id) throw new Error("No active company");
    companyId = userData.active_company_id;
  }

  const { data, error } = await supabase
    .from("team_members")
    .select("id, name")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("name")
    .limit(100);

  if (error) throw error;
  return (data || []).map((m) => ({ id: m.id, name: m.name }));
}
