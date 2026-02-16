'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, GripVertical, Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { CustomFieldSection, CustomFieldDefinition } from '../types'

interface Props {
  section: CustomFieldSection
  onAddField: (section: string) => void
  onEditField: (field: CustomFieldDefinition) => void
  onDeleteField: (id: string) => void
}

const TYPE_LABELS: Record<string, string> = {
  text: 'Text', textarea: 'Text Area', number: 'Number', select: 'Dropdown',
  date: 'Date', checkbox: 'Checkbox', email: 'Email', phone: 'Phone', url: 'URL',
}

export function SectionCard({ section, onAddField, onEditField, onDeleteField }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border rounded-lg">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">{section.name}</span>
          <Badge variant="secondary" className="text-xs">{section.fields.length} fields</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onAddField(section.name) }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Field
        </Button>
      </div>
      {isOpen && (
        <div className="border-t">
          {section.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground p-3">No fields in this section</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="w-8 p-2" />
                  <th className="text-left p-2 font-medium">Label</th>
                  <th className="text-left p-2 font-medium">Type</th>
                  <th className="text-left p-2 font-medium">Required</th>
                  <th className="w-20 p-2" />
                </tr>
              </thead>
              <tbody>
                {section.fields.map((field) => (
                  <tr key={field.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-2 text-center">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                    </td>
                    <td className="p-2 text-sm font-medium">{field.label}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-xs">{TYPE_LABELS[field.fieldType] || field.fieldType}</Badge>
                    </td>
                    <td className="p-2 text-sm">{field.isRequired ? 'Yes' : 'No'}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditField(field)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onDeleteField(field.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
