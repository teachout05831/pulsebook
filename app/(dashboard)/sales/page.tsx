"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SalesPage } from "@/features/leads";

function SalesPageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function SalesRoute() {
  return (
    <Suspense fallback={<SalesPageLoader />}>
      <SalesPage />
    </Suspense>
  );
}
