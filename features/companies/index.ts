// Components
export { CompanySwitcher } from './components'

// Actions (server actions are safe for client import)
export { createCompany, switchCompany } from './actions'

// Hooks
export { useActiveCompany } from './hooks'

// Types
export type { Company, UserCompany, CreateCompanyInput, SwitchCompanyResult } from './types'

// NOTE: Queries (getUserCompanies, getActiveCompany) are server-only
// Import directly: import { getUserCompanies } from '@/features/companies/queries'
