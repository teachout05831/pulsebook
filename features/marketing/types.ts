export interface PlatformFeature {
  title: string
  description: string
  icon: string
}

export interface ContactFormData {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

export interface TemplateProps {
  features: PlatformFeature[]
}

export type NavVariant = 'light' | 'dark' | 'transparent'
export type FooterVariant = 'light' | 'dark'
