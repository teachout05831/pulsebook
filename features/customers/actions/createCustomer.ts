'use server'

import { createClient } from '@/lib/supabase/server'
import type { CreateCustomerInput, Customer } from '../types'

export async function createCustomer(input: CreateCustomerInput): Promise<{ success: boolean; data?: Customer; error?: string }> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Validation
  if (!input.name || input.name.length < 2) {
    return { success: false, error: 'Name must be at least 2 characters' }
  }

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.active_company_id) {
    return { success: false, error: 'No active company selected' }
  }

  const { data, error } = await supabase
    .from('customers')
    .insert({
      company_id: userData.active_company_id,
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      address: input.address || null,
      notes: input.notes || null,
    })
    .select('id, company_id, name, email, phone, address, notes, custom_fields, created_at, updated_at')
    .single()

  if (error) return { success: false, error: 'Failed to create customer' }

  return {
    success: true,
    data: {
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
    },
  }
}
