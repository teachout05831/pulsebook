"use client";

import { useParams } from "next/navigation";
import { EditCustomerForm } from "@/features/customers/components/EditCustomerForm";

export default function EditCustomerPage() {
  const params = useParams();
  return <EditCustomerForm customerId={params.id as string} />;
}
