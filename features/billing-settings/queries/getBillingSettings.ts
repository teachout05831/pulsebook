import { createClient } from '@/lib/supabase/server';
import type { BillingSettings } from '../types';
import { defaultBillingSettings } from '../types';

export async function getBillingSettings(): Promise<BillingSettings> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .limit(1)
    .single();

  if (!userData?.active_company_id) throw new Error('No active company');

  const { data, error } = await supabase
    .from('companies')
    .select('settings')
    .eq('id', userData.active_company_id)
    .limit(1)
    .single();

  if (error) throw error;

  const settings = data?.settings?.billing || {};

  return {
    defaultTaxRate: settings.defaultTaxRate ?? defaultBillingSettings.defaultTaxRate,
    defaultPaymentTerms: settings.defaultPaymentTerms || defaultBillingSettings.defaultPaymentTerms,
    invoicePrefix: settings.invoicePrefix || defaultBillingSettings.invoicePrefix,
    estimatePrefix: settings.estimatePrefix || defaultBillingSettings.estimatePrefix,
    defaultInvoiceNotes: settings.defaultInvoiceNotes || defaultBillingSettings.defaultInvoiceNotes,
    defaultInvoiceTerms: settings.defaultInvoiceTerms || defaultBillingSettings.defaultInvoiceTerms,
    defaultEstimateNotes: settings.defaultEstimateNotes || defaultBillingSettings.defaultEstimateNotes,
    defaultEstimateTerms: settings.defaultEstimateTerms || defaultBillingSettings.defaultEstimateTerms,
  };
}
