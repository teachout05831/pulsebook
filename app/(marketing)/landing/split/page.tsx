import { SplitTemplate } from '@/features/marketing'
import { platformFeatures } from '@/features/marketing/data/features'

export default function SplitLandingPage() {
  return <SplitTemplate features={platformFeatures} />
}
