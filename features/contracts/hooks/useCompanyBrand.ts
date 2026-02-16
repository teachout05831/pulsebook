'use client'

import { useState, useEffect } from 'react'

interface CompanyBrand {
  logoUrl: string | null
  companyName: string | null
  tagline: string | null
  phone: string | null
  email: string | null
  address: string | null
  primaryColor: string
}

const EMPTY: CompanyBrand = {
  logoUrl: null, companyName: null, tagline: null,
  phone: null, email: null, address: null, primaryColor: '#2563eb',
}

export function useCompanyBrand() {
  const [brand, setBrand] = useState<CompanyBrand>(EMPTY)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetch('/api/brand-kit').then((r) => r.json()),
      fetch('/api/company').then((r) => r.json()),
    ])
      .then(([brandRes, companyRes]) => {
        if (cancelled) return
        const bk = brandRes.data
        const co = companyRes.data
        const addr = co ? [co.address, co.city, co.state, co.zipCode].filter(Boolean).join(', ') : null
        setBrand({
          logoUrl: bk?.logoUrl || co?.logoUrl || null,
          companyName: co?.name || null,
          tagline: bk?.tagline || null,
          phone: co?.phone || null,
          email: co?.email || null,
          address: addr || null,
          primaryColor: bk?.primaryColor || '#2563eb',
        })
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [])

  return { brand, isLoading }
}
