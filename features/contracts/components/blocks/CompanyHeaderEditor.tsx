'use client'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { ContractBlock } from '../../types'

type Layout = 'left' | 'center' | '3-column'

const LAYOUTS: { value: Layout; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: '3-column', label: '3-Col' },
]

const TOGGLES: { key: string; label: string }[] = [
  { key: 'showLogo', label: 'Logo' },
  { key: 'showName', label: 'Company Name' },
  { key: 'showTagline', label: 'Tagline' },
  { key: 'showPhone', label: 'Phone' },
  { key: 'showEmail', label: 'Email' },
  { key: 'showAddress', label: 'Address' },
]

interface Props {
  block: ContractBlock
  onUpdateContent: (content: Record<string, unknown>) => void
}

export function CompanyHeaderEditor({ block, onUpdateContent }: Props) {
  const layout = (block.content.layout as Layout) || 'left'

  const update = (changes: Record<string, unknown>) => {
    onUpdateContent({ ...block.content, ...changes })
  }

  return (
    <div className="border-t p-4 space-y-4">
      <Label className="text-xs text-muted-foreground">Header Settings</Label>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Layout</Label>
        <div className="flex gap-1">
          {LAYOUTS.map((l) => (
            <Button
              key={l.value}
              variant={layout === l.value ? 'default' : 'outline'}
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => update({ layout: l.value })}
            >
              {l.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium">Visible Fields</Label>
        {TOGGLES.map((t) => {
          const checked = block.content[t.key] !== undefined
            ? block.content[t.key] as boolean
            : t.key !== 'showTagline'
          return (
            <div key={t.key} className="flex items-center justify-between">
              <Label htmlFor={`header-${t.key}`} className="text-xs cursor-pointer">
                {t.label}
              </Label>
              <Switch
                id={`header-${t.key}`}
                checked={checked}
                onCheckedChange={(val) => update({ [t.key]: val })}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
