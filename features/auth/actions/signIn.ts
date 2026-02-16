'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { SignInInput, AuthResult } from '../types'

export async function signIn(input: SignInInput): Promise<AuthResult> {
  try {
    const supabase = await createClient()

    // Validate input
    if (!input.email || !input.email.includes('@')) {
      return { success: false, error: 'Valid email is required' }
    }
    if (!input.password || input.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Don't return full user/session objects - they may not be serializable
    // The session is already set via cookies by Supabase
    return { success: true }
  } catch (err) {
    console.error('SignIn error:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function signInAndRedirect(input: SignInInput): Promise<void> {
  const result = await signIn(input)

  if (result.success) {
    redirect('/dashboard')
  }
}
