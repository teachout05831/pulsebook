import { createClient } from "@/lib/supabase/server";
import type { EstimatePage } from "../types";

const PAGE_FIELDS = "id, company_id, estimate_id, template_id, public_token, is_active, expires_at, sections, design_theme, brand_overrides, allow_video_call, allow_scheduling, allow_chat, allow_instant_approval, require_deposit, deposit_amount, deposit_type, payment_plans, incentive_config, approved_incentive_tier, status, published_at, first_viewed_at, last_viewed_at, approved_at, declined_at, created_by, created_at, updated_at";

function transformPage(p: Record<string, unknown>): EstimatePage {
  return {
    id: p.id as string,
    companyId: p.company_id as string,
    estimateId: p.estimate_id as string,
    templateId: (p.template_id as string) || null,
    publicToken: p.public_token as string,
    isActive: p.is_active as boolean,
    expiresAt: (p.expires_at as string) || null,
    sections: (p.sections as EstimatePage["sections"]) || [],
    designTheme: (p.design_theme as EstimatePage["designTheme"]) || {},
    brandOverrides: (p.brand_overrides as Record<string, unknown>) || null,
    allowVideoCall: p.allow_video_call as boolean,
    allowScheduling: p.allow_scheduling as boolean,
    allowChat: p.allow_chat as boolean,
    allowInstantApproval: p.allow_instant_approval as boolean,
    requireDeposit: p.require_deposit as boolean,
    depositAmount: (p.deposit_amount as number) || null,
    depositType: (p.deposit_type as EstimatePage["depositType"]) || "flat",
    paymentPlans: (p.payment_plans as EstimatePage["paymentPlans"]) || null,
    status: p.status as EstimatePage["status"],
    publishedAt: (p.published_at as string) || null,
    firstViewedAt: (p.first_viewed_at as string) || null,
    lastViewedAt: (p.last_viewed_at as string) || null,
    approvedAt: (p.approved_at as string) || null,
    declinedAt: (p.declined_at as string) || null,
    createdBy: (p.created_by as string) || null,
    incentiveConfig: (p.incentive_config as EstimatePage["incentiveConfig"]) || null,
    approvedIncentiveTier: (p.approved_incentive_tier as EstimatePage["approvedIncentiveTier"]) || null,
    createdAt: p.created_at as string,
    updatedAt: p.updated_at as string,
  };
}

export async function getEstimatePages(companyId: string): Promise<EstimatePage[]> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("estimate_pages")
    .select(PAGE_FIELDS)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map(transformPage);
}

export async function getEstimatePage(pageId: string, companyId: string): Promise<EstimatePage | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("estimate_pages")
    .select(PAGE_FIELDS)
    .eq("id", pageId)
    .eq("company_id", companyId)
    .limit(1)
    .single();

  if (error || !data) return null;

  return transformPage(data);
}

export { transformPage };
