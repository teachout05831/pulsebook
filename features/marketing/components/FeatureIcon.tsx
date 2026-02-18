'use client'

import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  Wrench,
  Video,
  Globe,
  Smartphone,
  Sparkles,
  Tags,
  Plug,
  BarChart3,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Users,
  Calendar,
  FileText,
  DollarSign,
  Wrench,
  Video,
  Globe,
  Smartphone,
  Sparkles,
  Tags,
  Plug,
  BarChart3,
}

interface Props {
  name: string
  className?: string
}

export function FeatureIcon({ name, className }: Props) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon className={className} />
}
