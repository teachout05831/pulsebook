import type { SupabaseClient } from "@supabase/supabase-js";

export interface TechUser {
  authUserId: string;
  teamMemberId: string;
  companyId: string;
  name: string;
  role: string;
}

/**
 * Auth helper for tech portal API routes.
 * Looks up the authenticated user's linked team_member record.
 * Returns null if not authenticated or not a linked team member.
 */
export async function getTechUser(
  supabase: SupabaseClient
): Promise<TechUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: teamMember } = await supabase
    .from("team_members")
    .select("id, company_id, name, role, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!teamMember) return null;

  return {
    authUserId: user.id,
    teamMemberId: teamMember.id,
    companyId: teamMember.company_id,
    name: teamMember.name,
    role: teamMember.role,
  };
}
