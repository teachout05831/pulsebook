import { createClient } from "@/lib/supabase/server";
import type { GhlIntegrationSettings } from "../types";
import { DEFAULT_GHL_SETTINGS } from "../types";

const FIELDS =
  "id, ghl_enabled, ghl_api_token, ghl_location_id, ghl_sync_new_leads, ghl_sync_job_booked, ghl_sync_lead_lost, ghl_sync_status_changes, ghl_default_tags";

export async function getIntegrationSettings(): Promise<GhlIntegrationSettings> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (!userData?.active_company_id) throw new Error("No active company");

  const { data, error } = await supabase
    .from("integration_settings")
    .select(FIELDS)
    .eq("company_id", userData.active_company_id)
    .limit(1)
    .single();

  if (error || !data) return DEFAULT_GHL_SETTINGS;

  return {
    id: data.id,
    ghlEnabled: data.ghl_enabled,
    ghlApiToken: data.ghl_api_token || "",
    ghlLocationId: data.ghl_location_id || "",
    ghlSyncNewLeads: data.ghl_sync_new_leads,
    ghlSyncJobBooked: data.ghl_sync_job_booked,
    ghlSyncLeadLost: data.ghl_sync_lead_lost,
    ghlSyncStatusChanges: data.ghl_sync_status_changes,
    ghlDefaultTags: data.ghl_default_tags || [],
  };
}
