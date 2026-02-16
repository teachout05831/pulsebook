"use client";

import { Phone, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/customer";

interface NewLeadCardProps {
  lead: Customer;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRowClick: (lead: Customer) => void;
}

function formatValue(value?: number) {
  if (!value) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function NewLeadCard({ lead, isSelected, onToggleSelect, onRowClick }: NewLeadCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${isSelected ? "ring-2 ring-primary/30" : ""}`}
      onClick={() => onRowClick(lead)}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          className="h-4 w-4 mt-1 rounded cursor-pointer shrink-0"
          checked={isSelected}
          onChange={() => onToggleSelect(lead.id)}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-medium truncate">{lead.name}</div>
              <div className="text-sm text-muted-foreground">{lead.phone || "-"}</div>
            </div>
            <span className="shrink-0 font-semibold text-sm">{formatValue(lead.estimatedValue)}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              {lead.source && <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{lead.source}</span>}
              <span className="text-xs text-muted-foreground">{lead.serviceType || "-"}</span>
            </div>
            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
