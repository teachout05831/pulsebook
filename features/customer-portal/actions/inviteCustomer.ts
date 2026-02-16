"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureAuthUser } from "./ensureAuthUser";
import crypto from "crypto";

export async function inviteCustomer(
  supabase: SupabaseClient,
  companyId: string,
  customerId: string
) {
  // 1. Verify customer belongs to company and has no existing access
  const { data: customer } = await supabase
    .from("customers")
    .select("id, company_id, user_id, name, email")
    .eq("id", customerId)
    .single();

  if (!customer) return { error: "Customer not found" };
  if (customer.company_id !== companyId) return { error: "Not authorized" };
  if (customer.user_id) return { error: "Customer already has portal access" };
  if (!customer.email) return { error: "Customer must have an email" };

  // 2. Generate temp password and ensure auth user exists
  const tempPassword = `Temp${crypto.randomBytes(4).toString("hex")}!`;
  const adminClient = createAdminClient();

  const authResult = await ensureAuthUser(adminClient, customer.email, tempPassword);
  if ("error" in authResult) return { error: authResult.error };
  const { authUserId } = authResult;

  // 3. Upsert into users table (handles orphaned rows)
  const { error: userError } = await adminClient.from("users").upsert({
    id: authUserId, email: customer.email, full_name: customer.name, active_company_id: companyId,
  }, { onConflict: "id" });
  if (userError) {
    await adminClient.auth.admin.deleteUser(authUserId);
    return { error: "Failed to create user profile" };
  }

  // 4. Insert into user_companies
  const { error: ucError } = await adminClient.from("user_companies").insert({
    user_id: authUserId, company_id: companyId, role: "member",
  });
  if (ucError) {
    await adminClient.from("users").delete().eq("id", authUserId);
    await adminClient.auth.admin.deleteUser(authUserId);
    return { error: "Failed to link user to company" };
  }

  // 5. Link customer to auth user
  const { error: linkError } = await adminClient
    .from("customers").update({ user_id: authUserId }).eq("id", customerId);
  if (linkError) return { error: "Failed to link portal access" };

  return { success: true, tempPassword };
}
