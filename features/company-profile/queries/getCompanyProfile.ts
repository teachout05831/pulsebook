import { createClient } from '@/lib/supabase/server';
import type { CompanyProfile } from '../types';

export async function getCompanyProfile(): Promise<CompanyProfile> {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .limit(1)
    .single();

  if (!userData?.active_company_id) throw new Error('No active company');

  // Fetch company profile
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, email, phone, address, city, state, zip_code, website, industry, logo_url, created_at, updated_at')
    .eq('id', userData.active_company_id)
    .limit(1)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Company not found');

  // Convert snake_case to camelCase (happens in query, not API route for server components)
  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zip_code || '',
    website: data.website || '',
    industry: data.industry || '',
    logoUrl: data.logo_url,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}
