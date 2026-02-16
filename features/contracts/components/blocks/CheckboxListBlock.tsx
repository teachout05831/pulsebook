'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'
import type { ContractBlock, BlockMode } from '../../types'

interface CheckboxItem { label: string; checked: boolean }

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

function getItems(block: ContractBlock): CheckboxItem[] {
  const items = block.content.items as CheckboxItem[] | undefined
  return items?.length ? items : [{ label: '', checked: false }]
}

export function CheckboxListBlock({ block, mode, onUpdate }: Props) {
  const items = getItems(block)
  const title = (block.content.title as string) || ''

  if (mode === 'live') {
    const toggleItem = (index: number, checked: boolean) => {
      const updated = items.map((item, i) => (i === index ? { ...item, checked } : item))
      onUpdate?.({ ...block.content, items: updated })
    }
    return (
      <div className="space-y-2">
        {title && <p className="text-sm font-medium">{title}</p>}
        {items.map((item, i) => (
          <label key={`live-${i}-${item.label}`} className="flex items-start gap-2 text-sm cursor-pointer">
            <Checkbox checked={item.checked} onCheckedChange={(c) => toggleItem(i, !!c)} className="mt-0.5" />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    )
  }

  if (mode === 'view') {
    return (
      <div className="space-y-2">
        {title && <p className="text-sm font-medium">{title}</p>}
        {items.map((item, i) => (
          <label key={`view-${i}-${item.label}`} className="flex items-start gap-2 text-sm">
            <Checkbox checked={item.checked} className="mt-0.5" />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    )
  }

  const updateItem = (index: number, field: keyof CheckboxItem, value: string | boolean) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onUpdate?.({ ...block.content, items: updated })
  }

  const addItem = () => {
    onUpdate?.({ ...block.content, items: [...items, { label: '', checked: false }] })
  }

  const removeItem = (index: number) => {
    if (items.length <= 1) return
    onUpdate?.({ ...block.content, items: items.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-2">
      <Input
        value={title}
        placeholder="Section title (optional)"
        onChange={(e) => onUpdate?.({ ...block.content, title: e.target.value })}
      />
      {items.map((item, i) => (
        <div key={`edit-${i}`} className="flex items-center gap-2">
          <Checkbox
            checked={item.checked}
            onCheckedChange={(checked) => updateItem(i, 'checked', !!checked)}
          />
          <Input
            value={item.label}
            placeholder="Checkbox label"
            className="flex-1"
            onChange={(e) => updateItem(i, 'label', e.target.value)}
          />
          <Button variant="ghost" size="icon" onClick={() => removeItem(i)} disabled={items.length <= 1}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        <Plus className="mr-1 h-4 w-4" /> Add Checkbox
      </Button>
    </div>
  )
}
