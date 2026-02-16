'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { CustomFieldDefinition, CustomFieldType } from '../types'

const FIELD_TYPES: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
]

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, unknown>) => Promise<{ error?: string }>
  existingSections: string[]
  editingField?: CustomFieldDefinition | null
}

export function CustomFieldEditor({ open, onClose, onSave, existingSections, editingField }: Props) {
  const [label, setLabel] = useState(editingField?.label || '')
  const [fieldType, setFieldType] = useState<CustomFieldType>(editingField?.fieldType || 'text')
  const [section, setSection] = useState(editingField?.section || existingSections[0] || 'General')
  const [newSection, setNewSection] = useState('')
  const [isRequired, setIsRequired] = useState(editingField?.isRequired || false)
  const [placeholder, setPlaceholder] = useState(editingField?.placeholder || '')
  const [options, setOptions] = useState(editingField?.options?.join(', ') || '')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!label.trim()) { setError('Label is required'); return }
    setIsSaving(true)
    setError(null)

    const finalSection = newSection.trim() || section
    const data: Record<string, unknown> = {
      label: label.trim(),
      fieldType,
      section: finalSection,
      isRequired,
      placeholder: placeholder || null,
      options: fieldType === 'select' ? options.split(',').map(o => o.trim()).filter(Boolean) : null,
    }

    const result = await onSave(data)
    setIsSaving(false)
    if (result.error) { setError(result.error); return }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingField ? 'Edit Field' : 'Add Custom Field'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <div className="space-y-2">
            <Label>Label *</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Starting Address" />
          </div>
          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select value={fieldType} onValueChange={(v) => setFieldType(v as CustomFieldType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {existingSections.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="Or type a new section name..." className="mt-1" />
          </div>
          {fieldType === 'select' && (
            <div className="space-y-2">
              <Label>Options (comma-separated)</Label>
              <Input value={options} onChange={(e) => setOptions(e.target.value)} placeholder="Option 1, Option 2, Option 3" />
            </div>
          )}
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder="Placeholder text..." />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="required" checked={isRequired} onCheckedChange={(v) => setIsRequired(!!v)} />
            <Label htmlFor="required" className="font-normal">Required field</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : editingField ? 'Update' : 'Add Field'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
