'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STAGE_COLORS } from '../types'
import type { ContractBlock, BlockStage, BlockSettings } from '../types'

interface Props {
  block: ContractBlock | null
  onUpdate: (changes: Partial<ContractBlock>) => void
  onStageChange: (stage: BlockStage) => void
}

const STAGES: BlockStage[] = ['before_job', 'neutral', 'crew', 'after_job']

const TYPE_LABELS: Record<string, string> = {
  heading: 'Heading', text: 'Text', column_layout: 'Column Layout',
  pricing_table: 'Pricing Table', signature: 'Signature',
  timestamp_hourly: 'Timestamp & Hourly', callout: 'Callout', payment: 'Payment',
  detail_grid: 'Detail Grid', checkbox_list: 'Checkbox List', divider: 'Divider', status_tracker: 'Status Tracker',
  table: 'Table', company_header: 'Company Header', custom_html: 'Custom HTML',
}

const BG_OPTIONS = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#F9FAFB', label: 'Light Gray' },
  { value: '#EFF6FF', label: 'Light Blue' },
  { value: '#FEFCE8', label: 'Light Yellow' },
]

function SettingsSelect({ label, value, onChange, options }: {
  label: string; value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function BlockProperties({ block, onUpdate, onStageChange }: Props) {
  if (!block) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-muted-foreground">
        <p className="text-sm text-center">Select a block to edit its properties</p>
      </div>
    )
  }

  const updateSettings = (changes: Partial<BlockSettings>) => {
    onUpdate({ settings: { ...block.settings, ...changes } })
  }

  return (
    <div className="space-y-5 p-4">
      <div>
        <Label className="text-xs text-muted-foreground">Block Type</Label>
        <p className="text-sm font-medium mt-1">{TYPE_LABELS[block.type] || block.type}</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Stage</Label>
        <div className="grid grid-cols-2 gap-2">
          {STAGES.map((stage) => {
            const color = STAGE_COLORS[stage]
            const isActive = block.stage === stage
            return (
              <button
                key={stage}
                type="button"
                className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                  isActive ? 'border-blue-500 bg-blue-50 font-medium' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onStageChange(stage)}
              >
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color.border }} />
                {color.label}
              </button>
            )
          })}
        </div>
      </div>

      <SettingsSelect
        label="Border"
        value={block.settings.border}
        onChange={(val) => updateSettings({ border: val as BlockSettings['border'] })}
        options={[
          { value: 'none', label: 'None' }, { value: 'thin', label: 'Thin' },
          { value: 'thick', label: 'Thick' }, { value: 'dashed', label: 'Dashed' },
        ]}
      />

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Background</Label>
        <Select value={block.settings.background} onValueChange={(val) => updateSettings({ background: val })}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {BG_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded border border-gray-200" style={{ backgroundColor: opt.value }} />
                  {opt.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <SettingsSelect
        label="Padding"
        value={block.settings.padding}
        onChange={(val) => updateSettings({ padding: val as BlockSettings['padding'] })}
        options={[
          { value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' },
        ]}
      />

      <SettingsSelect
        label="Width"
        value={block.settings.width}
        onChange={(val) => updateSettings({ width: val as BlockSettings['width'] })}
        options={[{ value: 'full', label: 'Full Width' }, { value: 'contained', label: 'Contained' }]}
      />
    </div>
  )
}
