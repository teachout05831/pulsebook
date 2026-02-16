'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ContractPayment, CreatePaymentInput } from '../types'

export function useContractPayment(contractId: string) {
  const [payment, setPayment] = useState<ContractPayment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayment = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/contracts/payments?contractId=${contractId}`)
      if (!res.ok) throw new Error('Failed to load payment')
      const data = await res.json()
      setPayment(data.payment || null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payment')
    } finally {
      setIsLoading(false)
    }
  }, [contractId])

  useEffect(() => { fetchPayment() }, [fetchPayment])

  const recordPayment = useCallback(async (input: CreatePaymentInput) => {
    setError(null)
    try {
      const res = await fetch('/api/contracts/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = await res.json()
        return { error: data.error || 'Failed to record payment' }
      }
      const data = await res.json()
      setPayment(data.payment)
      return { success: true }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to record payment'
      setError(msg)
      return { error: msg }
    }
  }, [])

  return { payment, isLoading, error, recordPayment, refresh: fetchPayment }
}
