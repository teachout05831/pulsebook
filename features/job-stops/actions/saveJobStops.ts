"use server";

import { SupabaseClient } from "@supabase/supabase-js";

interface StopInput {
  address: string;
  notes?: string | null;
  stopType?: string;
  stopOrder: number;
}

export async function saveJobStops(
  supabase: SupabaseClient,
  companyId: string,
  jobId: string,
  stops: StopInput[]
) {
  // Ownership check
  const { data: job } = await supabase
    .from("jobs")
    .select("company_id")
    .eq("id", jobId)
    .single();

  if (!job) return { error: "Job not found" };
  if (job.company_id !== companyId) return { error: "Not authorized" };

  // Validate stops
  if (!Array.isArray(stops)) return { error: "Stops must be an array" };
  for (const stop of stops) {
    if (!stop.address || stop.address.trim().length < 2) {
      return { error: "Each stop must have an address" };
    }
  }

  // Delete existing stops
  const { error: deleteError } = await supabase
    .from("job_stops")
    .delete()
    .eq("job_id", jobId)
    .eq("company_id", companyId);

  if (deleteError) return { error: "Failed to clear existing stops" };

  // Insert new stops
  if (stops.length === 0) return { success: true, data: [] };

  const rows = stops.map((s, i) => ({
    job_id: jobId,
    company_id: companyId,
    stop_order: s.stopOrder ?? i,
    address: s.address.trim(),
    notes: s.notes || null,
    stop_type: s.stopType || "stop",
  }));

  const { data, error } = await supabase
    .from("job_stops")
    .insert(rows)
    .select("id, job_id, stop_order, address, notes, stop_type, created_at");

  if (error) return { error: "Failed to save stops" };
  return { success: true, data };
}
