"use server";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cleans up orphaned data and creates (or reuses) an auth user for the given email.
 * Returns the auth user ID on success, or an error string.
 */
export async function ensureAuthUser(
  adminClient: SupabaseClient,
  email: string,
  password: string
): Promise<{ authUserId: string } | { error: string }> {
  // Clean up orphaned profile from a previous revoke
  const { data: existingProfile } = await adminClient
    .from("users")
    .select("id")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (existingProfile) {
    await adminClient.from("user_companies").delete().eq("user_id", existingProfile.id);
    await adminClient.from("users").delete().eq("id", existingProfile.id);
    await adminClient.auth.admin.deleteUser(existingProfile.id).catch(() => {});
  }

  // Try creating a new auth user
  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email, password, email_confirm: true,
    });

  if (authError) {
    // Email already in auth.users - find and reuse the orphaned auth user
    if (authError.message?.includes("already been registered")) {
      const { data: listData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      const existing = listData?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );
      if (!existing) return { error: "Email conflict. Please contact support." };
      await adminClient.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
      return { authUserId: existing.id };
    }
    return { error: authError.message || "Failed to create auth user" };
  }

  if (!authData.user) return { error: "Failed to create auth user" };
  return { authUserId: authData.user.id };
}
