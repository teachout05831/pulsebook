"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function inviteTech(
  supabase: SupabaseClient,
  companyId: string,
  teamMemberId: string,
  customPassword?: string
) {
  // 1. Verify team member belongs to company and has no existing access
  const { data: member } = await supabase
    .from("team_members")
    .select("id, company_id, user_id, name, email")
    .eq("id", teamMemberId)
    .single();

  if (!member) return { error: "Team member not found" };
  if (member.company_id !== companyId) return { error: "Not authorized" };
  if (member.user_id) return { error: "Team member already has portal access" };
  if (!member.email) return { error: "Team member must have an email" };

  // 2. Use custom password or generate temp password
  const tempPassword = customPassword && customPassword.length >= 8
    ? customPassword
    : `Temp${crypto.randomBytes(4).toString("hex")}!`;

  const adminClient = createAdminClient();

  // 3. Create auth user
  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email: member.email, password: tempPassword, email_confirm: true,
    });
  if (authError || !authData.user) {
    return { error: authError?.message || "Failed to create auth user" };
  }
  const authUserId = authData.user.id;

  // 4. Insert into users table
  const { error: userError } = await adminClient.from("users").insert({
    id: authUserId, email: member.email, full_name: member.name, active_company_id: companyId,
  });
  if (userError) {
    await adminClient.auth.admin.deleteUser(authUserId);
    return { error: "Failed to create user profile" };
  }

  // 5. Insert into user_companies
  const { error: ucError } = await adminClient.from("user_companies").insert({
    user_id: authUserId, company_id: companyId, role: "member",
  });
  if (ucError) {
    await adminClient.from("users").delete().eq("id", authUserId);
    await adminClient.auth.admin.deleteUser(authUserId);
    return { error: "Failed to link user to company" };
  }

  // 6. Link team member to auth user
  const { error: linkError } = await adminClient
    .from("team_members").update({ user_id: authUserId }).eq("id", teamMemberId);
  if (linkError) return { error: "Failed to link portal access" };

  return { success: true, tempPassword };
}
