import { createClient } from "@/lib/supabase/server";
import type { EstimatePage } from "../types";
import { transformPage } from "./getEstimatePages";

/**
 * Fetch an estimate page by its public token.
 * No auth required — this is for the customer-facing page.
 * Validates that the page is active and not expired.
 */
export async function getPublicPage(token: string): Promise<EstimatePage | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estimate_pages")
    .select("id, company_id, estimate_id, template_id, public_token, is_active, expires_at, sections, design_theme, brand_overrides, allow_video_call, allow_scheduling, allow_chat, allow_instant_approval, require_deposit, deposit_amount, deposit_type, payment_plans, status, published_at, first_viewed_at, last_viewed_at, approved_at, declined_at, created_by, created_at, updated_at")
    .eq("public_token", token)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (error || !data) return null;

  // Check expiration
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null;
  }

  return transformPage(data);
}
