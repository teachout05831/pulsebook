'use server'

import { createClient } from '@/lib/supabase/server'
import type { UpdateCustomerInput, Customer } from '../types'

export async function updateCustomer(id: string, input: UpdateCustomerInput): Promise<{ success: boolean; data?: Customer; error?: string }> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Validation
  if (!id) return { success: false, error: 'Customer ID required' }

  // Get active company
  const { data: userData } = await supabase
    .from('users')
    .select('active_company_id')
    .eq('id', user.id)
    .single()

  if (!userData?.active_company_id) {
    return { success: false, error: 'No active company selected' }
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from('customers')
    .select('company_id')
    .eq('id', id)
    .single()

  if (!existing) return { success: false, error: 'Customer not found' }
  if (existing.company_id !== userData.active_company_id) {
    return { success: false, error: 'Not authorized' }
  }

  const updateData: Record<string, unknown> = {}
  if (input.name !== undefined) updateData.name = input.name
  if (input.email !== undefined) updateData.email = input.email
  if (input.phone !== undefined) updateData.phone = input.phone
  if (input.address !== undefined) updateData.address = input.address
  if (input.notes !== undefined) updateData.notes = input.notes

  const { data, error } = await supabase
    .from('customers')
    .update(updateData)
    .eq('id', id)
    .select('id, company_id, name, email, phone, address, notes, custom_fields, created_at, updated_at')
    .single()

  if (error) return { success: false, error: 'Failed to update customer' }

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
