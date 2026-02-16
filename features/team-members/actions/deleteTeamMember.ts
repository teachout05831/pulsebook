'use server';

import { createClient } from '@/lib/supabase/server';

export async function deleteTeamMember(id: string) {
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

  // Delete team member
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id);

  if (error) return { error: 'Failed to delete team member' };

  return { success: true };
}
