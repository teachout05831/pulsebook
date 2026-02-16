// Components
export { LoginForm, SignupForm } from './components'

// Actions (server actions are safe for client import)
export { signIn, signUp, signOut } from './actions'

// Types
export type {
  AuthUser,
  UserProfile,
  SignInInput,
  SignUpInput,
  AuthResult,
  SessionResult,
  AuthStatus,
} from './types'

// NOTE: Queries (getSession, getUser) are server-only
// Import directly: import { getUser } from '@/features/auth/queries'
