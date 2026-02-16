"use server";

import { createClient } from "@/lib/supabase/server";
import type { AnalyticsEventType } from "../types";

interface RecordEventInput {
  pageId: string;
  eventType: AnalyticsEventType;
  eventData?: Record<string, unknown>;
  deviceType?: string;
  referrer?: string;
}

/**
 * Record an analytics event on an estimate page.
 * Called from the public page — no auth required.
 */
export async function recordAnalyticEvent(input: RecordEventInput) {
  const supabase = await createClient();

  if (!input.pageId || !input.eventType) {
    return { error: "Missing required fields" };
  }

  const { error } = await supabase
    .from("estimate_page_analytics")
    .insert({
      page_id: input.pageId,
      event_type: input.eventType,
      event_data: input.eventData ?? null,
      device_type: input.deviceType ?? null,
      referrer: input.referrer ?? null,
    });

  if (error) return { error: "Failed to record event" };
  return { success: true };
}
