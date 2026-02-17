'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SignUpInput, AuthResult } from '../types'

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  // Validate input
  if (!input.email || !input.email.includes('@')) {
    return { success: false, error: 'Valid email is required' }
  }
  if (!input.password || input.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }
  if (!input.fullName || input.fullName.length < 2) {
    return { success: false, error: 'Full name is required' }
  }
  if (!input.companyName || input.companyName.length < 2) {
    return { success: false, error: 'Company name is required' }
  }

  // Use cookie-based client for auth (sets session cookie)
  const supabase = await createClient()

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
      },
    },
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: 'Failed to create user' }
  }

  // Use admin client for setup steps (bypasses RLS)
  // The regular client can't reliably do these inserts because
  // RLS policies require active_company_id which doesn't exist yet
  const admin = createAdminClient()

  // Create user profile in public.users table
  const { error: profileError } = await admin
    .from('users')
    .insert({
      id: authData.user.id,
      email: input.email,
      full_name: input.fullName,
    })

  if (profileError) {
    console.error('Profile creation error:', profileError)
    return { success: false, error: `Failed to create user profile: ${profileError.message}` }
  }

  // Create company
  const slug = input.companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data: company, error: companyError } = await admin
    .from('companies')
    .insert({
      name: input.companyName,
      slug: `${slug}-${Date.now()}`,
    })
    .select('id')
    .single()

  if (companyError) {
    console.error('Company creation error:', companyError)
    return { success: false, error: `Failed to create company: ${companyError.message}` }
  }

  // Add user to company as owner
  const { error: memberError } = await admin
    .from('user_companies')
    .insert({
      user_id: authData.user.id,
      company_id: company.id,
      role: 'owner',
    })

  if (memberError) {
    console.error('Membership creation error:', memberError)
    return { success: false, error: 'Failed to add user to company' }
  }

  // Set active company
  const { error: updateError } = await admin
    .from('users')
    .update({ active_company_id: company.id })
    .eq('id', authData.user.id)

  if (updateError) {
    console.error('Set active company error:', updateError)
    return { success: false, error: 'Failed to set active company' }
  }

  return {
    success: true,
    user: authData.user,
    session: authData.session ?? undefined,
  }
}
