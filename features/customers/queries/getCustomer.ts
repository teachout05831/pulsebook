import { getAuthCompany } from '@/lib/auth/getAuthCompany'
import type { Customer } from '../types'

export async function getCustomer(id: string): Promise<Customer | null> {
  const { supabase, companyId } = await getAuthCompany()

  const { data, error } = await supabase
    .from('customers')
    .select('id, company_id, name, email, phone, address, notes, custom_fields, created_at, updated_at')
    .eq('id', id)
    .eq('company_id', companyId)
    .limit(1)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    companyId: data.company_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    notes: data.notes,
    customFields: data.custom_fields || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
