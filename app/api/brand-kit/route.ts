import { NextRequest, NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

const BRAND_KIT_FIELDS = "id, company_id, logo_url, favicon_url, primary_color, secondary_color, accent_color, font_family, heading_font, hero_image_url, company_photos, video_intro_url, company_description, tagline, default_terms, default_faq, tone, google_reviews_url, google_rating, google_review_count, certifications, insurance_info, social_links, created_at, updated_at";

// GET /api/brand-kit - Get company brand kit
export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const { data, error } = await supabase
      .from("company_brand_kits")
      .select(BRAND_KIT_FIELDS)
      .eq("company_id", companyId)
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ data: null });
    }

    const brandKit = {
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

    return NextResponse.json({ data: brandKit }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// PUT /api/brand-kit - Create or update brand kit
export async function PUT(request: NextRequest) {
  try {
    const { companyId, supabase } = await getAuthCompany();

    const body = await request.json();

    const payload = {
      company_id: companyId,
      logo_url: body.logoUrl ?? null,
      favicon_url: body.faviconUrl ?? null,
      primary_color: body.primaryColor ?? "#2563eb",
      secondary_color: body.secondaryColor ?? "#1e40af",
      accent_color: body.accentColor ?? "#f59e0b",
      font_family: body.fontFamily ?? "Inter",
      heading_font: body.headingFont ?? null,
      hero_image_url: body.heroImageUrl ?? null,
      company_photos: body.companyPhotos ?? [],
      video_intro_url: body.videoIntroUrl ?? null,
      company_description: body.companyDescription ?? null,
      tagline: body.tagline ?? null,
      default_terms: body.defaultTerms ?? null,
      default_faq: body.defaultFaq ?? [],
      tone: body.tone ?? "friendly",
      google_reviews_url: body.googleReviewsUrl ?? null,
      google_rating: body.googleRating ?? null,
      google_review_count: body.googleReviewCount ?? null,
      certifications: body.certifications ?? [],
      insurance_info: body.insuranceInfo ?? null,
      social_links: body.socialLinks ?? {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("company_brand_kits")
      .upsert(payload, { onConflict: "company_id" })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to save brand kit" }, { status: 500 });
    }

    return NextResponse.json({ data: { id: data.id } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
