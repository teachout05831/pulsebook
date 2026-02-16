export type CustomFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'date'
  | 'checkbox'
  | 'email'
  | 'phone'
  | 'url'

export type CustomFieldEntity = 'customer' | 'job'

export interface CustomFieldDefinition {
  id: string
  companyId: string
  entityType: CustomFieldEntity
  section: string
  fieldKey: string
  label: string
  fieldType: CustomFieldType
  options: string[] | null
  isRequired: boolean
  placeholder: string | null
  sortOrder: number
  sectionOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCustomFieldInput {
  entityType: CustomFieldEntity
  section: string
  label: string
  fieldType: CustomFieldType
  options?: string[]
  isRequired?: boolean
  placeholder?: string
}

export interface UpdateCustomFieldInput {
  label?: string
  fieldType?: CustomFieldType
  section?: string
  options?: string[]
  isRequired?: boolean
  placeholder?: string
  sortOrder?: number
  sectionOrder?: number
  isActive?: boolean
}

export interface ReorderItem {
  id: string
  sortOrder: number
  sectionOrder: number
}

export interface CustomFieldSection {
  name: string
  sectionOrder: number
  fields: CustomFieldDefinition[]
}
