'use client';

import { CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function PaymentsTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      ))}
    </div>
  );
}

export function PaymentsEmptyState({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <CreditCard className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">
        {isFiltered ? 'No payments found' : 'No payments yet'}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        {isFiltered
          ? 'Try adjusting your filters or search terms.'
          : 'Payments will appear here when invoices are paid.'}
      </p>
    </div>
  );
}
