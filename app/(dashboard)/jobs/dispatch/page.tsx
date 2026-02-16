"use client";

import { DispatchProvider } from "@/components/dispatch";
import { DispatchContent } from "@/components/dispatch/DispatchContent";

export default function DispatchPage() {
  return (
    <DispatchProvider>
      <DispatchContent />
    </DispatchProvider>
  );
}
