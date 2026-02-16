import { Suspense } from 'react';
import { InvoicesListPage } from '@/features/invoices/components/InvoicesListPage';

export default function InvoicesPage() {
  return (
    <Suspense>
      <InvoicesListPage />
    </Suspense>
  );
}
