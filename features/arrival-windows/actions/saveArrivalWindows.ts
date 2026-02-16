"use server";

import { createClient } from "@/lib/supabase/server";
import type { ArrivalWindow } from "@/types/company";

export async function saveArrivalWindows(windows: ArrivalWindow[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .limit(1)
    .single();
  if (!profile?.active_company_id) return { error: "No active company" };

  for (const w of windows) {
    if (!w.id || !w.label.trim() || !w.startTime || !w.endTime) {
      return { error: "Each window must have a label, start time, and end time" };
    }
  }

  const { data: company } = await supabase
    .from("companies")
    .select("settings")
    .eq("id", profile.active_company_id)
    .limit(1)
    .single();

  const currentSettings = (company?.settings as Record<string, unknown>) || {};
  const updatedSettings = { ...currentSettings, arrivalWindows: windows };

  const { error } = await supabase
    .from("companies")
    .update({ settings: updatedSettings })
    .eq("id", profile.active_company_id);

  if (error) return { error: "Failed to save arrival windows" };
  return { success: true };
}
