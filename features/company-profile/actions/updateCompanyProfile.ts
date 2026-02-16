'use server';

import { createClient } from '@/lib/supabase/server';
import type { CompanyProfileFormData } from '../types';

export async function updateCompanyProfile(input: CompanyProfileFormData) {
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

  // Validation
  if (!input.name || input.name.length < 2) {
    return { error: 'Company name must be at least 2 characters' };
  }

  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { error: 'Invalid email address' };
  }

  // Convert camelCase to snake_case for database
  const { data, error } = await supabase
    .from('companies')
    .update({
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      address: input.address || null,
      city: input.city || null,
      state: input.state || null,
      zip_code: input.zipCode || null,
      website: input.website || null,
      industry: input.industry || null,
    })
    .eq('id', userData.active_company_id)
    .select('id, name, email, phone, address, city, state, zip_code, website, industry, logo_url')
    .single();

  if (error) return { error: 'Failed to update company profile' };

  // Convert snake_case to camelCase for response
  return {
    success: true,
    data: {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zip_code,
      website: data.website,
      industry: data.industry,
      logoUrl: data.logo_url,
    },
  };
}
