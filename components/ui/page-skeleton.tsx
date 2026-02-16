import { Skeleton } from '@/components/ui/skeleton'

interface PageSkeletonProps {
  header?: boolean
  cards?: number
  tableRows?: number
  tableCols?: number
  formFields?: number
}

export function PageSkeleton({
  header = true,
  cards = 0,
  tableRows = 0,
  tableCols = 4,
  formFields = 0,
}: PageSkeletonProps) {
  return (
    <div className="space-y-6 p-6">
      {header && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
      )}
      {cards > 0 && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: cards }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      )}
      {tableRows > 0 && (
        <div className="rounded-lg border">
          <div className="border-b p-3 flex gap-4">
            {Array.from({ length: tableCols }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {Array.from({ length: tableRows }).map((_, i) => (
            <div key={i} className="border-b last:border-0 p-3 flex gap-4">
              {Array.from({ length: tableCols }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      )}
      {formFields > 0 && (
        <div className="space-y-4 max-w-2xl">
          {Array.from({ length: formFields }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
