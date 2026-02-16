"use server";

import { createClient } from "@/lib/supabase/server";
import type { UpdateEstimatePageInput } from "../types";

export async function updateEstimatePage(pageId: string, companyId: string, input: UpdateEstimatePageInput) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify companyId matches user's active company
  const { data: userData } = await supabase.from("users").select("active_company_id").eq("id", user.id).single();
  if (userData?.active_company_id !== companyId) return { error: "Not authorized" };

  // Ownership check
  const { data: existing } = await supabase
    .from("estimate_pages")
    .select("id")
    .eq("id", pageId)
    .eq("company_id", companyId)
    .single();

  if (!existing) return { error: "Page not found" };

  // Build update payload (only include provided fields)
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.sections !== undefined) payload.sections = input.sections;
  if (input.designTheme !== undefined) payload.design_theme = input.designTheme;
  if (input.brandOverrides !== undefined) payload.brand_overrides = input.brandOverrides;
  if (input.allowVideoCall !== undefined) payload.allow_video_call = input.allowVideoCall;
  if (input.allowScheduling !== undefined) payload.allow_scheduling = input.allowScheduling;
  if (input.allowChat !== undefined) payload.allow_chat = input.allowChat;
  if (input.allowInstantApproval !== undefined) payload.allow_instant_approval = input.allowInstantApproval;
  if (input.requireDeposit !== undefined) payload.require_deposit = input.requireDeposit;
  if (input.depositAmount !== undefined) payload.deposit_amount = input.depositAmount;
  if (input.depositType !== undefined) payload.deposit_type = input.depositType;
  if (input.paymentPlans !== undefined) payload.payment_plans = input.paymentPlans;
  if (input.expiresAt !== undefined) payload.expires_at = input.expiresAt;

  const { error } = await supabase
    .from("estimate_pages")
    .update(payload)
    .eq("id", pageId);

  if (error) return { error: "Failed to update page" };
  return { success: true };
}
