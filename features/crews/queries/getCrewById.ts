import { createClient } from "@/lib/supabase/server";

const CREW_FIELDS =
  "id, company_id, name, color, vehicle_name, lead_member_id, is_active, sort_order, created_at, updated_at";

export async function getCrewById(crewId: string) {
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

  const { data: crew, error } = await supabase
    .from("crews")
    .select(CREW_FIELDS)
    .eq("id", crewId)
    .eq("company_id", userData.active_company_id)
    .single();

  if (error) throw error;
  if (!crew) throw new Error("Crew not found");

  const { data: members, error: membersError } = await supabase
    .from("crew_members")
    .select("id, crew_id, team_member_id, is_default, created_at, team_members(id, name, role)")
    .eq("crew_id", crewId)
    .limit(50);

  if (membersError) throw membersError;

  return { crew, members: members || [] };
}
