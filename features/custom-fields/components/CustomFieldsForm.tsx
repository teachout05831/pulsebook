'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useCustomFieldDefinitions } from '../hooks/useCustomFieldDefinitions'
import type { CustomFieldEntity, CustomFieldDefinition } from '../types'

interface Props {
  entityType: CustomFieldEntity
  values: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
}

function renderField(
  field: CustomFieldDefinition,
  value: unknown,
  onValueChange: (key: string, val: unknown) => void
) {
  const strVal = (value ?? '') as string

  switch (field.fieldType) {
    case 'textarea':
      return (
        <Textarea
          value={strVal}
          onChange={(e) => onValueChange(field.fieldKey, e.target.value)}
          placeholder={field.placeholder || ''}
          rows={3}
        />
      )
    case 'number':
      return (
        <Input
          type="number"
          value={strVal}
          onChange={(e) => onValueChange(field.fieldKey, e.target.value)}
          placeholder={field.placeholder || ''}
        />
      )
    case 'date':
      return (
        <Input
          type="date"
          value={strVal}
          onChange={(e) => onValueChange(field.fieldKey, e.target.value)}
        />
      )
    case 'email':
    case 'phone':
    case 'url': {
      const typeMap = { email: 'email', phone: 'tel', url: 'url' } as const
      return (
        <Input
          type={typeMap[field.fieldType as keyof typeof typeMap]}
          value={strVal}
          onChange={(e) => onValueChange(field.fieldKey, e.target.value)}
          placeholder={field.placeholder || ''}
        />
      )
    }
    case 'checkbox':
      return (
        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            checked={!!value}
            onCheckedChange={(checked) => onValueChange(field.fieldKey, !!checked)}
          />
          <span className="text-sm">{field.placeholder || 'Yes'}</span>
        </div>
      )
    case 'select':
      return (
        <Select value={strVal} onValueChange={(v) => onValueChange(field.fieldKey, v)}>
          <SelectTrigger><SelectValue placeholder={field.placeholder || 'Select...'} /></SelectTrigger>
          <SelectContent>
            {(field.options || []).map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    default:
      return (
        <Input
          value={strVal}
          onChange={(e) => onValueChange(field.fieldKey, e.target.value)}
          placeholder={field.placeholder || ''}
        />
      )
  }
}

export function CustomFieldsForm({ entityType, values, onChange }: Props) {
  const { sections, isLoading } = useCustomFieldDefinitions(entityType)

  const handleValueChange = (key: string, val: unknown) => {
    onChange({ ...values, [key]: val })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (sections.length === 0) return null

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.name}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{section.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.fieldKey} className={field.fieldType === 'textarea' ? 'md:col-span-2' : ''}>
                  <div className="space-y-2">
                    <Label>{field.label}{field.isRequired ? ' *' : ''}</Label>
                    {renderField(field, values[field.fieldKey], handleValueChange)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
