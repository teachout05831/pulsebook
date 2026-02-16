import type { SupabaseClient } from "@supabase/supabase-js";

export async function getTechCrewIds(
  supabase: SupabaseClient,
  companyId: string,
  teamMemberId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("crew_members")
    .select("crew_id, crews!inner(company_id, is_active)")
    .eq("team_member_id", teamMemberId)
    .eq("crews.company_id", companyId)
    .eq("crews.is_active", true)
    .limit(20);

  if (error) throw error;
  return (data || []).map((row: { crew_id: string }) => row.crew_id);
}
