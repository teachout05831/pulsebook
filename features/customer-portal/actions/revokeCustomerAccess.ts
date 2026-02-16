"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export async function revokeCustomerAccess(
  supabase: SupabaseClient,
  companyId: string,
  customerId: string
) {
  // 1. Verify customer belongs to company and has access
  const { data: customer } = await supabase
    .from("customers")
    .select("id, company_id, user_id")
    .eq("id", customerId)
    .single();

  if (!customer) return { error: "Customer not found" };
  if (customer.company_id !== companyId) return { error: "Not authorized" };
  if (!customer.user_id) return { error: "Customer has no portal access" };

  const authUserId = customer.user_id;
  const adminClient = createAdminClient();

  // 2. Unlink customer
  await adminClient
    .from("customers")
    .update({ user_id: null })
    .eq("id", customerId);

  // 3. Remove user_companies entry
  await adminClient
    .from("user_companies")
    .delete()
    .eq("user_id", authUserId)
    .eq("company_id", companyId);

  // 4. Remove users table entry
  await adminClient
    .from("users")
    .delete()
    .eq("id", authUserId);

  // 5. Delete the auth user
  await adminClient.auth.admin.deleteUser(authUserId);

  return { success: true };
}
