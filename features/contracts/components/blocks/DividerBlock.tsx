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

const STYLES: Record<string, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
}

export function DividerBlock({ block, mode, onUpdate }: Props) {
  const style = (block.content.style as string) || 'solid'

  if (mode === 'view') {
    return <hr className={`border-t ${STYLES[style] || ''} border-gray-300 my-2`} />
  }

  return (
    <div className="space-y-2">
      <Select
        value={style}
        onValueChange={(val) => onUpdate?.({ ...block.content, style: val })}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="solid">Solid</SelectItem>
          <SelectItem value="dashed">Dashed</SelectItem>
          <SelectItem value="dotted">Dotted</SelectItem>
        </SelectContent>
      </Select>
      <hr className={`border-t ${STYLES[style] || ''} border-gray-300`} />
    </div>
  )
}
