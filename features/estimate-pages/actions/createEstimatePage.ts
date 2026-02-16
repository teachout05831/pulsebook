"use server";

import { createClient } from "@/lib/supabase/server";
import type { CreateEstimatePageInput } from "../types";

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function createEstimatePage(companyId: string, input: CreateEstimatePageInput) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Verify companyId matches user's active company
  const { data: userData } = await supabase.from("users").select("active_company_id").eq("id", user.id).single();
  if (userData?.active_company_id !== companyId) return { error: "Not authorized" };

  if (!input.estimateId) {
    return { error: "Estimate ID is required" };
  }

  // Verify the estimate belongs to this company
  const { data: estimate } = await supabase
    .from("estimates")
    .select("id")
    .eq("id", input.estimateId)
    .eq("company_id", companyId)
    .single();

  if (!estimate) return { error: "Estimate not found" };

  // Generate unique token
  const publicToken = generateToken();

  // Default sections if none provided
  const defaultSections = input.sections || [
    { id: crypto.randomUUID(), type: "hero", order: 1, visible: true, settings: { variant: "clean" }, content: {} },
    { id: crypto.randomUUID(), type: "scope", order: 2, visible: true, settings: { variant: "checklist" }, content: {} },
    { id: crypto.randomUUID(), type: "pricing", order: 3, visible: true, settings: { variant: "detailed" }, content: { useEstimateLineItems: true } },
    { id: crypto.randomUUID(), type: "approval", order: 4, visible: true, settings: {}, content: {} },
    { id: crypto.randomUUID(), type: "contact", order: 5, visible: true, settings: {}, content: {} },
  ];

  const { data, error } = await supabase
    .from("estimate_pages")
    .insert({
      company_id: companyId,
      estimate_id: input.estimateId,
      template_id: input.templateId ?? null,
      public_token: publicToken,
      sections: defaultSections,
      design_theme: input.designTheme ?? {},
      status: "draft",
      created_by: user.id,
    })
    .select("id, public_token")
    .single();

  if (error) return { error: "Failed to create estimate page" };
  return { success: true, data };
}
