"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateCrewInput {
  name: string;
  color: string;
  vehicle_name?: string | null;
  lead_member_id?: string | null;
}

export async function createCrew(input: CreateCrewInput) {
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

  if (!input.name || input.name.trim().length < 1) {
    return { error: "Crew name is required" };
  }

  const { data, error } = await supabase
    .from("crews")
    .insert({
      company_id: userData.active_company_id,
      name: input.name.trim(),
      color: input.color || "#3b82f6",
      vehicle_name: input.vehicle_name || null,
      lead_member_id: input.lead_member_id || null,
    })
    .select("id, company_id, name, color, vehicle_name, lead_member_id, is_active, sort_order, created_at, updated_at")
    .single();

  if (error) return { error: "Failed to create crew" };
  return { success: true, data };
}
