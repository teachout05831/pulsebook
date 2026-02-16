'use server';

import { createClient } from '@/lib/supabase/server';

export async function toggleTeamMemberStatus(id: string, isActive: boolean) {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single();

  if (!userData?.active_company_id) return { error: 'No active company' };

  // Ownership check
  const { data: existing } = await supabase
    .from('team_members')
    .select('company_id')
    .eq('id', id)
    .single();

  if (!existing) return { error: 'Team member not found' };
  if (existing.company_id !== userData.active_company_id) {
    return { error: 'Not authorized' };
  }

  // Toggle status
  const { error } = await supabase
    .from('team_members')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) return { error: 'Failed to update team member status' };

  return { success: true };
}
