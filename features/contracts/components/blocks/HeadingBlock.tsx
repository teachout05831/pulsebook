'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

const LEVEL_STYLES = {
  h1: 'text-2xl font-bold',
  h2: 'text-xl font-semibold',
  h3: 'text-lg font-medium',
} as const

type HeadingLevel = keyof typeof LEVEL_STYLES

export function HeadingBlock({ block, mode, onUpdate }: Props) {
  const text = (block.content.text as string) || ''
  const level = (block.content.level as HeadingLevel) || 'h1'

  if (mode === 'view') {
    const Tag = level
    return <Tag className={LEVEL_STYLES[level]}>{text}</Tag>
  }

  return (
    <div className="space-y-2">
      <Select
        value={level}
        onValueChange={(val) => onUpdate?.({ ...block.content, level: val })}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="h1">H1</SelectItem>
          <SelectItem value="h2">H2</SelectItem>
          <SelectItem value="h3">H3</SelectItem>
        </SelectContent>
      </Select>
      <div
        className={`${LEVEL_STYLES[level]} outline-none rounded px-1 focus:ring-2 focus:ring-ring`}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate?.({ ...block.content, text: e.currentTarget.textContent || '' })
        }
      >
        {text}
      </div>
    </div>
  )
}
