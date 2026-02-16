"use server";

import { createClient } from "@/lib/supabase/server";
import { getDefaultContent } from "@/features/estimate-pages/constants/sectionDefaults";
import { DEFAULT_SCHEDULING_SETTINGS } from "../types";

export async function createSchedulingPage(input: { name: string; slug: string }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();

  if (!userData?.active_company_id) return { error: "No active company" };

  if (!input.name || input.name.length < 3) return { error: "Name must be at least 3 characters" };
  if (!input.slug || !/^[a-z0-9-]+$/.test(input.slug)) return { error: "Slug must be lowercase letters, numbers, and hyphens only" };

  // Check slug uniqueness
  const { data: existing } = await supabase
    .from("scheduling_pages")
    .select("id")
    .eq("company_id", userData.active_company_id)
    .eq("slug", input.slug)
    .limit(1)
    .single();

  if (existing) return { error: "A page with this slug already exists" };

  const defaultSections = [
    { id: crypto.randomUUID(), type: "hero", order: 0, visible: true, settings: {}, content: getDefaultContent("hero") },
    { id: crypto.randomUUID(), type: "service_picker", order: 1, visible: true, settings: {}, content: getDefaultContent("service_picker") },
    { id: crypto.randomUUID(), type: "scheduler", order: 2, visible: true, settings: {}, content: getDefaultContent("scheduler") },
    { id: crypto.randomUUID(), type: "booking_form", order: 3, visible: true, settings: {}, content: getDefaultContent("booking_form") },
    { id: crypto.randomUUID(), type: "testimonials", order: 4, visible: true, settings: {}, content: getDefaultContent("testimonials") },
    { id: crypto.randomUUID(), type: "faq", order: 5, visible: true, settings: {}, content: getDefaultContent("faq") },
  ];

  const { data, error } = await supabase
    .from("scheduling_pages")
    .insert({
      company_id: userData.active_company_id,
      name: input.name,
      slug: input.slug,
      public_token: crypto.randomUUID(),
      sections: defaultSections,
      settings: DEFAULT_SCHEDULING_SETTINGS,
      created_by: user.id,
    })
    .select("id, name, slug, public_token, status, created_at")
    .single();

  if (error) return { error: "Failed to create scheduling page" };
  return { success: true, data };
}
