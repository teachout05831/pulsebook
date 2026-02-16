'use client'

import { useCallback, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

export function TextBlock({ block, mode, onUpdate }: Props) {
  const text = (block.content.text as string) || ''
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [])

  useEffect(() => {
    autoResize()
  }, [text, autoResize])

  if (mode === 'view') {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
    )
  }

  return (
    <Textarea
      ref={textareaRef}
      value={text}
      placeholder="Enter text..."
      className="min-h-[80px] resize-none overflow-hidden"
      onChange={(e) => {
        onUpdate?.({ ...block.content, text: e.target.value })
        autoResize()
      }}
    />
  )
}
