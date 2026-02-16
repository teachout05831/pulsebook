'use server'

import { randomUUID } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CreateCompanyInput, SwitchCompanyResult } from '../types'

export async function createCompany(input: CreateCompanyInput): Promise<SwitchCompanyResult> {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Validate input
  if (!input.name || input.name.length < 2) {
    return { success: false, error: 'Company name must be at least 2 characters' }
  }

  // Create slug
  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Pre-generate UUID to avoid RLS chicken-and-egg problem:
  // The SELECT policy on companies requires user_companies membership,
  // but we can't add that until after the company exists.
  // By pre-generating the ID, we skip the .select() after insert.
  const companyId = randomUUID()

  // Create company (no .select() needed since we have the ID)
  const { error: companyError } = await supabase
    .from('companies')
    .insert({
      id: companyId,
      name: input.name,
      slug: `${slug}-${Date.now()}`,
    })

  if (companyError) {
    return { success: false, error: 'Failed to create company' }
  }

  // Add user as owner
  const { error: memberError } = await supabase
    .from('user_companies')
    .insert({
      user_id: user.id,
      company_id: companyId,
      role: 'owner',
    })

  if (memberError) {
    return { success: false, error: 'Failed to add user to company' }
  }

  // Set as active company
  const { error: updateError } = await supabase
    .from('users')
    .update({ active_company_id: companyId })
    .eq('id', user.id)

  if (updateError) {
    return { success: false, error: 'Failed to set active company' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
