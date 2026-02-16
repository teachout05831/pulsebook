'use server';

import { createClient } from '@/lib/supabase/server';
import type { UpdateTeamMemberInput } from '../types';

export async function updateTeamMember(id: string, input: UpdateTeamMemberInput) {
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

  // Validation
  if (input.name && input.name.length < 2) {
    return { error: 'Name must be at least 2 characters' };
  }

  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { error: 'Invalid email address' };
  }

  // Update team member
  const updateData: Record<string, unknown> = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.email !== undefined) updateData.email = input.email;
  if (input.phone !== undefined) updateData.phone = input.phone || null;
  if (input.role !== undefined) updateData.role = input.role;

  const { data, error } = await supabase
    .from('team_members')
    .update(updateData)
    .eq('id', id)
    .select('id, name, email, phone, role, is_active')
    .single();

  if (error) return { error: 'Failed to update team member' };

  return {
    success: true,
    data: {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      isActive: data.is_active,
    },
  };
}
