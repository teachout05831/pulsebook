// Components
export { CustomersList } from './components/CustomersList'
export { CreateCustomerForm } from './components/CreateCustomerForm'
export { EditCustomerForm } from './components/EditCustomerForm'

// Hooks
export { useCustomersList } from './hooks/useCustomersList'

// Actions (server actions are safe for client import)
export { createCustomer, updateCustomer, deleteCustomer } from './actions'

// Types
export type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerFilters,
  CustomerListResult,
} from './types'

// NOTE: Queries (getCustomers, getCustomer) are server-only
// Import directly: import { getCustomers } from '@/features/customers/queries'
