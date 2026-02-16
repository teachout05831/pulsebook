"use client";

import { CompactCategorySection } from "./CompactCategorySection";
import { CompactPricingTotals } from "./CompactPricingTotals";
import { calculateTotals } from "../../utils/calculateTotals";
import type { EstimateLineItem, EstimateDetail, LineItemCategory } from "@/types/estimate";
import type { EstimatePricingCategory } from "@/types/company";

interface Props {
  estimate: EstimateDetail;
  lineItems: EstimateLineItem[];
  categories: EstimatePricingCategory[];
  onAddItem: (category: LineItemCategory) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<EstimateLineItem>) => void;
  errors?: {
    lineItems?: string;
  };
}

export function CompactPricing({ estimate, lineItems, categories, onAddItem, onRemoveItem, onUpdateItem, errors }: Props) {
  const totals = calculateTotals({
    lineItems,
    resources: estimate.resources || {},
    pricingModel: estimate.pricingModel || "flat",
    taxRate: estimate.taxRate || 0,
    depositType: estimate.depositType as "percentage" | "fixed" | null,
    depositValue: estimate.depositAmount || 0,
    depositPaid: estimate.depositPaid || 0,
    appliedFees: estimate.appliedFees || [],
  });

  const enabledCategories = categories.filter((c) => c.enabled);
  const itemsByCategory = (key: string) => lineItems.filter((li) => (li.category || "primary_service") === key);

  // Manual distribution: Left (primary, additional) | Right (trip fee, materials, discounts)
  const leftKeys = ["primary_service", "additional_service"];
  const rightKeys = ["trip_fee", "materials", "discount"];

  const leftCategories = enabledCategories.filter((c) => leftKeys.includes(c.key));
  const rightCategories = enabledCategories.filter((c) => rightKeys.includes(c.key));

  return (
    <div className={`bg-white rounded-lg p-3 ${errors?.lineItems ? "border-2 border-red-500" : "border"}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-semibold">Pricing</h3>
      </div>
      {errors?.lineItems && (
        <p className="text-[10px] text-red-600 mb-2">{errors.lineItems}</p>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        {/* Left: Primary Service, Additional Services */}
        <div className="space-y-2">
          {leftCategories.map((cat) => (
            <CompactCategorySection
              key={cat.key}
              label={cat.label}
              categoryKey={cat.key}
              items={itemsByCategory(cat.key)}
              onAddItem={() => onAddItem(cat.key as LineItemCategory)}
              onRemoveItem={onRemoveItem}
              onUpdateItem={onUpdateItem}
            />
          ))}
        </div>

        {/* Right: Trip Fee, Materials, Discounts */}
        <div className="space-y-2">
          {rightCategories.map((cat) => (
            <CompactCategorySection
              key={cat.key}
              label={cat.label}
              categoryKey={cat.key}
              items={itemsByCategory(cat.key)}
              onAddItem={() => onAddItem(cat.key as LineItemCategory)}
              onRemoveItem={onRemoveItem}
              onUpdateItem={onUpdateItem}
            />
          ))}
        </div>
      </div>

      {/* Totals: Full width at bottom */}
      {lineItems.length > 0 && <CompactPricingTotals totals={totals} />}
    </div>
  );
}
