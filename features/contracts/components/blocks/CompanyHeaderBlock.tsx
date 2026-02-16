'use client'

import Image from 'next/image'
import { Building2, Phone, Mail, MapPin } from 'lucide-react'
import { useCompanyBrand } from '../../hooks/useCompanyBrand'
import type { ContractBlock, BlockMode } from '../../types'

interface Props {
  block: ContractBlock
  mode: BlockMode
  onUpdate?: (content: Record<string, unknown>) => void
}

type Layout = 'left' | 'center' | '3-column'

function getOpt(block: ContractBlock, key: string, fallback: unknown) {
  return block.content[key] !== undefined ? block.content[key] : fallback
}

function HeaderPreview({ layout, data, show }: {
  layout: Layout
  data: { logoUrl: string | null; companyName: string | null; tagline: string | null; phone: string | null; email: string | null; address: string | null; primaryColor: string }
  show: Record<string, boolean>
}) {
  const logo = show.logo && data.logoUrl ? (
    <Image src={data.logoUrl} alt="Logo" width={120} height={48} className="h-12 w-auto object-contain" />
  ) : show.logo ? (
    <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
      <Building2 className="h-6 w-6 text-gray-400" />
    </div>
  ) : null

  const name = show.name && data.companyName ? (
    <p className="text-lg font-bold" style={{ color: data.primaryColor }}>{data.companyName}</p>
  ) : null

  const tagline = show.tagline && data.tagline ? (
    <p className="text-sm text-muted-foreground">{data.tagline}</p>
  ) : null

  const contact = (
    <div className={`text-xs text-muted-foreground space-y-0.5 ${layout === 'center' ? 'flex gap-3 flex-wrap justify-center' : ''}`}>
      {show.phone && data.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{data.phone}</span>}
      {show.email && data.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{data.email}</span>}
      {show.address && data.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{data.address}</span>}
    </div>
  )

  if (layout === 'center') {
    return (
      <div className="text-center space-y-1">
        {logo && <div className="flex justify-center">{logo}</div>}
        {name}{tagline}{contact}
      </div>
    )
  }

  if (layout === '3-column') {
    return (
      <div className="grid grid-cols-3 gap-4 items-center">
        <div>{logo}</div>
        <div className="text-center">{name}{tagline}</div>
        <div className="text-right">{contact}</div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-4">
      {logo}
      <div className="flex-1 space-y-1">
        {name}{tagline}{contact}
      </div>
    </div>
  )
}

export function CompanyHeaderBlock({ block, mode }: Props) {
  const { brand } = useCompanyBrand()
  const layout = (getOpt(block, 'layout', 'left') as Layout)
  const show = {
    logo: getOpt(block, 'showLogo', true) as boolean,
    name: getOpt(block, 'showName', true) as boolean,
    tagline: getOpt(block, 'showTagline', false) as boolean,
    phone: getOpt(block, 'showPhone', true) as boolean,
    email: getOpt(block, 'showEmail', true) as boolean,
    address: getOpt(block, 'showAddress', true) as boolean,
  }

  const data = {
    logoUrl: (block.content.logoUrl as string) || brand.logoUrl,
    companyName: (block.content.companyName as string) || brand.companyName,
    tagline: (block.content.tagline as string) || brand.tagline,
    phone: (block.content.phone as string) || brand.phone,
    email: (block.content.email as string) || brand.email,
    address: (block.content.address as string) || brand.address,
    primaryColor: (block.content.primaryColor as string) || brand.primaryColor,
  }

  if (mode === 'edit' && !data.logoUrl && !data.companyName) {
    return (
      <div className="py-6 text-center text-muted-foreground text-sm">
        Company header — configure fields in the right panel.
      </div>
    )
  }

  return <HeaderPreview layout={layout} data={data} show={show} />
}
