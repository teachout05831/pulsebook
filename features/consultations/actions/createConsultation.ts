"use server";

import { createClient } from "@/lib/supabase/server";
import type { CreateConsultationInput } from "../types";

const RESULT_FIELDS = "id, public_token, title, purpose, status, daily_room_name, daily_room_url, customer_name, host_name, created_at";

export async function createConsultation(input: CreateConsultationInput, companyId: string, hostUserId: string, hostName: string) {
  const supabase = await createClient();

  const publicToken = crypto.randomUUID();

  const { data, error } = await supabase
    .from("consultations")
    .insert({
      company_id: companyId,
      customer_id: input.customerId || null,
      estimate_id: input.estimateId || null,
      title: input.title || "Video Consultation",
      purpose: input.purpose || "discovery",
      public_token: publicToken,
      status: "pending",
      scheduled_at: input.scheduledAt || null,
      host_user_id: hostUserId,
      host_name: hostName,
    })
    .select(RESULT_FIELDS)
    .single();

  if (error) return { error: "Failed to create consultation" };
  return { success: true as const, data };
}
