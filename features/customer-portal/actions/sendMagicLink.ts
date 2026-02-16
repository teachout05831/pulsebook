"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(email: string) {
  if (!email || typeof email !== "string") {
    return { error: "Email is required" };
  }

  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { error: "Invalid email address" };
  }

  const supabase = await createClient();

  // Verify this email belongs to a customer with portal access
  const { data: customer } = await supabase
    .from("customers")
    .select("id, user_id")
    .eq("email", trimmed)
    .not("user_id", "is", null)
    .limit(1)
    .single();

  if (!customer) {
    // Don't reveal whether the email exists
    return { success: true };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/portal` },
  });

  if (error) {
    return { error: "Failed to send magic link. Please try again." };
  }

  return { success: true };
}
