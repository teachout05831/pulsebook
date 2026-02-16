"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateRosterMember(
  crewId: string, date: string, teamMemberId: string, action: "add" | "remove"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase.from("users").select("active_company_id").eq("id", user.id).single();
  if (!userData?.active_company_id) return { error: "No active company" };
  if (!crewId || !date || !teamMemberId) return { error: "Missing required fields" };

  const { data: crew } = await supabase.from("crews").select("company_id").eq("id", crewId).single();
  if (!crew) return { error: "Crew not found" };
  if (crew.company_id !== userData.active_company_id) return { error: "Not authorized" };

  const companyId = userData.active_company_id;
  const { data: existing } = await supabase
    .from("daily_rosters").select("id").eq("crew_id", crewId).eq("roster_date", date).limit(1);

  // If no roster yet, bootstrap from crew_members defaults
  if (!existing || existing.length === 0) {
    const { data: defaults } = await supabase.from("crew_members").select("team_member_id").eq("crew_id", crewId).limit(50);
    if (defaults && defaults.length > 0) {
      const rows = defaults.map((d) => ({
        company_id: companyId, crew_id: crewId, roster_date: date,
        team_member_id: d.team_member_id, is_present: true, is_fill_in: false,
      }));
      await supabase.from("daily_rosters").insert(rows);
    }
  }

  if (action === "add") {
    const { error } = await supabase.from("daily_rosters").upsert(
      {
        company_id: companyId, crew_id: crewId, roster_date: date,
        team_member_id: teamMemberId, is_present: true, is_fill_in: true,
      },
      { onConflict: "crew_id,roster_date,team_member_id" }
    );
    if (error) return { error: "Failed to add member to roster" };
  } else {
    const { error } = await supabase.from("daily_rosters").delete()
      .eq("crew_id", crewId).eq("roster_date", date).eq("team_member_id", teamMemberId);
    if (error) return { error: "Failed to remove member from roster" };
  }

  return { success: true };
}
