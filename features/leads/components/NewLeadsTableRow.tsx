"use client";

import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/customer";

interface NewLeadsTableRowProps {
  lead: Customer;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onRowClick: (lead: Customer) => void;
}

function formatValue(value?: number) {
  if (!value) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function NewLeadsTableRow({ lead, isSelected, onToggleSelect, onRowClick }: NewLeadsTableRowProps) {
  return (
    <tr
      className={`border-b hover:bg-slate-50 cursor-pointer ${isSelected ? "bg-primary/5" : ""}`}
      onClick={() => onRowClick(lead)}
    >
      <td className="p-4" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="h-4 w-4 rounded cursor-pointer"
          checked={isSelected}
          onChange={() => onToggleSelect(lead.id)}
        />
      </td>
      <td className="p-4">
        <div className="font-medium">{lead.name}</div>
        <div className="text-sm text-muted-foreground">{lead.phone || "-"}</div>
      </td>
      <td className="p-4">
        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">{lead.source || "-"}</span>
      </td>
      <td className="p-4 text-sm">{lead.serviceType || "-"}</td>
      <td className="p-4 text-sm">{formatDate(lead.serviceDate)}</td>
      <td className="p-4 font-semibold">{formatValue(lead.estimatedValue)}</td>
      <td className="p-4">
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
