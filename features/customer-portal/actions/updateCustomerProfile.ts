"use server";

import { createClient } from "@/lib/supabase/server";
import { getCustomerUser } from "@/lib/auth/getCustomerUser";

interface UpdateInput {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export async function updateCustomerProfile(input: UpdateInput) {
  const supabase = await createClient();
  const customerUser = await getCustomerUser(supabase);
  if (!customerUser) return { error: "Not authenticated" };

  if (input.name !== undefined && input.name.trim().length < 2) {
    return { error: "Name must be at least 2 characters" };
  }

  // Build update object with snake_case keys
  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.phone !== undefined) updates.phone = input.phone.trim() || null;
  if (input.address !== undefined) updates.address = input.address.trim() || null;
  if (input.city !== undefined) updates.city = input.city.trim() || null;
  if (input.state !== undefined) updates.state = input.state.trim() || null;
  if (input.zipCode !== undefined) updates.zip_code = input.zipCode.trim() || null;

  if (Object.keys(updates).length === 0) {
    return { error: "No changes provided" };
  }

  // Ownership check: update only own record
  const { error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", customerUser.customerId)
    .eq("company_id", customerUser.companyId);

  if (error) return { error: "Failed to update profile" };
  return { success: true };
}
