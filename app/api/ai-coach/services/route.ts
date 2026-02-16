import { NextResponse } from "next/server";
import { getAuthCompany, AuthError } from "@/lib/auth/getAuthCompany";

// GET /api/ai-coach/services - Load service + materials catalog for coach
export async function GET() {
  try {
    const { companyId, supabase } = await getAuthCompany();

    // Fetch services and materials in parallel
    const [servicesRes, materialsRes] = await Promise.all([
      supabase
        .from("service_catalog")
        .select("id, name, description, category")
        .eq("company_id", companyId)
        .eq("is_active", true)
        .limit(100),
      supabase
        .from("materials_catalog")
        .select("id, name, description")
        .eq("company_id", companyId)
        .eq("is_active", true)
        .limit(100),
    ]);

    const items: Array<{
      id: string;
      name: string;
      description: string | null;
      category: string;
      keywords: string[];
    }> = [];

    // Transform services to CoachCatalogItem format
    if (servicesRes.data) {
      for (const svc of servicesRes.data) {
        const keywords = generateKeywords(svc.name, svc.description, svc.category);
        items.push({
          id: svc.id,
          name: svc.name,
          description: svc.description,
          category: svc.category || "service",
          keywords,
        });
      }
    }

    // Transform materials to CoachCatalogItem format
    if (materialsRes.data) {
      for (const mat of materialsRes.data) {
        const keywords = generateKeywords(mat.name, mat.description, "material");
        items.push({
          id: mat.id,
          name: mat.name,
          description: mat.description,
          category: "material",
          keywords,
        });
      }
    }

    return NextResponse.json(items, {
      headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" }
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/** Generate keyword list from name + description + category */
function generateKeywords(name: string, description: string | null, category: string): string[] {
  const words = new Set<string>();

  // Add name words (2+ chars)
  name.toLowerCase().split(/\s+/).forEach((w) => {
    if (w.length > 2) words.add(w);
  });

  // Add description words (3+ chars, skip common words)
  if (description) {
    const stopWords = new Set(["the", "and", "for", "with", "this", "that", "from", "are", "was", "will", "has", "have"]);
    description.toLowerCase().split(/\s+/).forEach((w) => {
      const clean = w.replace(/[^a-z]/g, "");
      if (clean.length > 3 && !stopWords.has(clean)) words.add(clean);
    });
  }

  // Add category
  if (category) words.add(category.toLowerCase());

  return Array.from(words);
}
