import { MinimalTemplate } from '@/features/marketing'
import { platformFeatures } from '@/features/marketing/data/features'

export default function MinimalLandingPage() {
  return <MinimalTemplate features={platformFeatures} />
}
