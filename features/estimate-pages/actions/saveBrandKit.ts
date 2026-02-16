"use server";

import { createClient } from "@/lib/supabase/server";
import type { BrandKitInput } from "../types";

export async function saveBrandKit(companyId: string, input: BrandKitInput) {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify companyId matches user's active company
  const { data: userData } = await supabase.from("users").select("active_company_id").eq("id", user.id).single();
  if (userData?.active_company_id !== companyId) return { error: "Not authorized" };

  // Build snake_case payload
  const payload = {
    company_id: companyId,
    logo_url: input.logoUrl ?? null,
    favicon_url: input.faviconUrl ?? null,
    primary_color: input.primaryColor ?? "#2563eb",
    secondary_color: input.secondaryColor ?? "#1e40af",
    accent_color: input.accentColor ?? "#f59e0b",
    font_family: input.fontFamily ?? "Inter",
    heading_font: input.headingFont ?? null,
    hero_image_url: input.heroImageUrl ?? null,
    company_photos: input.companyPhotos ?? [],
    video_intro_url: input.videoIntroUrl ?? null,
    company_description: input.companyDescription ?? null,
    tagline: input.tagline ?? null,
    default_terms: input.defaultTerms ?? null,
    default_faq: input.defaultFaq ?? [],
    tone: input.tone ?? "friendly",
    google_reviews_url: input.googleReviewsUrl ?? null,
    google_rating: input.googleRating ?? null,
    google_review_count: input.googleReviewCount ?? null,
    certifications: input.certifications ?? [],
    insurance_info: input.insuranceInfo ?? null,
    social_links: input.socialLinks ?? {},
    updated_at: new Date().toISOString(),
  };

  // Upsert (one brand kit per company)
  const { data, error } = await supabase
    .from("company_brand_kits")
    .upsert(payload, { onConflict: "company_id" })
    .select("id")
    .single();

  if (error) return { error: "Failed to save brand kit" };
  return { success: true, data };
}
