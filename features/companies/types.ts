export interface Company {
  id: string
  name: string
  slug: string
  settings: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface UserCompany {
  id: string
  userId: string
  companyId: string
  role: 'owner' | 'admin' | 'member'
  company: Company
  createdAt: string
}

export interface CreateCompanyInput {
  name: string
}

export interface SwitchCompanyResult {
  success: boolean
  error?: string
}
