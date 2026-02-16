"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronRight, Trash2, PenLine } from "lucide-react";
import { ServicePickerModal } from "@/features/estimates/components/pickers/ServicePickerModal";
import { MaterialPickerModal } from "@/features/estimates/components/pickers/MaterialPickerModal";
import { CustomLineItemModal } from "@/features/estimates/components/pickers/CustomLineItemModal";
import { calculateTotals } from "@/features/estimates/utils/calculateTotals";
import { FeeTogglesSection } from "@/features/estimates/components/right/FeeTogglesSection";
import { HourlyRangeDisplay } from "@/features/estimates/components/shared/HourlyRangeDisplay";
import type { JobDetail } from "@/types/job";
import type { EstimateLineItem, LineItemCategory, AppliedFee } from "@/types/estimate";
import type { EstimatePricingCategory } from "@/types/company";

interface Props {
  job: JobDetail;
  categories: EstimatePricingCategory[];
  lineItems: EstimateLineItem[];
  onAddItem: (item: EstimateLineItem) => void;
  onRemoveItem: (id: string) => void;
  appliedFees?: AppliedFee[];
  onUpdateFees?: (fees: AppliedFee[]) => void;
  onOpenPayments?: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function JobPricingCard({ job, categories, lineItems, onAddItem, onRemoveItem, appliedFees = [], onUpdateFees, onOpenPayments }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ primary_service: true });
  const [servicePicker, setServicePicker] = useState<LineItemCategory | null>(null);
  const [materialPicker, setMaterialPicker] = useState(false);
  const [customPicker, setCustomPicker] = useState<LineItemCategory | null>(null);

  const enabledCats = categories.filter((c) => c.enabled);
  const itemsByCategory = (key: string) => lineItems.filter((li) => (li.category || "primary_service") === key);
  const toggle = (key: string) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const totals = calculateTotals({
    lineItems, resources: job.resources || {}, pricingModel: job.pricingModel || "flat",
    taxRate: job.taxRate || 0, depositType: job.depositType as "percentage" | "fixed" | null,
    depositValue: job.depositAmount || 0, depositPaid: job.depositPaid || 0,
    appliedFees,
  });
  const handleFeeToggle = (feeId: string, applied: boolean) => {
    if (!onUpdateFees) return;
    onUpdateFees(appliedFees.map((f) => (f.feeId === feeId ? { ...f, applied } : f)));
  };
  const hasDeposit = job.depositType && job.depositAmount;
  const primaryItems = lineItems.filter((li) => (li.category || "primary_service") === "primary_service");
  const hourlyRate = primaryItems.length > 0 ? primaryItems.reduce((s, li) => s + li.unitPrice, 0) / primaryItems.length : 0;

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4 space-y-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold">Pricing</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setCustomPicker("primary_service")}>
              <PenLine className="mr-1 h-3 w-3" />Custom
            </Button>
          </div>

          {enabledCats.map((cat) => {
            const items = itemsByCategory(cat.key);
            const isOpen = expanded[cat.key];
            const catTotal = items.reduce((s, i) => s + i.total, 0);
            return (
              <div key={cat.key} className="border rounded-md">
                <button type="button" onClick={() => toggle(cat.key)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] hover:bg-muted/50">
                  <div className="flex items-center gap-1.5">
                    {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    <span className="font-medium">{cat.label}</span>
                    <span className="text-[11px] text-slate-400">({items.length})</span>
                  </div>
                  <span className="font-medium">{catTotal > 0 ? fmt(catTotal) : "\u2014"}</span>
                </button>
                {isOpen && (
                  <div className="border-t px-3 py-1.5 space-y-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-[13px] group">
                        <span className="text-slate-500 truncate flex-1">{item.description} x{item.quantity}</span>
                        <span className="ml-2">{fmt(item.total)}</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 opacity-0 group-hover:opacity-100"
                          onClick={() => onRemoveItem(item.id)}><Trash2 className="h-2.5 w-2.5" /></Button>
                      </div>
                    ))}
                    <div className="flex gap-1 pt-1">
                      {(cat.key === "primary_service" || cat.key === "additional_service") && (
                        <Button variant="ghost" size="sm" className="h-5 text-[11px]" onClick={() => setServicePicker(cat.key as LineItemCategory)}>
                          <Plus className="mr-0.5 h-2.5 w-2.5" />Service
                        </Button>
                      )}
                      {cat.key === "materials" && (
                        <Button variant="ghost" size="sm" className="h-5 text-[11px]" onClick={() => setMaterialPicker(true)}>
                          <Plus className="mr-0.5 h-2.5 w-2.5" />Material
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-5 text-[11px]" onClick={() => setCustomPicker(cat.key as LineItemCategory)}>
                        <Plus className="mr-0.5 h-2.5 w-2.5" />Custom
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-3 space-y-1">
            <div className="flex justify-between text-[13px]"><span className="font-semibold">Subtotal</span><span className="font-semibold">{fmt(totals.subtotal)}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Sales Tax</span><span>{totals.taxAmount > 0 ? fmt(totals.taxAmount) : "\u2014"}</span></div>
            <FeeTogglesSection fees={appliedFees} isHourly={job.pricingModel === "hourly"} onToggle={handleFeeToggle} />
            {totals.feesTotal > 0 && <div className="flex justify-between text-[13px]"><span className="text-slate-500">Fees Total</span><span>{fmt(totals.feesTotal)}</span></div>}
            <div className="border-t my-1" />
            <div className="flex justify-between text-[13px]"><span className="font-semibold">Total</span><span className="font-semibold">{fmt(totals.total)}</span></div>
            {hasDeposit && (
              <>
                <div className="flex justify-between text-[13px]"><span className={onOpenPayments ? "text-blue-600 cursor-pointer hover:underline" : "text-slate-500"} onClick={onOpenPayments}>Payments</span><span>{totals.depositAmount > 0 ? fmt(totals.depositAmount) : "\u2014"}</span></div>
                <div className="border-t my-1" />
                <div className="flex justify-between text-sm"><span className="font-bold">Balance</span><span className="font-bold">{fmt(totals.balanceDue)}</span></div>
              </>
            )}
          </div>
        </CardContent>

        <div className="bg-green-800 text-white rounded-b-xl px-5 py-3">
          {job.pricingModel === "hourly" && job.resources ? (
            <HourlyRangeDisplay resources={job.resources} rate={hourlyRate} total={totals.total} textColor="white" />
          ) : (
            <div className="flex justify-between items-baseline">
              <span className="font-semibold">Job Total:</span>
              <span className="text-xl font-bold">{fmt(totals.total)}</span>
            </div>
          )}
        </div>
      </Card>

      <ServicePickerModal isOpen={!!servicePicker} onClose={() => setServicePicker(null)} onAdd={onAddItem} category={servicePicker || "primary_service"} />
      <MaterialPickerModal isOpen={materialPicker} onClose={() => setMaterialPicker(false)} onAdd={onAddItem} />
      <CustomLineItemModal isOpen={!!customPicker} onClose={() => setCustomPicker(null)} onAdd={onAddItem} defaultCategory={customPicker || "primary_service"} />
    </>
  );
}
