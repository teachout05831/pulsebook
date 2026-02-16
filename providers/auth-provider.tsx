'use client'

import type { AuthProvider } from '@refinedev/core'
import { createClient } from '@/lib/supabase/client'

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: error.message,
        },
      }
    }

    if (data.user) {
      return {
        success: true,
        redirectTo: '/dashboard',
      }
    }

    return {
      success: false,
      error: {
        name: 'LoginError',
        message: 'Login failed',
      },
    }
  },

  register: async ({ email, password, fullName, companyName }) => {
    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      return {
        success: false,
        error: {
          name: 'RegisterError',
          message: authError.message,
        },
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: {
          name: 'RegisterError',
          message: 'Registration failed',
        },
      }
    }

    // Create company
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        slug: `${slug}-${Date.now()}`,
      })
      .select('id')
      .single()

    if (companyError) {
      return {
        success: false,
        error: {
          name: 'RegisterError',
          message: 'Failed to create company',
        },
      }
    }

    // Add user to company
    await supabase.from('user_companies').insert({
      user_id: authData.user.id,
      company_id: company.id,
      role: 'owner',
    })

    // Set active company
    await supabase
      .from('users')
      .update({ active_company_id: company.id })
      .eq('id', authData.user.id)

    return {
      success: true,
      redirectTo: '/dashboard',
    }
  },

  logout: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()

    return {
      success: true,
      redirectTo: '/login',
    }
  },

  check: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      return {
        authenticated: true,
      }
    }

    return {
      authenticated: false,
      redirectTo: '/login',
    }
  },

  getPermissions: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Get user's role in active company
    const { data: profile } = await supabase
      .from('users')
      .select('active_company_id')
      .eq('id', user.id)
      .single()

    if (!profile?.active_company_id) return null

    const { data: membership } = await supabase
      .from('user_companies')
      .select('role')
      .eq('user_id', user.id)
      .eq('company_id', profile.active_company_id)
      .single()

    return membership?.role || null
  },

  getIdentity: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
      .from('users')
      .select('id, email, full_name, active_company_id')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    return {
      id: profile.id,
      name: profile.full_name || profile.email,
      email: profile.email,
      activeCompanyId: profile.active_company_id,
    }
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: '/login',
        error,
      }
    }

    return { error }
  },
}
