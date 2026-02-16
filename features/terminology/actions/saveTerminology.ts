"use server";

import { createClient } from "@/lib/supabase/server";
import type { TerminologySettings } from "@/types/company";

export async function saveTerminology(terminology: TerminologySettings) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();

  if (!userData?.active_company_id) return { error: "No active company" };

  for (const [key, val] of Object.entries(terminology)) {
    const label = val as { singular?: string; plural?: string };
    if (!label.singular?.trim() || !label.plural?.trim()) {
      return { error: `${key}: both singular and plural labels are required` };
    }
  }

  const { data: company } = await supabase
    .from("companies")
    .select("settings")
    .eq("id", userData.active_company_id)
    .single();

  const currentSettings = (company?.settings as Record<string, unknown>) || {};
  const updatedSettings = { ...currentSettings, terminology };

  const { error } = await supabase
    .from("companies")
    .update({ settings: updatedSettings })
    .eq("id", userData.active_company_id);

  if (error) return { error: "Failed to save terminology" };
  return { success: true };
}
