'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import type { ContractBlock, BlockMode } from '../../types'

interface DetailRow { label: string; value: string }

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

function getRows(block: ContractBlock): DetailRow[] {
  const rows = block.content.rows as DetailRow[] | undefined
  return rows?.length ? rows : [{ label: '', value: '' }]
}

export function DetailGridBlock({ block, mode, onUpdate }: Props) {
  const rows = getRows(block)
  const columns = (block.content.columns as number) || 2

  if (mode === 'view') {
    return (
      <div className={`grid gap-x-8 gap-y-1.5 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {rows.map((row, i) => (
          <div key={`${row.label}-${i}`} className="flex items-baseline gap-2 text-sm">
            <span className="font-medium text-muted-foreground shrink-0">{row.label}:</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const updateRow = (index: number, field: keyof DetailRow, value: string) => {
    const updated = rows.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    onUpdate?.({ ...block.content, rows: updated })
  }

  const addRow = () => {
    onUpdate?.({ ...block.content, rows: [...rows, { label: '', value: '' }] })
  }

  const removeRow = (index: number) => {
    if (rows.length <= 1) return
    onUpdate?.({ ...block.content, rows: rows.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">Columns:</label>
        <select
          value={columns}
          className="border rounded px-2 py-1 text-xs"
          onChange={(e) => onUpdate?.({ ...block.content, columns: Number(e.target.value) })}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </div>
      {rows.map((row, i) => (
        <div key={`edit-${i}`} className="flex items-center gap-2">
          <Input
            value={row.label}
            placeholder="Label"
            className="w-[40%]"
            onChange={(e) => updateRow(i, 'label', e.target.value)}
          />
          <Input
            value={row.value}
            placeholder="Value or @Variable"
            className="flex-1"
            onChange={(e) => updateRow(i, 'value', e.target.value)}
          />
          <Button variant="ghost" size="icon" onClick={() => removeRow(i)} disabled={rows.length <= 1}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addRow}>
        <Plus className="mr-1 h-4 w-4" /> Add Row
      </Button>
    </div>
  )
}
