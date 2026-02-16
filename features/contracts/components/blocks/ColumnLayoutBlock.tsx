'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlockRenderer } from '../BlockRenderer'
import type { ContractBlock, BlockMode, CellType, ColumnCell } from '../../types'

interface Props { block: ContractBlock; mode: BlockMode; onUpdate?: (content: Record<string, unknown>) => void }

const CELL_OPTIONS: { value: CellType; label: string }[] = [
  { value: 'text', label: 'Text' }, { value: 'heading', label: 'Heading' },
  { value: 'signature', label: 'Signature' }, { value: 'detail_grid', label: 'Detail Grid' },
  { value: 'callout', label: 'Callout' }, { value: 'checkbox_list', label: 'Checkbox List' },
  { value: 'timestamp_hourly', label: 'Timer / Hourly' }, { value: 'table', label: 'Table' },
]

const BG_OPTIONS = [
  { value: '#FFFFFF', label: 'White' }, { value: '#F3F4F6', label: 'Gray' },
  { value: '#DBEAFE', label: 'Blue' }, { value: '#FEF3C7', label: 'Yellow' },
  { value: '#D1FAE5', label: 'Green' }, { value: '#FCE7F3', label: 'Pink' },
]

const mkCell = (): ColumnCell => ({ id: crypto.randomUUID(), cellType: 'text', content: { text: '' } })

function cellToBlock(cell: ColumnCell, parent: ContractBlock): ContractBlock {
  return { id: cell.id, type: cell.cellType as ContractBlock['type'], stage: parent.stage, content: cell.content, settings: parent.settings, order: 0 }
}

export function ColumnLayoutBlock({ block, mode, onUpdate }: Props) {
  const columns = (block.content.columns as ColumnCell[])?.length ? (block.content.columns as ColumnCell[]) : [mkCell(), mkCell()]
  const columnCount = (block.content.columnCount as number) || 2
  const gridStyle = { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }

  const updateCol = (index: number, patch: Partial<ColumnCell>) => {
    const updated = columns.map((col, i) => i === index ? { ...col, ...patch } : col)
    onUpdate?.({ ...block.content, columns: updated })
  }

  const setColumnCount = (count: number) => {
    let cols = [...columns]
    while (cols.length < count) cols.push(mkCell())
    if (cols.length > count) cols = cols.slice(0, count)
    onUpdate?.({ ...block.content, columnCount: count, columns: cols })
  }

  if (mode !== 'edit') {
    return (
      <div className="grid gap-4" style={gridStyle}>
        {columns.slice(0, columnCount).map((col, i) => (
          <div key={col.id || i} className="rounded-md p-3"
            style={{ backgroundColor: col.background && col.background !== '#FFFFFF' ? col.background : undefined }}>
            <BlockRenderer block={cellToBlock(col, block)} mode={mode}
              onUpdate={(content) => updateCol(i, { content: { ...col.content, ...content } })} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Columns:</span>
        {[2, 3, 4].map((n) => (
          <Button key={n} variant={columnCount === n ? 'default' : 'outline'} size="sm"
            className="h-7 w-7 p-0" onClick={() => setColumnCount(n)}>{n}</Button>
        ))}
      </div>
      <div className="grid gap-3" style={gridStyle}>
        {columns.slice(0, columnCount).map((col, i) => (
          <div key={col.id || i} className="space-y-2 border rounded-md p-2"
            style={{ backgroundColor: col.background || '#FFFFFF' }}>
            <Select value={col.cellType} onValueChange={(val) => updateCol(i, { cellType: val as CellType, content: {} })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CELL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={col.background || '#FFFFFF'} onValueChange={(val) => updateCol(i, { background: val })}>
              <SelectTrigger className="h-8 text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded border shrink-0" style={{ backgroundColor: col.background || '#FFFFFF' }} />
                  <span>{BG_OPTIONS.find(o => o.value === (col.background || '#FFFFFF'))?.label || 'Color'}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                {BG_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded border" style={{ backgroundColor: o.value }} />
                      {o.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <BlockRenderer block={cellToBlock(col, block)} mode="edit"
              onUpdate={(content) => updateCol(i, { content: { ...col.content, ...content } })} />
          </div>
        ))}
      </div>
    </div>
  )
}
