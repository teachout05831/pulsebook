import { createClient } from "@/lib/supabase/server";

const ROSTER_FIELDS =
  "id, company_id, crew_id, roster_date, team_member_id, is_present, is_fill_in, created_at";

export async function getDailyRoster(date: string) {
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

  const { data: roster, error } = await supabase
    .from("daily_rosters")
    .select(`${ROSTER_FIELDS}, team_members(id, name, role)`)
    .eq("company_id", userData.active_company_id)
    .eq("roster_date", date)
    .limit(200);

  if (error) throw error;
  return roster || [];
}
