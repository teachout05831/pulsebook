'use client'

import { useMemo } from 'react'
import DOMPurify from 'dompurify'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

export function CustomHtmlBlock({ block, mode }: Props) {
  const html = (block.content.html as string) || ''
  const css = (block.content.css as string) || ''
  const scopedId = `contract-html-${block.id}`

  const scopedCss = useMemo(() => {
    if (!css) return ''
    return css.replace(/:scope/g, `#${scopedId}`)
  }, [css, scopedId])

  // Empty state
  if (!html && !css) {
    return (
      <div className="py-8 text-center text-muted-foreground text-sm">
        {mode === 'edit'
          ? 'Select this block and use the right panel to add content.'
          : 'Custom HTML block — no content added.'}
      </div>
    )
  }

  // All modes: render the HTML with scoped CSS
  return (
    <div id={scopedId}>
      {scopedCss && <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(scopedCss) }} />}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
    </div>
  )
}
