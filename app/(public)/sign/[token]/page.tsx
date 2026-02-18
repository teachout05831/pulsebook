"use client";

import { useParams } from "next/navigation";
import { SigningFlow } from "@/features/contracts/components/SigningFlow";

export default function SignPage() {
  const params = useParams();
  const token = params.token as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-4 py-3">
        <div className="max-w-lg mx-auto">
          <span className="font-semibold text-sm">Pulsebook</span>
          <span className="text-xs text-muted-foreground ml-2">Contract Signing</span>
        </div>
      </div>
      <SigningFlow token={token} />
    </div>
  );
}
