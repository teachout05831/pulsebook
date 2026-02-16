import { getAuthCompany } from '@/lib/auth/getAuthCompany';
import type { ServiceType } from '../types';

export async function getServiceTypes(): Promise<ServiceType[]> {
  const { supabase, companyId } = await getAuthCompany();

  const { data, error } = await supabase
    .from('service_types')
    .select('id, name, description, default_price, is_active, company_id, created_at, updated_at')
    .eq('company_id', companyId)
    .order('name')
    .limit(100);

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description || '',
    defaultPrice: row.default_price,
    isActive: row.is_active,
    companyId: row.company_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }));
}
