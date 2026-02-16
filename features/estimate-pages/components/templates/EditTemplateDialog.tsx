'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SECTION_LABELS } from '../../types/constants'
import type { SectionType, PageSection, PageTemplate } from '../../types'

const CATEGORIES = [
  'General', 'HVAC', 'Plumbing', 'Electrical', 'Landscaping', 'Cleaning', 'Roofing', 'Painting',
]

const SECTION_TYPES = Object.keys(SECTION_LABELS) as SectionType[]

interface EditTemplateDialogProps {
  template: PageTemplate | null
  onClose: () => void
  onSave: (id: string, input: Partial<PageTemplate>) => Promise<{ success: true } | { error: string }>
}

export function EditTemplateDialog({ template, onClose, onSave }: EditTemplateDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [checkedSections, setCheckedSections] = useState<Set<SectionType>>(new Set())
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (template) {
      setName(template.name)
      setDescription(template.description || '')
      setCategory(template.category || '')
      setCheckedSections(new Set(template.sections.map((s) => s.type as SectionType)))
    }
  }, [template])

  const toggleSection = (type: SectionType) => {
    setCheckedSections((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const handleSubmit = async () => {
    if (!template || !name.trim()) {
      toast.error('Template name is required')
      return
    }

    const sections: PageSection[] = SECTION_TYPES
      .filter((type) => checkedSections.has(type))
      .map((type, index) => {
        const existing = template.sections.find((s) => s.type === type)
        return existing
          ? { ...existing, order: index }
          : { id: crypto.randomUUID(), type, order: index, visible: true, settings: {}, content: {} }
      })

    setIsSaving(true)
    const result = await onSave(template.id, {
      name: name.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      sections,
    })
    setIsSaving(false)

    if ('error' in result) {
      toast.error(result.error)
      return
    }

    toast.success('Template updated')
    onClose()
  }

  return (
    <Dialog open={!!template} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-tpl-name">Name *</Label>
            <Input id="edit-tpl-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tpl-desc">Description</Label>
            <Textarea id="edit-tpl-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sections</Label>
            <div className="grid grid-cols-2 gap-2">
              {SECTION_TYPES.map((type) => (
                <label key={type} className="flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted/50">
                  <Checkbox checked={checkedSections.has(type)} onCheckedChange={() => toggleSection(type)} />
                  {SECTION_LABELS[type]}
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
