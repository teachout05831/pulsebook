import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function Loading() {
  return <PageSkeleton header cards={4} tableRows={8} tableCols={6} />
}
