'use server'

import { createClient } from '@/lib/supabase/server'

export async function deleteCustomer(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

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

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: 'Failed to delete customer' }

  return { success: true }
}
