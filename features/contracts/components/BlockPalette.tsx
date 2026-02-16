'use client'

import {
  Type,
  AlignLeft,
  Columns,
  Table,
  Grid3x3,
  Building2,
  Clock,
  PenTool,
  AlertCircle,
  CreditCard,
  LayoutList,
  CheckSquare,
  Minus,
  ListChecks,
  Code2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlockType } from '../types'

interface Props {
  onAddBlock: (type: BlockType) => void
}

interface BlockOption {
  type: BlockType
  label: string
  icon: React.ReactNode
}

const BLOCK_CATEGORIES: { label: string; blocks: BlockOption[] }[] = [
  {
    label: 'Content',
    blocks: [
      { type: 'company_header', label: 'Company Header', icon: <Building2 className="h-4 w-4" /> },
      { type: 'heading', label: 'Heading', icon: <Type className="h-4 w-4" /> },
      { type: 'text', label: 'Text', icon: <AlignLeft className="h-4 w-4" /> },
      { type: 'column_layout', label: 'Column Layout', icon: <Columns className="h-4 w-4" /> },
      { type: 'divider', label: 'Divider', icon: <Minus className="h-4 w-4" /> },
      { type: 'custom_html', label: 'Custom HTML', icon: <Code2 className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Data',
    blocks: [
      { type: 'detail_grid', label: 'Detail Grid', icon: <LayoutList className="h-4 w-4" /> },
      { type: 'pricing_table', label: 'Pricing Table', icon: <Table className="h-4 w-4" /> },
      { type: 'table', label: 'Table', icon: <Grid3x3 className="h-4 w-4" /> },
      { type: 'timestamp_hourly', label: 'Timestamp & Hourly', icon: <Clock className="h-4 w-4" /> },
      { type: 'checkbox_list', label: 'Checkbox List', icon: <CheckSquare className="h-4 w-4" /> },
    ],
  },
  {
    label: 'Actions',
    blocks: [
      { type: 'signature', label: 'Signature', icon: <PenTool className="h-4 w-4" /> },
      { type: 'callout', label: 'Callout', icon: <AlertCircle className="h-4 w-4" /> },
      { type: 'payment', label: 'Payment', icon: <CreditCard className="h-4 w-4" /> },
      { type: 'status_tracker', label: 'Status Tracker', icon: <ListChecks className="h-4 w-4" /> },
    ],
  },
]

export function BlockPalette({ onAddBlock }: Props) {
  return (
    <div className="space-y-4 p-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Blocks
      </p>
      {BLOCK_CATEGORIES.map((category) => (
        <div key={category.label} className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground font-medium px-2">
            {category.label}
          </p>
          {category.blocks.map((block) => (
            <Button
              key={block.type}
              variant="ghost"
              className="w-full justify-start gap-2 text-sm h-9"
              onClick={() => onAddBlock(block.type)}
            >
              {block.icon}
              {block.label}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}
