'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { TAG_COLORS } from '../types'
import type { Tag } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (data: { name: string; color: string }) => Promise<{ error?: string }>
  editingTag?: Tag | null
}

export function TagEditor({ open, onClose, onSave, editingTag }: Props) {
  const [name, setName] = useState(editingTag?.name || '')
  const [color, setColor] = useState(editingTag?.color || TAG_COLORS[0])
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    setIsSaving(true)
    setError(null)

    const result = await onSave({ name: name.trim(), color })
    setIsSaving(false)
    if (result.error) { setError(result.error); return }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{editingTag ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP, Residential, Commercial"
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-7 w-7 rounded-full border-2 transition-transform ${
                    color === c ? 'border-gray-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Preview:</span>
            <span
              className="inline-flex items-center gap-1 rounded-full text-xs px-2 py-0.5 font-medium"
              style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
              {name || 'Tag Name'}
            </span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : editingTag ? 'Update' : 'Add Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
