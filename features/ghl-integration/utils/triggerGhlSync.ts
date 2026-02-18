import type { SupabaseClient } from "@supabase/supabase-js";
import type { GhlSyncEvent } from "../types";
import { syncContactToGhl, updateGhlContact } from "./ghlClient";

interface CustomerData {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  ghlContactId?: string | null;
  tags?: string[];
}

const EVENT_TO_SETTING: Record<GhlSyncEvent, string> = {
  lead_created: "ghl_sync_new_leads",
  job_booked: "ghl_sync_job_booked",
  lead_lost: "ghl_sync_lead_lost",
  status_changed: "ghl_sync_status_changes",
};

export async function triggerGhlSync(
  supabase: SupabaseClient,
  companyId: string,
  event: GhlSyncEvent,
  customer: CustomerData
): Promise<void> {
  try {
    const { data: settings } = await supabase
      .from("integration_settings")
      .select(
        "ghl_enabled, ghl_api_token, ghl_location_id, ghl_sync_new_leads, ghl_sync_job_booked, ghl_sync_lead_lost, ghl_sync_status_changes, ghl_default_tags"
      )
      .eq("company_id", companyId)
      .limit(1)
      .single();

    if (!settings?.ghl_enabled) return;
    if (!settings.ghl_api_token || !settings.ghl_location_id) return;

    const settingKey = EVENT_TO_SETTING[event];
    if (!settings[settingKey as keyof typeof settings]) return;

    const allTags = [
      ...(settings.ghl_default_tags || []),
      ...(customer.tags || []),
    ];

    if (customer.ghlContactId) {
      await updateGhlContact({
        apiToken: settings.ghl_api_token,
        ghlContactId: customer.ghlContactId,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        tags: allTags.length > 0 ? allTags : undefined,
      });
    } else {
      const ghlContactId = await syncContactToGhl({
        apiToken: settings.ghl_api_token,
        locationId: settings.ghl_location_id,
        customerName: customer.name,
        email: customer.email,
        phone: customer.phone,
        source: customer.source,
        tags: allTags.length > 0 ? allTags : undefined,
      });

      if (ghlContactId) {
        await supabase
          .from("customers")
          .update({ ghl_contact_id: ghlContactId })
          .eq("id", customer.id);
      }
    }
  } catch (err) {
    console.error("GHL sync failed (non-blocking):", err);
  }
}
