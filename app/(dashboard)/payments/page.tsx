import { getPayments } from '@/features/invoices/queries/getPayments';
import { PaymentsDashboard } from '@/features/invoices';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentsPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = parseInt(String(params.page || '1'), 10);
  const pageSize = parseInt(String(params.pageSize || '10'), 10);
  const method = params.method ? String(params.method) : null;
  const search = params.q ? String(params.q) : null;
  const month = params.month ? String(params.month) : null;
  const dateFrom = params.dateFrom ? String(params.dateFrom) : null;
  const dateTo = params.dateTo ? String(params.dateTo) : null;

  const initialData = await getPayments({
    page, pageSize, method, search, month, dateFrom, dateTo,
  });

  return <PaymentsDashboard initialData={initialData} />;
}
