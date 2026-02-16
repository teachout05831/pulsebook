"use client";

import { cn } from "@/lib/utils";
import { ExternalLink, PhoneForwarded } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_COLORS } from "../../types";
import { LEADS_TABLE_COLUMNS } from "../../constants";
import type { Customer, LeadStatus } from "@/types/customer";

interface LeadsTableRowProps {
  lead: Customer;
  visibleColumns: string[];
  onRowClick: (lead: Customer) => void;
  onScheduleFollowUp?: (lead: Customer) => void;
}

function formatDate(date?: string) {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(value?: number) {
  if (!value) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function renderCell(columnId: string, lead: Customer): React.ReactNode {
  switch (columnId) {
    case "id":
      return (
        <span className="text-blue-600 flex items-center gap-1">
          {lead.id.slice(0, 5)}
          <ExternalLink className="h-3 w-3" />
        </span>
      );
    case "leadStatus":
      return lead.leadStatus ? (
        <span className={cn(
          "inline-flex items-center px-2.5 py-1 rounded text-xs font-medium",
          LEAD_STATUS_COLORS[lead.leadStatus as LeadStatus] || "bg-orange-500 text-white"
        )}>
          {lead.leadStatus.charAt(0).toUpperCase() + lead.leadStatus.slice(1)}
        </span>
      ) : null;
    case "name":
      return <span className="font-medium">{lead.name}</span>;
    case "email":
      return <span className="text-sm text-slate-500">{lead.email || "--"}</span>;
    case "phone":
      return <span className="text-sm text-slate-500">{lead.phone || "--"}</span>;
    case "serviceType":
      return <span className="text-sm text-slate-500">{lead.serviceType || "--"}</span>;
    case "serviceDate":
      return <span className="text-sm">{formatDate(lead.serviceDate)}</span>;
    case "estimatedValue":
      return <span className="text-sm">{formatCurrency(lead.estimatedValue)}</span>;
    case "source":
      return <span className="text-sm text-slate-500">{lead.source || "--"}</span>;
    case "address":
      return <span className="text-sm text-slate-600">{lead.address || "--"}</span>;
    case "lastContactDate": {
      if (!lead.lastContactDate) return <span className="text-sm text-slate-400">--</span>;
      const days = Math.floor((Date.now() - new Date(lead.lastContactDate).getTime()) / 86400000);
      const stale = days > 2;
      const label = days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`;
      return <span className={cn("text-sm font-medium", stale ? "text-amber-600" : "text-green-600")}>{label}</span>;
    }
    case "assignedTo":
      return <span className="text-sm text-slate-500">{lead.assignedTo || "--"}</span>;
    case "tags":
      return <span className="text-sm text-slate-500">{lead.tags?.length ? lead.tags.join(", ") : "--"}</span>;
    case "createdAt":
      return <span className="text-sm">{formatDate(lead.createdAt)}</span>;
    case "accountBalance":
      return <span className="text-sm">{formatCurrency(lead.accountBalance)}</span>;
    case "followUpDate": {
      if (!lead.followUpDate) return <span className="text-sm text-slate-400">--</span>;
      const due = new Date(lead.followUpDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      const isOverdue = due < today;
      const isToday = due.getTime() === today.getTime();
      return (
        <span className={cn("text-sm font-medium", isOverdue && "text-red-600", isToday && "text-amber-600")}>
          {isOverdue ? "Overdue" : isToday ? "Today" : formatDate(lead.followUpDate)}
        </span>
      );
    }
    default:
      return "--";
  }
}

export function LeadsTableRow({ lead, visibleColumns, onRowClick, onScheduleFollowUp }: LeadsTableRowProps) {
  return (
    <tr className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => onRowClick(lead)}>
      <td className="p-3" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" className="h-4 w-4 rounded" />
      </td>
      {LEADS_TABLE_COLUMNS.filter((col) => visibleColumns.includes(col.id)).map((col) => (
        <td key={col.id} className="p-3">
          {renderCell(col.id, lead)}
        </td>
      ))}
      {onScheduleFollowUp && (
        <td className="p-3" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => onScheduleFollowUp(lead)}>
            <PhoneForwarded className="h-3.5 w-3.5" />
            Follow-up
          </Button>
        </td>
      )}
    </tr>
  );
}
