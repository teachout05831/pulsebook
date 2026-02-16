"use server";

import { SupabaseClient } from "@supabase/supabase-js";

interface TemplateJob {
  id: string;
  company_id: string;
  customer_id: string;
  title: string;
  description: string | null;
  scheduled_time: string | null;
  estimated_duration: number | null;
  address: string | null;
  assigned_to: string | null;
  notes: string | null;
  custom_fields: Record<string, unknown>;
  tags: string[];
  recurrence_config: {
    frequency: string;
    daysOfWeek: number[];
    startDate: string;
    endDate: string | null;
    occurrences: number | null;
  };
}

function generateDates(config: TemplateJob["recurrence_config"], daysAhead: number): string[] {
  const dates: string[] = [];
  const start = new Date(config.startDate);
  const end = config.endDate ? new Date(config.endDate) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + daysAhead);

  const cursor = new Date(Math.max(start.getTime(), today.getTime()));
  const maxDates = config.occurrences || 365;

  while (cursor <= horizon && dates.length < maxDates) {
    if (end && cursor > end) break;

    const dayOfWeek = cursor.getDay();
    const shouldInclude =
      config.frequency === "daily" ||
      ((config.frequency === "weekly" || config.frequency === "biweekly") &&
        config.daysOfWeek.includes(dayOfWeek)) ||
      config.frequency === "monthly";

    if (shouldInclude) {
      dates.push(cursor.toISOString().split("T")[0]);
    }

    if (config.frequency === "monthly") {
      cursor.setMonth(cursor.getMonth() + 1);
    } else if (config.frequency === "biweekly" && dates.length > 0) {
      cursor.setDate(cursor.getDate() + 1);
    } else {
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return dates;
}

export async function generateInstances(
  supabase: SupabaseClient,
  companyId: string,
  templateJob: TemplateJob,
  daysAhead = 30
) {
  if (templateJob.company_id !== companyId) {
    return { error: "Not authorized" };
  }

  if (!templateJob.recurrence_config) {
    return { error: "Job has no recurrence config" };
  }

  // Get existing instance dates to avoid duplicates
  const { data: existing } = await supabase
    .from("jobs")
    .select("instance_date")
    .eq("parent_job_id", templateJob.id)
    .eq("company_id", companyId)
    .limit(500);

  const existingDates = new Set((existing || []).map((r) => r.instance_date));
  const allDates = generateDates(templateJob.recurrence_config, daysAhead);
  const newDates = allDates.filter((d) => !existingDates.has(d));

  if (newDates.length === 0) {
    return { success: true, count: 0 };
  }

  const rows = newDates.map((date) => ({
    company_id: companyId,
    customer_id: templateJob.customer_id,
    title: templateJob.title,
    description: templateJob.description,
    status: "scheduled",
    scheduled_date: date,
    scheduled_time: templateJob.scheduled_time,
    estimated_duration: templateJob.estimated_duration,
    address: templateJob.address,
    assigned_to: templateJob.assigned_to,
    notes: templateJob.notes,
    custom_fields: templateJob.custom_fields || {},
    tags: templateJob.tags || [],
    parent_job_id: templateJob.id,
    instance_date: date,
    is_recurring_template: false,
  }));

  const { error } = await supabase.from("jobs").insert(rows);

  if (error) return { error: "Failed to generate instances" };
  return { success: true, count: newDates.length };
}
