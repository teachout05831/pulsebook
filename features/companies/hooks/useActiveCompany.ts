'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { switchCompany as switchCompanyAction } from '../actions'
import type { Company, UserCompany } from '../types'

interface UseActiveCompanyProps {
  activeCompany: Company | null
  userCompanies: UserCompany[]
}

export function useActiveCompany({ activeCompany, userCompanies }: UseActiveCompanyProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const switchCompany = useCallback(async (companyId: string) => {
    if (companyId === activeCompany?.id) return

    setIsLoading(true)
    setError(null)

    const result = await switchCompanyAction(companyId)

    if (result.success) {
      router.refresh()
    } else {
      setError(result.error || 'Failed to switch company')
    }

    setIsLoading(false)
  }, [activeCompany?.id, router])

  return {
    activeCompany,
    companies: userCompanies,
    isLoading,
    error,
    switchCompany,
  }
}
