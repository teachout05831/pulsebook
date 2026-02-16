"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export async function revokeTechAccess(
  supabase: SupabaseClient,
  companyId: string,
  teamMemberId: string
) {
  // 1. Verify team member belongs to company and has access
  const { data: member } = await supabase
    .from("team_members")
    .select("id, company_id, user_id")
    .eq("id", teamMemberId)
    .single();

  if (!member) return { error: "Team member not found" };
  if (member.company_id !== companyId) return { error: "Not authorized" };
  if (!member.user_id) return { error: "Team member has no portal access" };

  const authUserId = member.user_id;
  const adminClient = createAdminClient();

  // 2. Unlink team member
  await adminClient
    .from("team_members")
    .update({ user_id: null })
    .eq("id", teamMemberId);

  // 3. Remove user_companies entry
  await adminClient
    .from("user_companies")
    .delete()
    .eq("user_id", authUserId)
    .eq("company_id", companyId);

  // 4. Disable the auth user
  await adminClient.auth.admin.deleteUser(authUserId);

  return { success: true };
}
