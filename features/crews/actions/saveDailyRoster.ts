"use server";

import { createClient } from "@/lib/supabase/server";

interface RosterEntry {
  crew_id: string;
  team_member_id: string;
  is_present: boolean;
  is_fill_in: boolean;
}

export async function saveDailyRoster(date: string, entries: RosterEntry[]) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: userData } = await supabase
    .from("users")
    .select("active_company_id")
    .eq("id", user.id)
    .single();
  if (!userData?.active_company_id) return { error: "No active company" };

  if (!date) return { error: "Date is required" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Invalid date format" };
  if (!entries || entries.length === 0) return { error: "No roster entries" };
  if (entries.length > 500) return { error: "Too many roster entries" };

  for (const e of entries) {
    if (!e.crew_id || !e.team_member_id) return { error: "Invalid roster entry" };
  }

  // Ownership check: verify all crews and members belong to this company
  const crewIds = Array.from(new Set(entries.map(e => e.crew_id)));
  const memberIds = Array.from(new Set(entries.map(e => e.team_member_id)));

  const { data: validCrews } = await supabase
    .from("crews")
    .select("id")
    .in("id", crewIds)
    .eq("company_id", userData.active_company_id)
    .limit(crewIds.length);
  if (!validCrews || validCrews.length !== crewIds.length) return { error: "Not authorized" };

  const { data: validMembers } = await supabase
    .from("team_members")
    .select("id")
    .in("id", memberIds)
    .eq("company_id", userData.active_company_id)
    .limit(memberIds.length);
  if (!validMembers || validMembers.length !== memberIds.length) return { error: "Not authorized" };

  // Delete existing roster for this date, then insert fresh
  const { error: deleteError } = await supabase
    .from("daily_rosters")
    .delete()
    .eq("company_id", userData.active_company_id)
    .eq("roster_date", date);

  if (deleteError) return { error: "Failed to clear existing roster" };

  const rows = entries.map((e) => ({
    company_id: userData.active_company_id,
    crew_id: e.crew_id,
    roster_date: date,
    team_member_id: e.team_member_id,
    is_present: e.is_present,
    is_fill_in: e.is_fill_in,
  }));

  const { error: insertError } = await supabase
    .from("daily_rosters")
    .insert(rows);

  if (insertError) return { error: "Failed to save roster" };
  return { success: true };
}
