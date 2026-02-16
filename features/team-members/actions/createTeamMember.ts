'use server';

import { getAuthCompany, AuthError } from '@/lib/auth/getAuthCompany';
import type { CreateTeamMemberInput } from '../types';

export async function createTeamMember(input: CreateTeamMemberInput) {
  let supabase, companyId;
  try {
    ({ supabase, companyId } = await getAuthCompany());
  } catch (e) {
    if (e instanceof AuthError) return { error: e.message };
    return { error: 'Authentication failed' };
  }

  // Validation
  if (!input.name || input.name.length < 2) {
    return { error: 'Name must be at least 2 characters' };
  }

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { error: 'Valid email is required' };
  }

  if (!input.role) {
    return { error: 'Role is required' };
  }

  // Create team member
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      company_id: companyId,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      role: input.role,
      is_active: true,
    })
    .select('id, name, email, phone, role, is_active')
    .single();

  if (error) return { error: 'Failed to create team member' };

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
