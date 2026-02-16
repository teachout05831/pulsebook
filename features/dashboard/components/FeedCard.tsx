"use client";

import { memo } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Pencil, DollarSign, Phone, MessageSquare, Mail, Video, StickyNote, Calendar, CheckCircle2 } from "lucide-react";
import type { DashboardFeedItem } from "../types";

const ACTION_CONFIG: Record<string, { border: string; bg: string; text: string; label: string; icon: React.ElementType }> = {
  created: { border: "border-blue-500", bg: "bg-blue-100", text: "text-blue-700", label: "Created", icon: Plus },
  status_changed: { border: "border-amber-500", bg: "bg-amber-100", text: "text-amber-700", label: "Status", icon: ArrowRight },
  updated: { border: "border-slate-400", bg: "bg-slate-100", text: "text-slate-600", label: "Updated", icon: Pencil },
  payment_received: { border: "border-green-500", bg: "bg-green-100", text: "text-green-700", label: "Payment", icon: DollarSign },
  scheduled: { border: "border-green-500", bg: "bg-green-100", text: "text-green-700", label: "Scheduled", icon: Calendar },
  sent: { border: "border-purple-500", bg: "bg-purple-100", text: "text-purple-700", label: "Sent", icon: Mail },
  completed: { border: "border-emerald-500", bg: "bg-emerald-100", text: "text-emerald-700", label: "Completed", icon: CheckCircle2 },
  call: { border: "border-indigo-500", bg: "bg-indigo-100", text: "text-indigo-700", label: "Call", icon: Phone },
  text: { border: "border-cyan-500", bg: "bg-cyan-100", text: "text-cyan-700", label: "Text", icon: MessageSquare },
  email: { border: "border-purple-500", bg: "bg-purple-100", text: "text-purple-700", label: "Email", icon: Mail },
  meeting: { border: "border-orange-500", bg: "bg-orange-100", text: "text-orange-700", label: "Meeting", icon: Video },
  note: { border: "border-slate-400", bg: "bg-slate-100", text: "text-slate-600", label: "Note", icon: StickyNote },
};

const DEFAULT_CONFIG = { border: "border-slate-400", bg: "bg-slate-100", text: "text-slate-600", label: "Activity", icon: ArrowRight };

const FIELD_LABELS: Record<string, string> = {
  title: "title", assignedTo: "assignment", assignedCrewId: "crew", scheduledDate: "schedule",
  lineItems: "line items", pricingModel: "pricing", address: "address", tags: "tags",
  customerId: "customer", bindingType: "binding type", depositType: "deposit",
  depositAmount: "deposit", resources: "resources", appliedFees: "fees",
};

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function getEntityUrl(entityType: string, entityId: string): string | null {
  if (entityType === "job") return `/jobs/${entityId}`;
  if (entityType === "estimate") return `/estimates/${entityId}`;
  if (entityType === "customer") return `/customers/${entityId}`;
  return null;
}

function getEntityLabel(entityType: string): string {
  if (entityType === "estimate") return "Estimate";
  if (entityType === "job") return "Job";
  if (entityType === "payment") return "Payment";
  if (entityType === "customer") return "Customer";
  return "Activity";
}

function getEnhancedDescription(item: DashboardFeedItem): string {
  if (item.description.includes("<strong>")) return item.description;
  const fields = item.metadata?.fields as string[] | undefined;
  if (fields && fields.length > 0) {
    const seen = new Set<string>();
    const labels = fields.map((f) => FIELD_LABELS[f] || f).filter((l) => { if (seen.has(l)) return false; seen.add(l); return true; });
    return `${item.description} — ${labels.join(", ")}`;
  }
  return item.description;
}

interface FeedCardProps {
  item: DashboardFeedItem;
}

export const FeedCard = memo(function FeedCard({ item }: FeedCardProps) {
  const cfg = ACTION_CONFIG[item.action] || DEFAULT_CONFIG;
  const Icon = cfg.icon;
  const entityUrl = getEntityUrl(item.entityType, item.entityId);
  const entityLabel = getEntityLabel(item.entityType);
  const description = getEnhancedDescription(item);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className={`border-l-4 ${cfg.border} p-4`}>
        {/* Top row */}
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
              {item.customerName ? (
                <span className={`text-xs font-bold ${cfg.text}`}>{getInitials(item.customerName)}</span>
              ) : (
                <Icon className={`w-4 h-4 ${cfg.text}`} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {item.customerId ? (
                  <Link href={`/customers/${item.customerId}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                    {item.customerName}
                  </Link>
                ) : (
                  <h4 className="text-sm font-semibold text-slate-800">{item.customerName || entityLabel}</h4>
                )}
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                  <Icon className="w-3 h-3 mr-0.5" /> {cfg.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{formatRelativeTime(item.createdAt)}</span>
                {item.performedByName && (
                  <span className="text-xs text-slate-400">by {item.performedByName}</span>
                )}
              </div>
            </div>
          </div>
          {item.amount != null && item.amount > 0 && (
            <span className={`text-sm font-bold ${item.action === "payment_received" ? "text-green-600" : "text-slate-700"} flex-shrink-0`}>
              {formatCurrency(item.amount)}
            </span>
          )}
        </div>

        {/* Description + view link */}
        <div className="ml-12">
          <p
            className="text-[13px] text-slate-600 leading-snug"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {entityUrl && (
            <Link
              href={entityUrl}
              className="inline-block mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              View {entityLabel} &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
});
