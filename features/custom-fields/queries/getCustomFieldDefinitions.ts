import { getAuthCompany } from '@/lib/auth/getAuthCompany'
import type { CustomFieldDefinition, CustomFieldEntity, CustomFieldSection } from '../types'

export async function getCustomFieldDefinitions(
  entityType?: CustomFieldEntity
): Promise<CustomFieldSection[]> {
  const { supabase, companyId } = await getAuthCompany()

  let query = supabase
    .from('custom_field_definitions')
    .select('id, company_id, entity_type, section, field_key, label, field_type, options, is_required, placeholder, sort_order, section_order, is_active, created_at, updated_at')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('section_order', { ascending: true })
    .order('sort_order', { ascending: true })
    .limit(200)

  if (entityType) {
    query = query.eq('entity_type', entityType)
  }

  const { data, error } = await query
  if (error) throw error

  const definitions: CustomFieldDefinition[] = (data || []).map((row) => ({
    id: row.id,
    companyId: row.company_id,
    entityType: row.entity_type as CustomFieldEntity,
    section: row.section,
    fieldKey: row.field_key,
    label: row.label,
    fieldType: row.field_type as CustomFieldDefinition['fieldType'],
    options: row.options,
    isRequired: row.is_required,
    placeholder: row.placeholder,
    sortOrder: row.sort_order,
    sectionOrder: row.section_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))

  const sectionMap = new Map<string, CustomFieldSection>()
  for (const def of definitions) {
    if (!sectionMap.has(def.section)) {
      sectionMap.set(def.section, {
        name: def.section,
        sectionOrder: def.sectionOrder,
        fields: [],
      })
    }
    sectionMap.get(def.section)!.fields.push(def)
  }

  return Array.from(sectionMap.values())
    .sort((a, b) => a.sectionOrder - b.sectionOrder)
}
