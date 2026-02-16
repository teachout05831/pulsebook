"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteCrew(crewId: string) {
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

  if (!crewId) return { error: "Crew ID is required" };

  // Ownership check
  const { data: existing } = await supabase
    .from("crews")
    .select("company_id")
    .eq("id", crewId)
    .single();
  if (!existing) return { error: "Crew not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  // Unlink jobs assigned to this crew before deletion
  await supabase
    .from("jobs")
    .update({ assigned_crew_id: null })
    .eq("assigned_crew_id", crewId)
    .eq("company_id", userData.active_company_id);

  // Remove crew members
  await supabase.from("crew_members").delete().eq("crew_id", crewId);

  const { error } = await supabase.from("crews").delete().eq("id", crewId);

  if (error) return { error: "Failed to delete crew" };
  return { success: true };
}
