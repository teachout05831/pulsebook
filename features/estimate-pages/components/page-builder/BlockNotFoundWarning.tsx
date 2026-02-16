"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Code2 } from "lucide-react";

interface BlockNotFoundWarningProps {
  onSwitchToRawHtml: () => void;
}

export function BlockNotFoundWarning({ onSwitchToRawHtml }: BlockNotFoundWarningProps) {
  return (
    <div className="space-y-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-amber-900">Block not found</p>
          <p className="text-xs text-amber-700">
            This section was created with a block that no longer exists. You can edit the HTML directly or browse the block library to insert a new block.
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={onSwitchToRawHtml}>
        <Code2 className="h-3.5 w-3.5 mr-1.5" />
        Switch to Raw HTML Mode
      </Button>
    </div>
  );
}
