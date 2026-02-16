'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useContractInstance } from './useContractInstance'
import { useOfflineContracts } from './useOfflineContracts'
import { useGps } from './useGps'
import { offlineFetch } from '../utils/offlineFetch'
import type { ContractBlock } from '../types'

export function useContractLive(instanceId: string | null) {
  const { instance, isLoading, error, update, refresh } = useContractInstance(instanceId)
  const { capture } = useGps()
  const { isOnline, pendingSyncs, queueAction, cacheInstance } = useOfflineContracts()
  const [isSaving, setIsSaving] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  const filledBlocks: ContractBlock[] = instance?.filledBlocks || instance?.templateSnapshot?.blocks || []

  const send = useCallback((url: string, body: unknown) => {
    return offlineFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }, queueAction)
  }, [queueAction])

  const updateBlock = useCallback(async (blockId: string, content: Record<string, unknown>) => {
    const updated = filledBlocks.map(b => b.id === blockId ? { ...b, content } : b)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsSaving(true)
      await update({ filledBlocks: updated })
      if (instance) cacheInstance({ ...instance, filledBlocks: updated })
      setIsSaving(false)
    }, 500)
  }, [filledBlocks, update, instance, cacheInstance])

  const recordSignature = useCallback(async (blockId: string, signatureData: string) => {
    const gps = await capture()
    const updated = filledBlocks.map(b =>
      b.id === blockId ? { ...b, content: { ...b.content, signed: true, signatureData } } : b
    )
    setIsSaving(true)
    await update({ filledBlocks: updated })
    if (instanceId) {
      await send('/api/contracts/signatures', {
        contractId: instanceId, blockId,
        role: filledBlocks.find(b => b.id === blockId)?.content.role || 'Customer',
        signatureData, gpsLatitude: gps?.lat ?? null, gpsLongitude: gps?.lng ?? null,
      })
    }
    setIsSaving(false)
  }, [filledBlocks, update, capture, instanceId, send])

  const recordTimeEntry = useCallback(async (data: {
    startTime: string; endTime: string; reason?: string; billable?: boolean
  }) => {
    const gps = await capture()
    await send('/api/contracts/time-entries', {
      contractId: instanceId, startTime: data.startTime, endTime: data.endTime,
      entryType: 'clock', reason: data.reason, billable: data.billable,
      gpsLatitude: gps?.lat ?? null, gpsLongitude: gps?.lng ?? null,
    })
  }, [capture, instanceId, send])

  const recordStatusEvent = useCallback(async (stepLabel: string, stepIndex: number) => {
    const gps = await capture()
    await send('/api/contracts/status-events', {
      contractId: instanceId, stepLabel, stepIndex,
      gpsLatitude: gps?.lat ?? null, gpsLongitude: gps?.lng ?? null,
    })
  }, [capture, instanceId, send])

  const completeContract = useCallback(async () => {
    setIsSaving(true)
    await update({ status: 'completed' })
    setIsSaving(false)
  }, [update])

  return {
    instance, filledBlocks, isLoading, error, isSaving,
    isOnline, pendingSyncs,
    updateBlock, recordSignature, recordTimeEntry, recordStatusEvent,
    completeContract, refresh,
  }
}
