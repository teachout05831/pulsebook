'use server';

import { createClient } from '@/lib/supabase/server';
import type { ServiceTypeFormData } from '../types';

export async function updateServiceType(id: string, input: ServiceTypeFormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single();

  if (!userData?.active_company_id) return { error: 'No active company' };

  if (!input.name || input.name.length < 2) {
    return { error: 'Name must be at least 2 characters' };
  }

  const price = parseFloat(input.defaultPrice);
  if (isNaN(price) || price < 0) {
    return { error: 'Invalid price' };
  }

  const { data: existing } = await supabase
    .from('service_types')
    .select('company_id')
    .eq('id', id)
    .single();

  if (!existing) return { error: 'Service type not found' };
  if (existing.company_id !== userData.active_company_id) {
    return { error: 'Not authorized' };
  }

  const { data, error } = await supabase
    .from('service_types')
    .update({
      name: input.name,
      description: input.description || null,
      default_price: price,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { error: 'Failed to update service type' };
  return { success: true, data };
}
