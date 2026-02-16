'use client'

import { useState, useCallback } from 'react'
import { migrateBlocks } from '../utils/migrateBlocks'
import type { ContractBlock, BlockType, BlockStage } from '../types'

const DEFAULT_SETTINGS = {
  border: 'none' as const,
  background: '#FFFFFF',
  padding: 'md' as const,
  width: 'full' as const,
}

export function useContractBuilder(initialBlocks: ContractBlock[] = []) {
  const [blocks, setBlocks] = useState<ContractBlock[]>(migrateBlocks(initialBlocks))
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null

  const addBlock = useCallback((type: BlockType, afterIndex?: number) => {
    const newBlock: ContractBlock = {
      id: crypto.randomUUID(),
      type,
      stage: 'neutral',
      content: {},
      settings: { ...DEFAULT_SETTINGS },
      order: 0,
    }
    setBlocks((prev) => {
      const idx = afterIndex !== undefined ? afterIndex + 1 : prev.length
      const updated = [...prev]
      updated.splice(idx, 0, newBlock)
      return updated.map((b, i) => ({ ...b, order: i }))
    })
    setSelectedBlockId(newBlock.id)
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i })))
    setSelectedBlockId((prev) => (prev === id ? null : prev))
  }, [])

  const updateBlock = useCallback((id: string, changes: Partial<ContractBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...changes } : b)))
  }, [])

  const updateBlockContent = useCallback((id: string, content: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: { ...b.content, ...content } } : b)))
  }, [])

  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated.map((b, i) => ({ ...b, order: i }))
    })
  }, [])

  const duplicateBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      if (idx === -1) return prev
      const clone = { ...prev[idx], id: crypto.randomUUID() }
      const updated = [...prev]
      updated.splice(idx + 1, 0, clone)
      return updated.map((b, i) => ({ ...b, order: i }))
    })
  }, [])

  const setStage = useCallback((id: string, stage: BlockStage) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, stage } : b)))
  }, [])

  return {
    blocks,
    selectedBlock,
    selectedBlockId,
    setSelectedBlockId,
    addBlock,
    removeBlock,
    updateBlock,
    updateBlockContent,
    reorderBlocks,
    duplicateBlock,
    setStage,
    setBlocks,
  }
}
