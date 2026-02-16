"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Eye, Phone, MoreVertical, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLeads } from "../hooks/useLeads";
import { LEAD_STATUS_COLORS } from "../types";
import type { Customer, LeadStatus } from "@/types/customer";

interface MyLeadsTableProps {
  searchQuery?: string;
  onAddLead: () => void;
}

export function MyLeadsTable({ searchQuery, onAddLead }: MyLeadsTableProps) {
  const router = useRouter();
  const { leads, total, isLoading } = useLeads({
    leadStatusNot: "new",
    search: searchQuery,
  });

  const handleRowClick = (leadId: string) => {
    router.push(`/customers/${leadId}?tab=sales`);
  };

  const formatValue = (value?: number) => {
    if (!value) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRelativeTime = (date?: string) => {
    if (!date) return "--";
    const now = new Date();
    const then = new Date(date);
    const diffDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <select className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option>All Statuses</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Proposal Sent</option>
          </select>
          <select className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option>All Sources</option>
            <option>Website</option>
            <option>Referral</option>
            <option>Google Ads</option>
          </select>
          <select className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option>Sort: Newest</option>
            <option>Sort: Oldest</option>
            <option>Sort: Value (High)</option>
            <option>Sort: Value (Low)</option>
          </select>
        </div>
        <Button onClick={onAddLead}>
          <Plus className="h-4 w-4 mr-2" /> Add Lead
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Lead</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Source</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service Date</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Est. Value</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Last Contact</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: Customer) => (
                <tr
                  key={lead.id}
                  className="border-b hover:bg-slate-50 cursor-pointer"
                  onClick={() => handleRowClick(lead.id)}
                >
                  <td className="p-4">
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-muted-foreground">{lead.phone || "-"}</div>
                  </td>
                  <td className="p-4">
                    {lead.leadStatus && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          LEAD_STATUS_COLORS[lead.leadStatus as LeadStatus] || "bg-gray-100 text-gray-700"
                        )}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {lead.leadStatus.charAt(0).toUpperCase() + lead.leadStatus.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                      {lead.source || "-"}
                    </span>
                  </td>
                  <td className="p-4 text-sm">{formatDate(lead.serviceDate)}</td>
                  <td className="p-4 font-semibold">{formatValue(lead.estimatedValue)}</td>
                  <td className="p-4 text-sm">{getRelativeTime(lead.lastContactDate)}</td>
                  <td className="p-4">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRowClick(lead.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No leads in progress
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <span className="text-sm text-muted-foreground">
            Showing {leads.length} of {total} leads
          </span>
        </div>
      </Card>
    </div>
  );
}
