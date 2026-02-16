import { createClient } from "@/lib/supabase/server";
import { syncUniversalBlocks } from "@/lib/utils/syncUniversalBlocks";
import type { PublicConsultationData, ConsultationStatus } from "../types";

const PUBLIC_FIELDS = "id, title, purpose, status, host_name, customer_name, daily_room_url, scheduled_at, company_id, expires_at";
const BRAND_FIELDS = "logo_url, primary_color, secondary_color, accent_color, google_rating, google_review_count, certifications, company_photos, before_after_photos, testimonials, company_description, years_in_business, insurance_info";
const COMPANY_FIELDS = "name";
const SETTINGS_FIELDS = "widgets, show_trust_signals, show_portfolio";

export async function getPublicConsultation(token: string): Promise<PublicConsultationData | null> {
  const supabase = await createClient();

  const { data: consultation } = await supabase
    .from("consultations")
    .select(PUBLIC_FIELDS)
    .eq("public_token", token)
    .limit(1)
    .single();

  if (!consultation) return null;

  if (consultation.expires_at && new Date(consultation.expires_at) < new Date()) {
    return null;
  }

  // Fetch company, brand kit, and consultation settings in parallel
  const [{ data: company }, { data: brandKit }, { data: settings }] = await Promise.all([
    supabase.from("companies").select(COMPANY_FIELDS).eq("id", consultation.company_id).limit(1).single(),
    supabase.from("company_brand_kits").select(BRAND_FIELDS).eq("company_id", consultation.company_id).limit(1).single(),
    supabase.from("consultation_settings").select(SETTINGS_FIELDS).eq("company_id", consultation.company_id).limit(1).single(),
  ]);

  return {
    id: consultation.id as string,
    title: consultation.title as string,
    purpose: consultation.purpose as string | null,
    status: consultation.status as ConsultationStatus,
    hostName: consultation.host_name as string,
    customerName: consultation.customer_name as string | null,
    dailyRoomUrl: consultation.daily_room_url as string | null,
    scheduledAt: consultation.scheduled_at as string | null,
    companyName: company?.name || "Company",
    brandKit: brandKit ? {
      logoUrl: brandKit.logo_url as string | null,
      primaryColor: (brandKit.primary_color as string) || "#2563eb",
      secondaryColor: (brandKit.secondary_color as string) || "#1e40af",
      accentColor: (brandKit.accent_color as string) || "#f59e0b",
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    widgets: await Promise.all(
      ((settings?.widgets as PublicConsultationData["widgets"]) || []).map(async (w) => {
        if (!w.sections || w.sections.length === 0) return w;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...w, sections: await syncUniversalBlocks(w.sections as any[], consultation.company_id as string) };
      })
    ) as PublicConsultationData["widgets"],
  };
}
