"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function EstimateError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("[EstimateDetail] Page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h2 className="text-lg font-semibold">Failed to load estimate</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
