import type { SupabaseClient } from "@supabase/supabase-js";

const JOB_FIELDS =
  "id, title, description, status, scheduled_date, scheduled_time, arrival_window, estimated_duration, address, notes, customer_id, assigned_to, assigned_crew_id, crew_notes, crew_feedback, customer_notes";
const CUSTOMER_JOIN = "customers(id, name, email, phone, address, notes)";

interface DateFilter {
  start: string;
  end: string;
}

export async function getTechJobs(
  supabase: SupabaseClient,
  companyId: string,
  teamMemberId: string,
  crewIds: string[],
  dateFilter: DateFilter
) {
  let query = supabase
    .from("jobs")
    .select(`${JOB_FIELDS}, ${CUSTOMER_JOIN}`)
    .eq("company_id", companyId)
    .not("dispatched_at", "is", null)
    .gte("scheduled_date", dateFilter.start)
    .lte("scheduled_date", dateFilter.end)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true })
    .limit(50);

  if (crewIds.length > 0) {
    query = query.or(
      `assigned_to.eq.${teamMemberId},assigned_crew_id.in.(${crewIds.join(",")})`
    );
  } else {
    query = query.eq("assigned_to", teamMemberId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTechJobById(
  supabase: SupabaseClient,
  companyId: string,
  teamMemberId: string,
  crewIds: string[],
  jobId: string
) {
  let query = supabase
    .from("jobs")
    .select(`${JOB_FIELDS}, ${CUSTOMER_JOIN}`)
    .eq("id", jobId)
    .eq("company_id", companyId)
    .not("dispatched_at", "is", null);

  if (crewIds.length > 0) {
    query = query.or(
      `assigned_to.eq.${teamMemberId},assigned_crew_id.in.(${crewIds.join(",")})`
    );
  } else {
    query = query.eq("assigned_to", teamMemberId);
  }

  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}
