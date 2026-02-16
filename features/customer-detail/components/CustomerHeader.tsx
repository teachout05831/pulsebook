"use client";

import { useState } from "react";
import { ArrowLeft, Phone, Mail, MapPin, Video, Globe, ShieldOff, Eye, Link, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TagBadge, useTags } from "@/features/tags";
import { InviteCustomerModal } from "@/features/customer-portal/components/InviteCustomerModal";
import { usePortalActions } from "../hooks/usePortalActions";
import type { CustomerHeaderProps, CustomerStatus } from "../types";
import { CUSTOMER_STATUS_COLORS, CUSTOMER_STATUS_LABELS } from "../types";

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function CustomerHeader({ customer, from, onEdit, onNewJob, onConsultation, onPortalAccessChange }: CustomerHeaderProps) {
  const router = useRouter();
  const { tags: allTags } = useTags();
  const [inviteOpen, setInviteOpen] = useState(false);
  const status: CustomerStatus = customer.status || "active";
  const hasPortalAccess = !!customer.userId;
  const { linkLoading, handleCopyLink, handleRevoke } = usePortalActions(customer.id, onPortalAccessChange);

  const getTagColor = (name: string) => {
    const tag = allTags.find((t) => t.name === name);
    return tag?.color || "#6B7280";
  };

  return (
    <header className="border-b bg-white px-4 md:px-6 lg:px-8 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 md:gap-4 min-w-0 flex-1">
          {from === "my-leads" ? (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 mt-0.5 gap-1"
              onClick={() => router.push("/sales?tab=my-leads")}
              title="Back to My Leads"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Back to My Leads</span>
            </Button>
          ) : from === "follow-ups" ? (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 mt-0.5 gap-1"
              onClick={() => router.push("/sales?tab=follow-up")}
              title="Back to Follow-ups"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline text-sm">Back to Follow-ups</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 mt-0.5"
              onClick={() => router.push("/customers")}
              title="Back to Customers"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base md:text-lg font-semibold text-white mt-0.5">
            {getInitials(customer.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-semibold truncate">{customer.name}</h1>
              <Badge className={`shrink-0 ${CUSTOMER_STATUS_COLORS[status]}`}>
                {CUSTOMER_STATUS_LABELS[status]}
              </Badge>
              {customer.tags && customer.tags.length > 0 && customer.tags.map((tagName) => (
                <TagBadge key={tagName} name={tagName} color={getTagColor(tagName)} />
              ))}
              {customer.balanceDue !== undefined && customer.balanceDue > 0 && (
                <Badge className="shrink-0 bg-red-100 text-red-800">
                  ${customer.balanceDue.toLocaleString("en-US", { minimumFractionDigits: 2 })} due
                </Badge>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{customer.phone}</span>
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors min-w-0">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </a>
              )}
              {customer.address && (
                <span className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{customer.address}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 sm:ml-4">
          {customer.email && !hasPortalAccess && (
            <Button variant="outline" size="sm" onClick={() => setInviteOpen(true)} className="whitespace-nowrap">
              <Globe className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">Invite to Portal</span>
            </Button>
          )}
          {hasPortalAccess && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyLink} disabled={linkLoading} className="whitespace-nowrap">
                {linkLoading ? <Loader2 className="h-4 w-4 animate-spin sm:mr-1.5" /> : <Link className="h-4 w-4 sm:mr-1.5" />}
                <span className="hidden sm:inline">Copy Link</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleRevoke} className="whitespace-nowrap text-red-600 hover:text-red-700">
                <ShieldOff className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">Revoke Access</span>
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={onConsultation} className="whitespace-nowrap">
            <Video className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">Consultation</span>
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={() => window.open(`/customers/${customer.id}/portal-preview`, "_blank")}>
            <Eye className="h-4 w-4 sm:mr-1.5" /><span className="hidden sm:inline">Preview Portal</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit} className="whitespace-nowrap">Edit</Button>
          <Button size="sm" onClick={onNewJob} className="whitespace-nowrap"><span className="hidden sm:inline">+ </span>New Job</Button>
        </div>
      </div>

      {customer.email && (
        <InviteCustomerModal
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          customerId={customer.id}
          customerName={customer.name}
          customerEmail={customer.email}
          onSuccess={onPortalAccessChange}
        />
      )}
    </header>
  );
}
