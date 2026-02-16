import { createClient } from "@/lib/supabase/server";
import { syncUniversalBlocks } from "@/lib/utils/syncUniversalBlocks";
import type { SectionType } from "../types";

const PAGE_FIELDS = "id, company_id, estimate_id, is_active, expires_at, sections, design_theme, status, published_at, allow_video_call, allow_scheduling, allow_chat, allow_instant_approval, require_deposit, deposit_amount, deposit_type, incentive_config";
const ESTIMATE_FIELDS = "estimate_number, total, subtotal, tax_rate, tax_amount, line_items, pricing_model, resources, customers(name, email, phone)";
const BRAND_FIELDS = "logo_url, primary_color, secondary_color, accent_color, font_family, heading_font, company_description, tagline, company_photos, google_rating, google_review_count, certifications, insurance_info, social_links, hero_image_url";

export async function getPublicPageData(token: string) {
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("estimate_pages")
    .select(PAGE_FIELDS)
    .eq("public_token", token)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!page) return null;
  if (page.expires_at && new Date(page.expires_at) < new Date()) return null;

  const [{ data: est }, { data: bk }] = await Promise.all([
    supabase.from("estimates").select(ESTIMATE_FIELDS).eq("id", page.estimate_id).limit(1).single(),
    supabase.from("company_brand_kits").select(BRAND_FIELDS).eq("company_id", page.company_id).limit(1).single(),
  ]);

  const cust = est?.customers ? (Array.isArray(est.customers) ? est.customers[0] : est.customers) : null;

  const rawSections = ((page.sections || []) as { id: string; type: string; order: number; visible: boolean; settings: Record<string, unknown>; content: Record<string, unknown>; [key: string]: unknown }[])
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ ...s, type: s.type as SectionType }));
  const sections = await syncUniversalBlocks(rawSections, page.company_id as string);

  return {
    pageId: page.id as string,
    sections,
    designTheme: (page.design_theme || {}) as Record<string, string>,
    incentiveConfig: page.incentive_config || null,
    publishedAt: (page.published_at as string) || null,
    expiresAt: (page.expires_at as string) || null,
    status: page.status as string,
    estimate: est ? {
      estimateNumber: est.estimate_number, total: est.total, subtotal: est.subtotal,
      taxRate: est.tax_rate, taxAmount: est.tax_amount, lineItems: est.line_items || [],
      pricingModel: est.pricing_model as string | undefined,
      resources: (est.resources as Record<string, unknown>) || {},
    } : null,
    customer: cust ? { name: cust.name, email: cust.email, phone: cust.phone } : null,
    brandKit: bk ? {
      logoUrl: bk.logo_url, primaryColor: bk.primary_color, secondaryColor: bk.secondary_color,
      accentColor: bk.accent_color, fontFamily: bk.font_family, headingFont: bk.heading_font,
      companyDescription: bk.company_description, tagline: bk.tagline,
      companyPhotos: bk.company_photos || [], googleRating: bk.google_rating,
      googleReviewCount: bk.google_review_count, certifications: bk.certifications || [],
      insuranceInfo: bk.insurance_info, socialLinks: bk.social_links || {},
      heroImageUrl: bk.hero_image_url,
    } : null,
    settings: {
      allowVideoCall: page.allow_video_call as boolean,
      allowScheduling: page.allow_scheduling as boolean,
      allowChat: page.allow_chat as boolean,
      allowInstantApproval: page.allow_instant_approval as boolean,
      requireDeposit: page.require_deposit as boolean,
      depositAmount: page.deposit_amount as number | null,
      depositType: (page.deposit_type as string) || "flat",
    },
  };
}
