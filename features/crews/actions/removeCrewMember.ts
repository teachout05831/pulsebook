"use server";

import { createClient } from "@/lib/supabase/server";

export async function removeCrewMember(crewId: string, teamMemberId: string) {
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

  if (!crewId || !teamMemberId) return { error: "Crew ID and member ID required" };

  // Ownership check on crew
  const { data: crew } = await supabase
    .from("crews")
    .select("company_id")
    .eq("id", crewId)
    .single();
  if (!crew) return { error: "Crew not found" };
  if (crew.company_id !== userData.active_company_id) return { error: "Not authorized" };

  // Verify team member belongs to same company
  const { data: member } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("id", teamMemberId)
    .single();
  if (!member) return { error: "Team member not found" };
  if (member.company_id !== userData.active_company_id) return { error: "Not authorized" };

  const { error } = await supabase
    .from("crew_members")
    .delete()
    .eq("crew_id", crewId)
    .eq("team_member_id", teamMemberId);

  if (error) return { error: "Failed to remove member" };
  return { success: true };
}
