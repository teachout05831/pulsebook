"use server";

import { createClient } from "@/lib/supabase/server";

interface UpdateCrewInput {
  name?: string;
  color?: string;
  vehicle_name?: string | null;
  lead_member_id?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export async function updateCrew(crewId: string, input: UpdateCrewInput) {
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

  if (input.name !== undefined && input.name.trim().length < 1) {
    return { error: "Crew name is required" };
  }

  const { data, error } = await supabase
    .from("crews")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", crewId)
    .select("id, company_id, name, color, vehicle_name, lead_member_id, is_active, sort_order, created_at, updated_at")
    .single();

  if (error) return { error: "Failed to update crew" };
  return { success: true, data };
}
