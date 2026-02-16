"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/features/payments/types";
import { calculateCcFee } from "@/features/payments/utils/calculateCcFee";
import type { ServicePackage } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  onPurchase: (input: { customerId: string; packageId: string; paymentMethod: string; paymentDate: string; autoRenew: boolean; referenceNumber?: string }) => Promise<{ error?: string }>;
  isPurchasing: boolean;
}

const fmt = (n: number) => `$${n.toFixed(2)}`;

export function PurchasePackageModal({ open, onClose, customerId, customerName, onPurchase, isPurchasing }: Props) {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [referenceNumber, setReferenceNumber] = useState("");
  const [autoRenew, setAutoRenew] = useState(false);
  const [isLoadingPkgs, setIsLoadingPkgs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    setMethod("cash");
    setPaymentDate(new Date().toISOString().slice(0, 10));
    setReferenceNumber("");
    setAutoRenew(false);
    setError(null);

    setIsLoadingPkgs(true);
    fetch("/api/prepaid-packages?activeOnly=true")
      .then((r) => r.json())
      .then((json) => setPackages(json.data || []))
      .catch(() => setPackages([]))
      .finally(() => setIsLoadingPkgs(false));
  }, [open]);

  const selectedPkg = packages.find((p) => p.id === selectedId);
  const ccFee = method === "card" && selectedPkg ? calculateCcFee(selectedPkg.totalPrice) : null;

  const handleSubmit = async () => {
    if (!selectedId) { setError("Select a package"); return; }
    setError(null);
    const result = await onPurchase({
      customerId,
      packageId: selectedId,
      paymentMethod: method,
      paymentDate,
      autoRenew,
      referenceNumber: referenceNumber.trim() || undefined,
    });
    if (result.error) setError(result.error);
    else onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Package for {customerName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="space-y-1.5">
            <Label>Select Package *</Label>
            {isLoadingPkgs ? (
              <p className="text-sm text-muted-foreground">Loading packages...</p>
            ) : packages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active packages. Create one in Settings first.</p>
            ) : (
              <div className="space-y-2">
                {packages.map((pkg) => (
                  <button key={pkg.id} type="button" onClick={() => setSelectedId(pkg.id)}
                    className={`w-full rounded-lg border-2 p-3 text-left transition-colors ${selectedId === pkg.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{pkg.name}</span>
                      <span className="font-semibold text-sm">{fmt(pkg.totalPrice)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{pkg.visitCount} visits &middot; {fmt(pkg.perVisitPrice)}/visit</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Payment Method *</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
                    <SelectItem key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pp-date">Payment Date *</Label>
              <Input id="pp-date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pp-ref">Reference #</Label>
            <Input id="pp-ref" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} placeholder="Optional" />
          </div>

          {ccFee && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-2.5 text-sm">
              <span className="text-amber-800">CC Fee ({ccFee.ccFeeRate}%): {fmt(ccFee.ccFeeAmount)}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch id="pp-renew" checked={autoRenew} onCheckedChange={setAutoRenew} />
            <Label htmlFor="pp-renew">Auto-renew when visits are used up</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPurchasing}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPurchasing || !selectedId}>
            {isPurchasing ? "Processing..." : "Purchase Package"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
