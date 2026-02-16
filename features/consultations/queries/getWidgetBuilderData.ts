import { createClient } from "@/lib/supabase/server";
import type { BrandKit } from "@/features/estimate-pages/types";
import type { CallWidget } from "../types";

const BRAND_FIELDS = "id, company_id, logo_url, primary_color, secondary_color, accent_color, font_family, heading_font, hero_image_url, company_photos, company_description, tagline, google_rating, google_review_count, certifications, insurance_info, tone, created_at, updated_at";

export async function getWidgetBuilderData(widgetType: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();

  if (!userData?.active_company_id) throw new Error("No active company");

  const [{ data: settings }, { data: bk }] = await Promise.all([
    supabase.from("consultation_settings")
      .select("widgets")
      .eq("company_id", userData.active_company_id)
      .limit(1).single(),
    supabase.from("company_brand_kits")
      .select(BRAND_FIELDS)
      .eq("company_id", userData.active_company_id)
      .limit(1).single(),
  ]);

  const widgets = (settings?.widgets || []) as CallWidget[];
  const widget = widgets.find((w) => w.type === widgetType) || null;

  const brandKit: BrandKit | null = bk ? {
    id: bk.id,
    companyId: bk.company_id,
    logoUrl: bk.logo_url,
    faviconUrl: null,
    primaryColor: bk.primary_color || "#2563eb",
    secondaryColor: bk.secondary_color || "#1e40af",
    accentColor: bk.accent_color || "#f59e0b",
    fontFamily: bk.font_family || "Inter",
    headingFont: bk.heading_font,
    heroImageUrl: bk.hero_image_url,
    companyPhotos: bk.company_photos || [],
    videoIntroUrl: null,
    companyDescription: bk.company_description,
    tagline: bk.tagline,
    defaultTerms: null,
    defaultFaq: [],
    tone: bk.tone || "professional",
    googleReviewsUrl: null,
    googleRating: bk.google_rating,
    googleReviewCount: bk.google_review_count,
    certifications: bk.certifications || [],
    insuranceInfo: bk.insurance_info,
    socialLinks: {},
    createdAt: bk.created_at,
    updatedAt: bk.updated_at,
  } : null;

  return { widget, brandKit };
}
