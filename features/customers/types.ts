export interface Customer {
  id: string
  companyId: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  notes: string | null
  customFields: Record<string, unknown>
  accountBalance?: number
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerInput {
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
}

export interface UpdateCustomerInput {
  name?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
}

export interface CustomerFilters {
  search?: string
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CustomerListResult {
  data: Customer[]
  total: number
}
