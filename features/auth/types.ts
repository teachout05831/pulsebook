import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  fullName: string | null
  activeCompanyId: string | null
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  active_company_id: string | null
  created_at: string
  updated_at: string
}

export interface SignInInput {
  email: string
  password: string
}

export interface SignUpInput {
  email: string
  password: string
  fullName: string
  companyName: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: User
  session?: Session
}

export interface SessionResult {
  user: AuthUser | null
  session: Session | null
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'
