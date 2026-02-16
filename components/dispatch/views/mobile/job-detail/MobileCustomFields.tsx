"use client";

import { Settings2 } from "lucide-react";
import type { DispatchJob } from "@/types/dispatch";

interface MobileCustomFieldsProps {
  customFields: DispatchJob["customFields"];
}

export function MobileCustomFields({ customFields }: MobileCustomFieldsProps) {
  const entries = Object.entries(customFields).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );

  if (entries.length === 0) return null;

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Settings2 className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs text-gray-500 font-medium">Custom Fields</span>
      </div>
      <div className="space-y-1.5">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between items-baseline text-sm">
            <span className="text-gray-500 text-xs capitalize">
              {key.replace(/_/g, " ")}
            </span>
            <span className="text-gray-900 text-xs font-medium text-right max-w-[60%] truncate">
              {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
