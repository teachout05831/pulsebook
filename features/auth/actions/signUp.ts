'use server'

import { createClient } from '@/lib/supabase/server'
import type { SignUpInput, AuthResult } from '../types'

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const supabase = await createClient()

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

  // Create user profile in public.users table
  const { error: profileError } = await supabase
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

  const { data: company, error: companyError } = await supabase
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
  const { error: memberError } = await supabase
    .from('user_companies')
    .insert({
      user_id: authData.user.id,
      company_id: company.id,
      role: 'owner',
    })

  if (memberError) {
    return { success: false, error: 'Failed to add user to company' }
  }

  // Set active company
  const { error: updateError } = await supabase
    .from('users')
    .update({ active_company_id: company.id })
    .eq('id', authData.user.id)

  if (updateError) {
    return { success: false, error: 'Failed to set active company' }
  }

  return {
    success: true,
    user: authData.user,
    session: authData.session ?? undefined,
  }
}
