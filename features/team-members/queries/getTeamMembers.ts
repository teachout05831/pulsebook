import { getAuthCompany } from '@/lib/auth/getAuthCompany';
import type { TeamMember } from '../types';

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { supabase, companyId } = await getAuthCompany();

  // Fetch team members
  const { data, error } = await supabase
    .from('team_members')
    .select('id, company_id, user_id, name, email, phone, role, is_active, created_at, updated_at')
    .eq('company_id', companyId)
    .order('name')
    .limit(100);

  if (error) throw error;

  // Convert snake_case to camelCase
  return data.map(member => ({
    id: member.id,
    companyId: member.company_id,
    userId: member.user_id,
    name: member.name,
    email: member.email,
    phone: member.phone || '',
    role: member.role,
    isActive: member.is_active,
    createdAt: member.created_at,
    updatedAt: member.updated_at,
  }));
}
