import { PageSkeleton } from '@/components/ui/page-skeleton'

export default function Loading() {
  return <PageSkeleton header cards={3} tableRows={8} tableCols={5} />
}
