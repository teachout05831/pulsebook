'use client'

import { useState, useCallback, useEffect } from 'react'
import Dexie from 'dexie'
import type { ContractInstance } from '../types'

// IndexedDB database for offline contract caching
class ContractDB extends Dexie {
  instances!: Dexie.Table<ContractInstance & { cachedAt: string }, string>
  syncQueue!: Dexie.Table<{ id?: number; action: string; payload: string; createdAt: string }, number>

  constructor() {
    super('ServiceProContracts')
    this.version(1).stores({
      instances: 'id, jobId, status, cachedAt',
      syncQueue: '++id, action, createdAt',
    })
  }
}

const db = new ContractDB()

export function useOfflineContracts() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingSyncs, setPendingSyncs] = useState(0)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const cacheInstance = useCallback(async (instance: ContractInstance) => {
    await db.instances.put({ ...instance, cachedAt: new Date().toISOString() })
  }, [])

  const getCachedInstance = useCallback(async (id: string) => {
    return db.instances.get(id) || null
  }, [])

  const getCachedByJob = useCallback(async (jobId: string) => {
    return db.instances.where('jobId').equals(jobId).toArray()
  }, [])

  const queueAction = useCallback(async (action: string, payload: unknown) => {
    await db.syncQueue.add({
      action,
      payload: JSON.stringify(payload),
      createdAt: new Date().toISOString(),
    })
    const count = await db.syncQueue.count()
    setPendingSyncs(count)
  }, [])

  const syncPending = useCallback(async () => {
    const items = await db.syncQueue.orderBy('createdAt').toArray()
    for (const item of items) {
      try {
        const payload = JSON.parse(item.payload)
        const res = await fetch(payload.url, {
          method: payload.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload.body),
        })
        if (res.ok && item.id != null) await db.syncQueue.delete(item.id)
      } catch {
        break // Stop syncing if network fails
      }
    }
    const count = await db.syncQueue.count()
    setPendingSyncs(count)
  }, [])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingSyncs > 0) syncPending()
  }, [isOnline, pendingSyncs, syncPending])

  return {
    isOnline, pendingSyncs,
    cacheInstance, getCachedInstance, getCachedByJob,
    queueAction, syncPending,
  }
}
