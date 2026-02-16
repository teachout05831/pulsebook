import type { SupabaseClient } from "@supabase/supabase-js";

export interface CustomerUser {
  authUserId: string;
  customerId: string;
  companyId: string;
  name: string;
  email: string;
}

/**
 * Auth helper for customer portal API routes.
 * Looks up the authenticated user's linked customer record.
 * Returns null if not authenticated or not a linked customer.
 */
export async function getCustomerUser(
  supabase: SupabaseClient
): Promise<CustomerUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: customer } = await supabase
    .from("customers")
    .select("id, company_id, name, email")
    .eq("user_id", user.id)
    .single();

  if (!customer) return null;

  return {
    authUserId: user.id,
    customerId: customer.id,
    companyId: customer.company_id,
    name: customer.name,
    email: customer.email,
  };
}
