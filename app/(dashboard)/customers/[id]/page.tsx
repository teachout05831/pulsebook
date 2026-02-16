"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CustomerDetailPage } from "@/features/customer-detail";

function CustomerDetailLoader() {
  return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function CustomerDetail() {
  const params = useParams();
  const customerId = params.id as string;
  return <CustomerDetailPage customerId={customerId} />;
}

export default function CustomerPage() {
  return (
    <Suspense fallback={<CustomerDetailLoader />}>
      <CustomerDetail />
    </Suspense>
  );
}
