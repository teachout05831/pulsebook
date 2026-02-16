'use client'

import { useState } from 'react'
import { Code2, Library, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { HTML_BLOCKS, HTML_BLOCK_CATEGORIES, type HtmlBlock } from '@/features/estimate-pages/types/htmlBlocks'
import { HtmlBlockPicker, type BlockSource } from '@/features/estimate-pages/components/page-builder/HtmlBlockPicker'
import { BlockFieldList } from '@/features/estimate-pages/components/page-builder/BlockFieldList'
import { replaceVariables } from '@/features/estimate-pages/utils/blockHelpers'
import { CONTRACT_HTML_BLOCKS, CONTRACT_BLOCK_CATEGORIES } from '../../data/contractHtmlBlocks'
import type { ContractBlock } from '../../types'

const ALL_BLOCKS = [...CONTRACT_HTML_BLOCKS, ...HTML_BLOCKS]
const PICKER_SOURCES: BlockSource[] = [
  { label: 'Contract', blocks: CONTRACT_HTML_BLOCKS, categories: CONTRACT_BLOCK_CATEGORIES },
  { label: 'Marketing', blocks: HTML_BLOCKS, categories: HTML_BLOCK_CATEGORIES },
]

interface Props {
  block: ContractBlock
  onUpdateContent: (content: Record<string, unknown>) => void
}

export function HtmlBlockEditor({ block, onUpdateContent }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [editing, setEditing] = useState<'html' | 'css' | null>(null)

  const html = (block.content.html as string) || ''
  const css = (block.content.css as string) || ''
  const blockId = block.content.blockId as string | undefined
  const blockValues = (block.content.blockValues as Record<string, string>) || {}
  const htmlBlock = blockId ? ALL_BLOCKS.find(b => b.id === blockId) : null

  const updateContent = (changes: Record<string, unknown>) => {
    onUpdateContent({ ...block.content, ...changes })
  }

  const handleBlockSelect = (selected: HtmlBlock) => {
    const newValues: Record<string, string> = {}
    selected.variables.forEach(v => { newValues[v] = blockValues[v] || '' })
    updateContent({
      html: replaceVariables(selected.html, newValues),
      css: replaceVariables(selected.css, newValues),
      blockId: selected.id,
      blockValues: newValues,
    })
    setShowPicker(false)
  }

  const handleFieldChange = (varName: string, value: string) => {
    if (!htmlBlock) return
    const newValues = { ...blockValues, [varName]: value }
    updateContent({
      html: replaceVariables(htmlBlock.html, newValues),
      css: replaceVariables(htmlBlock.css, newValues),
      blockValues: newValues,
    })
  }

  const handleSwitchToRaw = () => {
    updateContent({ blockId: undefined, blockValues: undefined })
  }

  return (
    <div className="border-t p-4 space-y-4">
      <Label className="text-xs text-muted-foreground">Content</Label>

      {htmlBlock ? (
        <>
          <div>
            <p className="text-sm font-medium">{htmlBlock.name}</p>
            <p className="text-xs text-muted-foreground">{htmlBlock.description}</p>
          </div>
          <BlockFieldList variables={htmlBlock.variables} values={blockValues} onChange={handleFieldChange} />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => setShowPicker(true)}>
              <RefreshCw className="h-3 w-3 mr-1" /> Switch Block
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={handleSwitchToRaw}>
              <Code2 className="h-3 w-3 mr-1" /> Raw HTML
            </Button>
          </div>
        </>
      ) : (
        <>
          <Button variant="outline" size="sm" className="w-full h-9 text-xs" onClick={() => setShowPicker(true)}>
            <Library className="h-3.5 w-3.5 mr-1.5" /> Browse Block Library
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => setEditing('html')}>
              <Code2 className="h-3 w-3 mr-1" /> {html ? `HTML (${html.length})` : 'Add HTML'}
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => setEditing('css')}>
              <Code2 className="h-3 w-3 mr-1" /> {css ? `CSS (${css.length})` : 'Add CSS'}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Use <code>:scope</code> in CSS. Variables: @CustomerName @Email @Phone @Date @JobTitle @TotalDue
          </p>
          <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null) }}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex gap-2">
                  <Button variant={editing === 'html' ? 'default' : 'outline'} size="sm" onClick={() => setEditing('html')}>HTML</Button>
                  <Button variant={editing === 'css' ? 'default' : 'outline'} size="sm" onClick={() => setEditing('css')}>CSS</Button>
                </DialogTitle>
              </DialogHeader>
              <Textarea
                className="flex-1 font-mono text-xs leading-relaxed resize-none"
                placeholder={editing === 'html' ? '<div>Your HTML here...</div>' : ':scope .my-class { color: red; }'}
                value={editing === 'html' ? html : css}
                onChange={(e) => editing && updateContent({ [editing]: e.target.value })}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      <HtmlBlockPicker open={showPicker} onClose={() => setShowPicker(false)} onSelect={handleBlockSelect} sources={PICKER_SOURCES} />
    </div>
  )
}
