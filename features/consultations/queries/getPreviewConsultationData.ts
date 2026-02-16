import { createClient } from "@/lib/supabase/server";
import type { PreviewConsultationData } from "../types";

const BRAND_FIELDS = "logo_url, primary_color, google_rating, google_review_count, certifications, company_photos, before_after_photos, testimonials, company_description, years_in_business, insurance_info";
const SETTINGS_FIELDS = "widgets, default_title";

export async function getPreviewConsultationData(): Promise<PreviewConsultationData | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id, full_name")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (!userData?.active_company_id) throw new Error("No active company");
  const companyId = userData.active_company_id as string;
  const hostName = (userData.full_name as string) || "Host";

  const [{ data: company }, { data: brandKit }, { data: settings }] = await Promise.all([
    supabase.from("companies").select("name").eq("id", companyId).limit(1).single(),
    supabase.from("company_brand_kits").select(BRAND_FIELDS).eq("company_id", companyId).limit(1).single(),
    supabase.from("consultation_settings").select(SETTINGS_FIELDS).eq("company_id", companyId).limit(1).single(),
  ]);

  const primaryColor = (brandKit?.primary_color as string) || "#2563eb";

  return {
    companyName: (company?.name as string) || "Company",
    logoUrl: (brandKit?.logo_url as string) ?? null,
    primaryColor,
    hostName,
    defaultTitle: (settings?.default_title as string) || "Video Consultation",
    brandKit: brandKit ? {
      logoUrl: brandKit.logo_url as string | null,
      primaryColor,
      googleRating: (brandKit.google_rating as number) ?? null,
      googleReviewCount: (brandKit.google_review_count as number) ?? null,
      certifications: (brandKit.certifications as string[]) || [],
      companyPhotos: (brandKit.company_photos as string[]) || [],
      beforeAfterPhotos: (brandKit.before_after_photos as { before: string; after: string; label?: string }[]) || [],
      testimonials: (brandKit.testimonials as { quote: string; author: string; role?: string }[]) || [],
      companyDescription: (brandKit.company_description as string) ?? null,
      yearsInBusiness: (brandKit.years_in_business as number) ?? null,
      insuranceInfo: (brandKit.insurance_info as string) ?? null,
    } : null,
    widgets: (settings?.widgets as PreviewConsultationData["widgets"]) || [],
  };
}
