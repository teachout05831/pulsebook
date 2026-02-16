'use server';

import { createClient } from '@/lib/supabase/server';
import type { BillingSettings } from '../types';

export async function updateBillingSettings(settings: BillingSettings) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single();

  if (!userData?.active_company_id) return { error: 'No active company' };

  if (settings.defaultTaxRate < 0 || settings.defaultTaxRate > 100) {
    return { error: 'Tax rate must be between 0 and 100' };
  }

  const { data: company } = await supabase
    .from('companies')
    .select('settings')
    .eq('id', userData.active_company_id)
    .single();

  const updatedSettings = {
    ...(company?.settings || {}),
    billing: settings,
  };

  const { error } = await supabase
    .from('companies')
    .update({ settings: updatedSettings })
    .eq('id', userData.active_company_id);

  if (error) return { error: 'Failed to update billing settings' };
  return { success: true };
}
