import { createClient } from "@/lib/supabase/server";
import type { AuthContext } from "@/lib/supabase/getAuthContext";

const CREW_FIELDS =
  "id, company_id, name, color, vehicle_name, lead_member_id, is_active, sort_order, created_at, updated_at";
const MEMBER_FIELDS =
  "id, crew_id, team_member_id, is_default, created_at";

export async function getCrews(auth?: AuthContext) {
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

  const { data: crews, error } = await supabase
    .from("crews")
    .select(CREW_FIELDS)
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("sort_order")
    .limit(50);

  if (error) throw error;

  const crewIds = (crews || []).map((c) => c.id);
  if (crewIds.length === 0) return { crews: [], members: [] };

  const { data: members, error: membersError } = await supabase
    .from("crew_members")
    .select(`${MEMBER_FIELDS}, team_members(id, name, role)`)
    .in("crew_id", crewIds)
    .limit(200);

  if (membersError) throw membersError;

  return { crews: crews || [], members: members || [] };
}
