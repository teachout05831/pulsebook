'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ContractInstance } from '../types'

type Step = 'review' | 'pricing' | 'terms' | 'signature' | 'complete'
const STEPS: Step[] = ['review', 'pricing', 'terms', 'signature', 'complete']

export function useContractSigning(token: string) {
  const [contract, setContract] = useState<ContractInstance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('review')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchContract = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/contracts/sign/${token}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setContract(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Contract not found')
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => { fetchContract() }, [fetchContract])

  const stepIndex = STEPS.indexOf(step)
  const nextStep = useCallback(() => {
    if (stepIndex < STEPS.length - 1) setStep(STEPS[stepIndex + 1])
  }, [stepIndex])
  const prevStep = useCallback(() => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1])
  }, [stepIndex])

  const submitSignature = useCallback(async (data: {
    blockId: string; signerRole: string; signerName: string
    signerEmail?: string; signatureData: string
  }) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/contracts/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) return { error: json.error }
      setStep('complete')
      return { success: true }
    } finally {
      setIsSubmitting(false)
    }
  }, [token])

  return {
    contract, isLoading, error, step, stepIndex,
    stepCount: STEPS.length, nextStep, prevStep,
    submitSignature, isSubmitting,
  }
}
