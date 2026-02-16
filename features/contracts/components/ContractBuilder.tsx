'use client'

import '../styles/print.css'
import { useState } from 'react'
import { Save, Eye, Pencil, Monitor, Smartphone, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useContractBuilder } from '../hooks/useContractBuilder'
import { fillVariables } from '../utils/fillVariables'
import { BlockPalette } from './BlockPalette'
import { BlockCanvas } from './BlockCanvas'
import { BlockProperties } from './BlockProperties'
import { BlockRenderer } from './BlockRenderer'
import { HtmlBlockEditor } from './blocks/HtmlBlockEditor'
import { CompanyHeaderEditor } from './blocks/CompanyHeaderEditor'
import { STAGE_COLORS } from '../types'
import type { ContractBlock } from '../types'

interface Props {
  templateId?: string
  initialBlocks?: ContractBlock[]
  onSave: (blocks: ContractBlock[]) => void
}

export function ContractBuilder({ templateId, initialBlocks, onSave }: Props) {
  const {
    blocks, selectedBlock, selectedBlockId, setSelectedBlockId,
    addBlock, removeBlock, updateBlock, updateBlockContent, reorderBlocks, duplicateBlock, setStage,
  } = useContractBuilder(initialBlocks)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b px-4 py-3 no-print">
        <h2 className="text-sm font-semibold">
          {templateId ? 'Edit Template' : 'New Template'}
        </h2>
        <div className="flex items-center gap-2">
          {previewMode && (
            <>
              <div className="flex border rounded-md">
                <Button variant={previewDevice === 'desktop' ? 'default' : 'outline'} size="sm" className="h-8 px-2" onClick={() => setPreviewDevice('desktop')}>
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button variant={previewDevice === 'mobile' ? 'default' : 'outline'} size="sm" className="h-8 px-2" onClick={() => setPreviewDevice('mobile')}>
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
            {previewMode ? <><Pencil className="h-4 w-4 mr-1" /> Edit</> : <><Eye className="h-4 w-4 mr-1" /> Preview</>}
          </Button>
          <Button size="sm" onClick={() => onSave(blocks)}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className={`mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden contract-print-area ${previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-3xl'}`}>
            <div className="space-y-0">
              {fillVariables(blocks).map((block) => {
                const stageColor = STAGE_COLORS[block.stage]
                return (
                  <div
                    key={block.id}
                    className="px-6 py-4"
                    style={{
                      borderLeft: `4px solid ${stageColor.border}`,
                      backgroundColor: block.settings?.background !== '#FFFFFF' ? block.settings?.background : stageColor.bg,
                    }}
                  >
                    <BlockRenderer block={block} mode="view" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[240px] border-r overflow-y-auto shrink-0">
            <BlockPalette onAddBlock={(type) => addBlock(type)} />
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <BlockCanvas
              blocks={blocks} selectedBlockId={selectedBlockId}
              onSelect={setSelectedBlockId} onUpdate={updateBlockContent}
              onRemove={removeBlock} onDuplicate={duplicateBlock}
              onAddBlock={(type, afterIndex) => addBlock(type, afterIndex)}
              onReorder={reorderBlocks}
            />
          </div>
          <div className="w-96 border-l overflow-y-auto shrink-0">
            <BlockProperties
              block={selectedBlock}
              onUpdate={(changes) => { if (selectedBlockId) updateBlock(selectedBlockId, changes) }}
              onStageChange={(stage) => { if (selectedBlockId) setStage(selectedBlockId, stage) }}
            />
            {selectedBlock?.type === 'company_header' && (
              <CompanyHeaderEditor
                block={selectedBlock}
                onUpdateContent={(content) => { if (selectedBlockId) updateBlockContent(selectedBlockId, content) }}
              />
            )}
            {selectedBlock?.type === 'custom_html' && (
              <HtmlBlockEditor
                block={selectedBlock}
                onUpdateContent={(content) => { if (selectedBlockId) updateBlockContent(selectedBlockId, content) }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
