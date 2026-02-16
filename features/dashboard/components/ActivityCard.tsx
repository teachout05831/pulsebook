"use client";

import { CheckCircle2, Plus, FileText, XCircle, Calendar, User, Globe, ArrowRight, Building, AlertCircle, Mail } from "lucide-react";
import type { ActivityFeedItem, ActivityType } from "../types";

interface ActivityCardProps {
  item: ActivityFeedItem;
  onViewDetails: () => void;
}

const TYPE_CONFIG: Record<ActivityType, { border: string; bg: string; text: string; label: string; icon: React.ElementType }> = {
  booked: { border: "border-green-500", bg: "bg-green-100", text: "text-green-700", label: "Booked", icon: CheckCircle2 },
  lead: { border: "border-blue-500", bg: "bg-blue-100", text: "text-blue-700", label: "New Lead", icon: Plus },
  quote_sent: { border: "border-purple-500", bg: "bg-purple-100", text: "text-purple-700", label: "Quote Sent", icon: FileText },
  cancelled: { border: "border-red-500", bg: "bg-red-100", text: "text-red-700", label: "Cancelled", icon: XCircle },
};

function getInitials(name: string): string {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function ActivityCard({ item, onViewDetails }: ActivityCardProps) {
  const cfg = TYPE_CONFIG[item.type];
  const Icon = cfg.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className={`border-l-4 ${cfg.border} p-4`}>
        {/* Top row: avatar, name/badge, price */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
              <span className={`text-sm font-bold ${cfg.text}`}>{getInitials(item.customerName)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-800">{item.customerName}</h4>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                  <Icon className="w-3 h-3 mr-0.5" /> {cfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-500">{formatRelativeTime(item.timestamp)}</p>
            </div>
          </div>
          {item.type === "booked" && item.amount != null && (
            <span className="text-base font-bold text-green-600 flex-shrink-0">{formatCurrency(item.amount)}</span>
          )}
          {item.type === "quote_sent" && item.estimateTotal != null && (
            <span className="text-base font-bold text-purple-600 flex-shrink-0">{formatCurrency(item.estimateTotal)}</span>
          )}
          {item.type === "cancelled" && item.amount != null && (
            <span className="text-base font-bold text-red-500 line-through flex-shrink-0">{formatCurrency(item.amount)}</span>
          )}
        </div>

        {/* Metadata + View Details - indented past avatar */}
        <div className="ml-[52px]">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
            {item.type === "booked" && (
              <>
                {item.jobTitle && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" />{item.jobTitle}</span>}
                {item.scheduledDate && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{item.scheduledDate}</span>}
                {item.assignedTo && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />Tech: {item.assignedTo}</span>}
              </>
            )}
            {item.type === "lead" && (
              <>
                {item.source && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />Source: {item.source}</span>}
                {item.leadStatus && <span className="flex items-center gap-1"><ArrowRight className="w-3.5 h-3.5" />Stage: {item.leadStatus}</span>}
                {item.serviceType && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" />{item.serviceType}</span>}
              </>
            )}
            {item.type === "quote_sent" && (
              <>
                {item.jobTitle && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" />{item.jobTitle}</span>}
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />Emailed to customer</span>
              </>
            )}
            {item.type === "cancelled" && (
              <>
                {item.jobTitle && <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" />{item.jobTitle}</span>}
                {item.cancellationReason && <span className="flex items-center gap-1 text-red-500"><AlertCircle className="w-3.5 h-3.5" />Reason: {item.cancellationReason}</span>}
              </>
            )}
          </div>
          <button onClick={onViewDetails} className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            View Details &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
