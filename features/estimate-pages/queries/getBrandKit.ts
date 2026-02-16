import { createClient } from "@/lib/supabase/server";
import type { BrandKit } from "../types";

const BRAND_KIT_FIELDS = "id, company_id, logo_url, favicon_url, primary_color, secondary_color, accent_color, font_family, heading_font, hero_image_url, company_photos, video_intro_url, company_description, tagline, default_terms, default_faq, tone, google_reviews_url, google_rating, google_review_count, certifications, insurance_info, social_links, created_at, updated_at";

export async function getBrandKit(companyId: string): Promise<BrandKit | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("company_brand_kits")
    .select(BRAND_KIT_FIELDS)
    .eq("company_id", companyId)
    .limit(1)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    companyId: data.company_id,
    logoUrl: data.logo_url,
    faviconUrl: data.favicon_url,
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color,
    accentColor: data.accent_color,
    fontFamily: data.font_family,
    headingFont: data.heading_font,
    heroImageUrl: data.hero_image_url,
    companyPhotos: data.company_photos || [],
    videoIntroUrl: data.video_intro_url,
    companyDescription: data.company_description,
    tagline: data.tagline,
    defaultTerms: data.default_terms,
    defaultFaq: data.default_faq || [],
    tone: data.tone,
    googleReviewsUrl: data.google_reviews_url,
    googleRating: data.google_rating,
    googleReviewCount: data.google_review_count,
    certifications: data.certifications || [],
    insuranceInfo: data.insurance_info,
    socialLinks: data.social_links || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
