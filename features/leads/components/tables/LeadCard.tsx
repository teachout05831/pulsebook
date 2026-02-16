"use client";

import { cn } from "@/lib/utils";
import { PhoneForwarded } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_COLORS } from "../../types";
import type { Customer, LeadStatus } from "@/types/customer";

interface LeadCardProps {
  lead: Customer;
  onRowClick: (lead: Customer) => void;
  onScheduleFollowUp?: (lead: Customer) => void;
}

function formatCurrency(value?: number) {
  if (!value) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function LeadCard({ lead, onRowClick, onScheduleFollowUp }: LeadCardProps) {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onRowClick(lead)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate">{lead.name}</div>
          <div className="text-sm text-muted-foreground">{lead.phone || lead.email || "-"}</div>
        </div>
        {lead.leadStatus && (
          <span className={cn(
            "shrink-0 px-2 py-0.5 rounded text-xs font-medium",
            LEAD_STATUS_COLORS[lead.leadStatus as LeadStatus] || "bg-gray-100 text-gray-700"
          )}>
            {lead.leadStatus.charAt(0).toUpperCase() + lead.leadStatus.slice(1)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          {lead.source && <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{lead.source}</span>}
          <span className="font-semibold text-foreground">{formatCurrency(lead.estimatedValue)}</span>
          {lead.lastContactDate && (
            <span className="text-xs text-slate-500">
              {(() => {
                const d = Math.floor((Date.now() - new Date(lead.lastContactDate).getTime()) / 86400000);
                return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
              })()}
            </span>
          )}
        </div>
        {onScheduleFollowUp && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={(e) => { e.stopPropagation(); onScheduleFollowUp(lead); }}
          >
            <PhoneForwarded className="h-3.5 w-3.5" />
            Follow-up
          </Button>
        )}
      </div>
    </Card>
  );
}
