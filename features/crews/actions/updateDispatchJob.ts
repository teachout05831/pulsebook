"use server";

import { createClient } from "@/lib/supabase/server";

const JOB_FIELDS = "id, company_id, customer_id, title, description, status, scheduled_date, scheduled_time, estimated_duration, address, latitude, longitude, assigned_to, assigned_crew_id, dispatched_at, priority, notes, custom_fields, created_at, updated_at";

interface DispatchJobUpdates {
  status?: string;
  assigned_to?: string | null;
  assigned_crew_id?: string | null;
  scheduled_date?: string;
  scheduled_time?: string | null;
  estimated_duration?: number;
  notes?: string | null;
  priority?: string;
}

export async function updateDispatchJob(jobId: string, updates: DispatchJobUpdates) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) return { error: "No active company" };

  if (!jobId) return { error: "Job ID is required" };

  // Ownership check
  const { data: existing } = await supabase
    .from("jobs")
    .select("company_id")
    .eq("id", jobId)
    .single();

  if (!existing) return { error: "Job not found" };
  if (existing.company_id !== userData.active_company_id) return { error: "Not authorized" };

  // Build update data
  const updateData: Record<string, unknown> = {};
  if (updates.status) updateData.status = updates.status === "unassigned" ? "pending" : updates.status;
  if (updates.assigned_to !== undefined) updateData.assigned_to = updates.assigned_to;
  if (updates.assigned_crew_id !== undefined) updateData.assigned_crew_id = updates.assigned_crew_id;
  if (updates.scheduled_date) updateData.scheduled_date = updates.scheduled_date;
  if (updates.scheduled_time) updateData.scheduled_time = updates.scheduled_time;
  if (updates.estimated_duration !== undefined) updateData.estimated_duration = updates.estimated_duration;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.priority) updateData.priority = updates.priority;

  const { data, error } = await supabase
    .from("jobs")
    .update(updateData)
    .eq("id", jobId)
    .select(`${JOB_FIELDS}, customers(name, phone), team_members:assigned_to(name), crews:assigned_crew_id(name)`)
    .single();

  if (error) return { error: "Failed to update job" };
  return { success: true as const, data };
}
