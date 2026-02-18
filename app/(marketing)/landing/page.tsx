import { ClassicTemplate } from '@/features/marketing'
import { platformFeatures } from '@/features/marketing/data/features'

export default function LandingPage() {
  return <ClassicTemplate features={platformFeatures} />
}
