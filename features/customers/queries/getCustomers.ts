import { getAuthCompany } from '@/lib/auth/getAuthCompany'
import type { CustomerFilters, CustomerListResult } from '../types'

export async function getCustomers(filters?: CustomerFilters): Promise<CustomerListResult> {
  const { supabase, companyId } = await getAuthCompany()

  const page = filters?.page || 1
  const limit = filters?.limit || 10
  const offset = (page - 1) * limit

  // Build query - only select needed fields
  let query = supabase
    .from('customers')
    .select('id, company_id, name, email, phone, address, notes, custom_fields, created_at, updated_at', { count: 'exact' })
    .eq('company_id', companyId)

  // Search filter
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
  }

  // Sorting
  if (filters?.sortField) {
    const order = filters.sortOrder === 'desc' ? { ascending: false } : { ascending: true }
    query = query.order(filters.sortField, order)
  } else {
    query = query.order('created_at', { ascending: false })
  }

  // Pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw error

  // Transform snake_case to camelCase
  const customers = (data || []).map(c => ({
    id: c.id,
    companyId: c.company_id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    notes: c.notes,
    customFields: c.custom_fields || {},
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }))

  return {
    data: customers,
    total: count || 0,
  }
}
