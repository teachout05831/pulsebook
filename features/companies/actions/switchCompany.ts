'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { SwitchCompanyResult } from '../types'

export async function switchCompany(companyId: string): Promise<SwitchCompanyResult> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Validate input
  if (!companyId) {
    return { success: false, error: 'Company ID is required' }
  }

  // Verify user has access to this company
  const { data: membership, error: memberError } = await supabase
    .from('user_companies')
    .select('id')
    .eq('user_id', user.id)
    .eq('company_id', companyId)
    .single()

  if (memberError || !membership) {
    return { success: false, error: 'Not authorized to access this company' }
  }

  // Update active company
  const { error: updateError } = await supabase
    .from('users')
    .update({ active_company_id: companyId })
    .eq('id', user.id)

  if (updateError) {
    return { success: false, error: 'Failed to switch company' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
