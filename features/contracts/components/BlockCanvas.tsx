'use client'

import { useState } from 'react'
import { Copy, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BlockRenderer } from './BlockRenderer'
import { STAGE_COLORS } from '../types'
import type { ContractBlock, BlockType } from '../types'

interface Props {
  blocks: ContractBlock[]
  selectedBlockId: string | null
  onSelect: (id: string) => void
  onUpdate: (id: string, content: Record<string, unknown>) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
  onAddBlock: (type: BlockType, afterIndex: number) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

const QUICK_BLOCK_TYPES: { type: BlockType; label: string }[] = [
  { type: 'company_header', label: 'Company Header' },
  { type: 'heading', label: 'Heading' },
  { type: 'text', label: 'Text' },
  { type: 'column_layout', label: 'Column Layout' },
  { type: 'pricing_table', label: 'Pricing Table' },
  { type: 'signature', label: 'Signature' },
  { type: 'table', label: 'Table' },
  { type: 'callout', label: 'Callout' },
  { type: 'status_tracker', label: 'Status Tracker' },
]

function InsertButton({ index, onAddBlock }: { index: number; onAddBlock: Props['onAddBlock'] }) {
  return (
    <div className="flex justify-center py-1 opacity-0 hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <Plus className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {QUICK_BLOCK_TYPES.map((bt) => (
            <DropdownMenuItem key={bt.type} onClick={() => onAddBlock(bt.type, index)}>
              {bt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function BlockCanvas({
  blocks,
  selectedBlockId,
  onSelect,
  onUpdate,
  onRemove,
  onDuplicate,
  onAddBlock,
  onReorder,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">No blocks yet.</p>
        <p className="text-xs mt-1">Add blocks from the palette on the left.</p>
      </div>
    )
  }

  return (
    <div className="space-y-0 p-4">
      {blocks.map((block, index) => {
        const isSelected = block.id === selectedBlockId
        const isHovered = block.id === hoveredId
        const stageColor = STAGE_COLORS[block.stage]

        return (
          <div key={block.id}>
            <div
              className={`relative rounded-md transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                borderLeft: `4px solid ${stageColor.border}`,
                backgroundColor: block.settings.background !== '#FFFFFF' ? block.settings.background : stageColor.bg,
              }}
              onClick={() => onSelect(block.id)}
              onMouseEnter={() => setHoveredId(block.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {(isSelected || isHovered) && (
                <>
                  <div className="absolute top-1 left-1 flex flex-col gap-0.5 z-10">
                    <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0}
                      onClick={(e) => { e.stopPropagation(); onReorder(index, index - 1) }}>
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === blocks.length - 1}
                      onClick={(e) => { e.stopPropagation(); onReorder(index, index + 1) }}>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 z-10">
                    <Button variant="ghost" size="icon" className="h-7 w-7"
                      onClick={(e) => { e.stopPropagation(); onDuplicate(block.id) }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500"
                      onClick={(e) => { e.stopPropagation(); onRemove(block.id) }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
              <div className="p-4">
                <BlockRenderer
                  block={block}
                  mode="edit"
                  onUpdate={(content) => onUpdate(block.id, content)}
                />
              </div>
            </div>
            <InsertButton index={index} onAddBlock={onAddBlock} />
          </div>
        )
      })}
    </div>
  )
}
