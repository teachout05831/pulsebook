import { createClient } from "@/lib/supabase/server";
import { syncUniversalBlocks } from "@/lib/utils/syncUniversalBlocks";

const PAGE_FIELDS = "id, company_id, name, slug, sections, design_theme, settings, status";
const BRAND_FIELDS = "logo_url, primary_color, secondary_color, accent_color, font_family";

export async function getPublicSchedulingPage(token: string) {
  const supabase = await createClient();

  const { data: page, error } = await supabase
    .from("scheduling_pages")
    .select(PAGE_FIELDS)
    .eq("public_token", token)
    .eq("status", "published")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (error || !page) return null;

  const [{ data: company }, { data: bk }, { data: services }, { data: teamMembers }] = await Promise.all([
    supabase.from("companies")
      .select("name")
      .eq("id", page.company_id)
      .limit(1).single(),
    supabase.from("company_brand_kits")
      .select(BRAND_FIELDS)
      .eq("company_id", page.company_id)
      .limit(1).single(),
    supabase.from("service_types")
      .select("id, name, description, default_price, duration_minutes")
      .eq("company_id", page.company_id)
      .eq("is_active", true)
      .limit(50),
    supabase.from("team_members")
      .select("id, name, role, color")
      .eq("company_id", page.company_id)
      .eq("is_active", true)
      .limit(50),
  ]);

  // Increment view count (fire-and-forget)
  supabase.rpc("increment_scheduling_page_views", { page_id: page.id }).then(() => {});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections = await syncUniversalBlocks((page.sections || []) as any[], page.company_id as string);

  return {
    id: page.id,
    name: page.name,
    slug: page.slug,
    sections,
    designTheme: page.design_theme || {},
    settings: page.settings || {},
    status: page.status,
    companyName: company?.name || "",
    brandKit: bk ? {
      logoUrl: bk.logo_url,
      primaryColor: bk.primary_color || "#2563eb",
      secondaryColor: bk.secondary_color,
      accentColor: bk.accent_color,
      fontFamily: bk.font_family,
    } : null,
    services: (services || []).map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description || "",
      defaultPrice: s.default_price,
      durationMinutes: s.duration_minutes || 60,
    })),
    teamMembers: (teamMembers || []).map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      color: t.color,
    })),
  };
}
