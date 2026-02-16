"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApproval } from "../../hooks/useApproval";
import { useTierSelection } from "../TierSelectionContext";
import { CheckCircle2, XCircle, MessageSquare } from "lucide-react";

interface ApprovalActionsProps {
  pageId: string;
  status: string;
  allowInstantApproval: boolean;
  requireDeposit: boolean;
  depositAmount: number | null;
  depositType: string;
  total: number;
  discountedTotal?: number;
  savingsAmount?: number;
  activeTierLabel?: string;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function StatusBanner({ variant }: { variant: "approved" | "declined" }) {
  const ok = variant === "approved";
  const Icon = ok ? CheckCircle2 : XCircle;
  return (
    <div className="py-10 px-4">
      <div className={`max-w-md mx-auto text-center rounded-xl border p-8 ${ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <Icon className={`w-12 h-12 mx-auto mb-3 ${ok ? "text-green-600" : "text-red-500"}`} />
        <h3 className={`text-xl font-semibold ${ok ? "text-green-800" : "text-red-800"}`}>
          {ok ? "Estimate Approved" : "Estimate Declined"}
        </h3>
        {ok && <p className="text-green-600 mt-1">Thank you!</p>}
      </div>
    </div>
  );
}

export function ApprovalActions({
  pageId, status: initialStatus, allowInstantApproval,
  requireDeposit, depositAmount, depositType, total,
  discountedTotal, savingsAmount, activeTierLabel,
}: ApprovalActionsProps) {
  const { status, isSubmitting, approve, decline, requestChanges } = useApproval({ pageId, initialStatus });
  const { selectedPackage, hasPackages } = useTierSelection();
  const [activePanel, setActivePanel] = useState<"changes" | "decline" | null>(null);
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const needsSelection = hasPackages && !selectedPackage;

  if (status === "approved" || status === "declined") {
    return <StatusBanner variant={status as "approved" | "declined"} />;
  }

  const handleApprove = async () => {
    const pkg = selectedPackage ? { name: selectedPackage.name, price: selectedPackage.price } : undefined;
    const r = await approve(pkg);
    if (!r.success) setFeedback(r.error || "Failed to approve");
  };
  const handleDecline = async () => {
    const r = await decline(reason || undefined);
    if (!r.success) setFeedback(r.error || "Failed to decline");
  };
  const handleRequestChanges = async () => {
    if (!message.trim()) return;
    const r = await requestChanges(message.trim());
    if (r.success) { setActivePanel(null); setMessage(""); setFeedback("Your request has been sent. We will be in touch."); }
    else setFeedback(r.error || "Failed to send request");
  };

  const baseTotal = selectedPackage ? selectedPackage.price : total;
  const effectiveTotal = !selectedPackage && discountedTotal && discountedTotal < total ? discountedTotal : baseTotal;
  const depLabel = depositAmount
    ? (depositType === "percentage" ? `${fmt(effectiveTotal * (depositAmount / 100))} (${depositAmount}%)` : fmt(depositAmount))
    : null;
  const primary = "var(--primary-color, #2563eb)";

  return (
    <div className="py-10 px-4">
      <div className="max-w-md mx-auto space-y-4 text-center">
        {feedback && <p className="text-sm rounded-lg px-4 py-3 bg-blue-50 text-blue-700">{feedback}</p>}
        {selectedPackage && (
          <div className="rounded-lg px-4 py-3 text-sm font-medium text-green-800 bg-green-50 border border-green-200">
            Selected: {selectedPackage.name} &mdash; {fmt(selectedPackage.price)}
          </div>
        )}
        {needsSelection && (
          <div className="rounded-lg px-4 py-3 text-sm text-amber-700 bg-amber-50 border border-amber-200">
            Select a service package above to continue
          </div>
        )}
        {!selectedPackage && savingsAmount && savingsAmount > 0 && (
          <div className="rounded-lg px-4 py-3 text-sm font-medium text-green-800 bg-green-50 border border-green-200">
            {activeTierLabel ? `${activeTierLabel}: ` : ""}Save {fmt(savingsAmount)} &mdash; approve now to lock in your price
          </div>
        )}
        <Button
          className="w-full py-6 text-lg font-semibold text-white"
          style={{ backgroundColor: primary }}
          disabled={isSubmitting || !allowInstantApproval || needsSelection}
          onClick={handleApprove}
        >
          Approve Estimate
        </Button>
        {requireDeposit && depLabel && (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
            A deposit of {depLabel} is required to proceed.
          </p>
        )}
        {activePanel === "changes" ? (
          <div className="space-y-3 text-left">
            <Textarea placeholder="Describe the changes you'd like..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
            <div className="flex gap-2">
              <Button className="flex-1" disabled={isSubmitting || !message.trim()} onClick={handleRequestChanges}>Send Request</Button>
              <Button variant="outline" onClick={() => { setActivePanel(null); setMessage(""); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline" className="w-full py-5 font-medium"
            style={{ borderColor: primary, color: primary }}
            disabled={isSubmitting}
            onClick={() => { setActivePanel("changes"); setFeedback(null); }}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Request Changes
          </Button>
        )}
        {activePanel === "decline" ? (
          <div className="space-y-3 text-left">
            <Textarea placeholder="Reason for declining (optional)" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
            <div className="flex gap-2">
              <Button variant="destructive" className="flex-1" disabled={isSubmitting} onClick={handleDecline}>Confirm Decline</Button>
              <Button variant="outline" onClick={() => { setActivePanel(null); setReason(""); }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button
            className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
            disabled={isSubmitting}
            onClick={() => { setActivePanel("decline"); setFeedback(null); }}
          >Decline Estimate</button>
        )}
      </div>
    </div>
  );
}
