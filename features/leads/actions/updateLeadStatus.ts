"use server";

import { createClient } from "@/lib/supabase/server";
import type { LeadStatus, CustomerStatus } from "@/types/customer";

interface UpdateLeadStatusResult {
  success?: boolean;
  error?: string;
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus
): Promise<UpdateLeadStatusResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Validate input
  if (!leadId) {
    return { error: "Lead ID is required" };
  }

  const validStatuses: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];
  if (!validStatuses.includes(newStatus)) {
    return { error: "Invalid lead status" };
  }

  // If status is 'won', convert to active customer
  const updateData: Record<string, unknown> = {
    lead_status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === "won") {
    updateData.status = "active" as CustomerStatus;
  }

  const { error } = await supabase
    .from("customers")
    .update(updateData)
    .eq("id", leadId)
    .eq("status", "lead");

  if (error) {
    console.error("Update lead status error:", error);
    return { error: "Failed to update lead status" };
  }

  return { success: true };
}
