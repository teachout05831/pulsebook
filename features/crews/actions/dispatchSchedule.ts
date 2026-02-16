"use server";

import { createClient } from "@/lib/supabase/server";

export async function dispatchSchedule(date: string, notes?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) return { error: "No active company" };

  if (!date) return { error: "Date is required" };

  const now = new Date().toISOString();

  // Set dispatched_at on all jobs for this date
  const { error: jobsError } = await supabase
    .from("jobs")
    .update({ dispatched_at: now })
    .eq("company_id", userData.active_company_id)
    .eq("scheduled_date", date)
    .is("dispatched_at", null);

  if (jobsError) return { error: "Failed to dispatch jobs" };

  // Upsert dispatch log (one per company per date)
  const { error: logError } = await supabase
    .from("dispatch_logs")
    .upsert(
      {
        company_id: userData.active_company_id,
        dispatch_date: date,
        dispatched_at: now,
        dispatched_by: user.id,
        notes: notes || null,
      },
      { onConflict: "company_id,dispatch_date" }
    );

  if (logError) return { error: "Failed to create dispatch log" };
  return { success: true, dispatchedAt: now };
}
