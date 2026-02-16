'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'
import type { ContractBlock, BlockMode } from '../../types'
interface PricingItem {
  description: string
  qty: number
  rate: number
}

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

function getItems(block: ContractBlock): PricingItem[] {
  const items = block.content.items as PricingItem[] | undefined
  return items?.length ? items : [{ description: '', qty: 1, rate: 0 }]
}

export function PricingTableBlock({ block, mode, onUpdate }: Props) {
  const items = getItems(block)
  const showTotal = (block.content.showTotal as boolean) ?? true
  const grandTotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0)

  const updateItem = (index: number, field: keyof PricingItem, value: string | number) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    onUpdate?.({ ...block.content, items: updated })
  }

  const addRow = () => {
    onUpdate?.({
      ...block.content,
      items: [...items, { description: '', qty: 1, rate: 0 }],
    })
  }

  const removeRow = (index: number) => {
    if (items.length <= 1) return
    onUpdate?.({
      ...block.content,
      items: items.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Description</TableHead>
            <TableHead className="w-[15%]">Qty</TableHead>
            <TableHead className="w-[15%]">Rate</TableHead>
            <TableHead className="w-[15%] text-right">Total</TableHead>
            {mode === 'edit' && <TableHead className="w-[5%]" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={`pricing-${index}`}>
              <TableCell>
                {mode === 'edit' ? (
                  <Input
                    value={item.description}
                    placeholder="Item description"
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                ) : (
                  <span className="text-sm">{item.description}</span>
                )}
              </TableCell>
              <TableCell>
                {mode === 'edit' ? (
                  <Input
                    type="number"
                    min={0}
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                  />
                ) : (
                  <span className="text-sm">{item.qty}</span>
                )}
              </TableCell>
              <TableCell>
                {mode === 'edit' ? (
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                  />
                ) : (
                  <span className="text-sm">${item.rate.toFixed(2)}</span>
                )}
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                ${(item.qty * item.rate).toFixed(2)}
              </TableCell>
              {mode === 'edit' && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(index)}
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        {showTotal && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">
                Grand Total
              </TableCell>
              <TableCell className="text-right font-bold">
                ${grandTotal.toFixed(2)}
              </TableCell>
              {mode === 'edit' && <TableCell />}
            </TableRow>
          </TableFooter>
        )}
      </Table>
      {mode === 'edit' && (
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-1 h-4 w-4" /> Add Row
        </Button>
      )}
    </div>
  )
}
