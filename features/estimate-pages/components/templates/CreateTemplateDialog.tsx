'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
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
import type { SectionType, PageSection } from '../../types'

const TEMPLATE_CATEGORIES = [
  'General', 'HVAC', 'Plumbing', 'Electrical', 'Landscaping', 'Cleaning', 'Roofing', 'Painting',
]

const DEFAULT_CHECKED: SectionType[] = ['hero', 'scope', 'pricing', 'approval']

const SECTION_TYPES = Object.keys(SECTION_LABELS) as SectionType[]

interface CreateTemplateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (input: {
    name: string
    description?: string
    category?: string
    sections: PageSection[]
  }) => Promise<{ success?: boolean; error?: string }>
}

export function CreateTemplateDialog({ open, onClose, onCreate }: CreateTemplateDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [checkedSections, setCheckedSections] = useState<Set<SectionType>>(new Set(DEFAULT_CHECKED))
  const [isCreating, setIsCreating] = useState(false)

  const toggleSection = (type: SectionType) => {
    setCheckedSections((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Template name is required')
      return
    }

    const sections: PageSection[] = SECTION_TYPES
      .filter((type) => checkedSections.has(type))
      .map((type, index) => ({
        id: crypto.randomUUID(),
        type,
        order: index,
        visible: true,
        settings: {},
        content: {},
      }))

    setIsCreating(true)
    const result = await onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      category: category || undefined,
      sections,
    })
    setIsCreating(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Template created')
    setName('')
    setDescription('')
    setCategory('')
    setCheckedSections(new Set(DEFAULT_CHECKED))
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
          <DialogDescription>Set up a new reusable estimate page template.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="tpl-name">Name *</Label>
            <Input id="tpl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Standard HVAC Estimate" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tpl-desc">Description</Label>
            <Textarea id="tpl-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." rows={2} />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Sections</Label>
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
          <Button variant="outline" onClick={onClose} disabled={isCreating}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
