export type TagEntityType = 'customer' | 'job' | 'estimate'

export interface Tag {
  id: string
  companyId: string
  name: string
  color: string
  source: 'local' | 'external'
  externalId: string | null
  entityType: TagEntityType
  createdAt: string
}

export interface CreateTagInput {
  name: string
  color?: string
  entityType?: TagEntityType
}

export interface UpdateTagInput {
  name?: string
  color?: string
}

export const TAG_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#6B7280', // gray
  '#78716C', // stone
] as const
