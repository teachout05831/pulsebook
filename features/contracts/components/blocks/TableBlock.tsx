'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

function getHeaders(block: ContractBlock): string[] {
  const h = block.content.headers as string[] | undefined
  return h?.length ? h : ['Item', 'Details']
}

function getRows(block: ContractBlock): string[][] {
  const r = block.content.rows as string[][] | undefined
  return r?.length ? r : [['', '']]
}

export function TableBlock({ block, mode, onUpdate }: Props) {
  const headers = getHeaders(block)
  const rows = getRows(block)

  const updateHeader = (col: number, value: string) => {
    const updated = headers.map((h, i) => (i === col ? value : h))
    onUpdate?.({ ...block.content, headers: updated })
  }

  const updateCell = (row: number, col: number, value: string) => {
    const updated = rows.map((r, ri) => ri === row ? r.map((c, ci) => (ci === col ? value : c)) : r)
    onUpdate?.({ ...block.content, rows: updated })
  }

  const addColumn = () => {
    onUpdate?.({
      ...block.content,
      headers: [...headers, 'Column'],
      rows: rows.map((r) => [...r, '']),
    })
  }

  const removeColumn = (col: number) => {
    if (headers.length <= 1) return
    onUpdate?.({
      ...block.content,
      headers: headers.filter((_, i) => i !== col),
      rows: rows.map((r) => r.filter((_, i) => i !== col)),
    })
  }

  const addRow = () => {
    onUpdate?.({ ...block.content, rows: [...rows, headers.map(() => '')] })
  }

  const removeRow = (row: number) => {
    if (rows.length <= 1) return
    onUpdate?.({ ...block.content, rows: rows.filter((_, i) => i !== row) })
  }

  if (mode !== 'edit') {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h, i) => (
              <TableHead key={`h-${h}-${i}`} className="text-sm font-semibold">{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, ri) => (
            <TableRow key={`row-${ri}`}>
              {row.map((cell, ci) => (
                <TableCell key={`cell-${ri}-${ci}`} className="text-sm">{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h, i) => (
              <TableHead key={`eh-${i}`} className="p-1">
                <div className="flex items-center gap-1">
                  <Input value={h} className="h-7 text-xs font-semibold"
                    onChange={(e) => updateHeader(i, e.target.value)} />
                  {headers.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0"
                      onClick={() => removeColumn(i)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, ri) => (
            <TableRow key={`erow-${ri}`}>
              {row.map((cell, ci) => (
                <TableCell key={`ecell-${ri}-${ci}`} className="p-1">
                  <Input value={cell} className="h-7 text-xs"
                    onChange={(e) => updateCell(ri, ci, e.target.value)} />
                </TableCell>
              ))}
              <TableCell className="p-1 w-8">
                <Button variant="ghost" size="icon" className="h-6 w-6"
                  onClick={() => removeRow(ri)} disabled={rows.length <= 1}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-1 h-3 w-3" /> Row
        </Button>
        <Button variant="outline" size="sm" onClick={addColumn}>
          <Plus className="mr-1 h-3 w-3" /> Column
        </Button>
      </div>
    </div>
  )
}
