"use client";

import { InvoiceDetail } from "@/features/invoices";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return <InvoiceDetail id={params.id} />;
}
