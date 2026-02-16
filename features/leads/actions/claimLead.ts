"use server";

import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types/customer";

interface ClaimLeadResult {
  success?: boolean;
  error?: string;
}

export async function claimLead(
  leadId: string,
  assignToTeamMemberId?: string
): Promise<ClaimLeadResult> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!leadId) return { error: "Lead ID is required" };

  // Resolve the team member ID
  let teamMemberId = assignToTeamMemberId;

  if (!teamMemberId) {
    // Look up current user's team member record
    const { data: member } = await supabase
      .from("team_members")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    teamMemberId = member?.id || undefined;
  }

  // Build update payload
  const updatePayload: Record<string, unknown> = {
    lead_status: "contacted" as LeadStatus,
    last_contact_date: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (teamMemberId) {
    updatePayload.assigned_to = teamMemberId;
  }

  const { error } = await supabase
    .from("customers")
    .update(updatePayload)
    .eq("id", leadId)
    .eq("status", "lead")
    .eq("lead_status", "new");

  if (error) {
    console.error("Claim lead error:", error);
    return { error: "Failed to claim lead" };
  }

  return { success: true };
}
