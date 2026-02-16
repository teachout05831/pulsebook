import type { EstimateLineItem, EstimateResources, PricingModel, AppliedFee } from "@/types/estimate";

interface TotalResult {
  subtotal: number;
  taxableAmount: number;
  taxAmount: number;
  feesTotal: number;
  total: number;
  depositAmount: number;
  balanceDue: number;
}

interface CalcInput {
  lineItems: EstimateLineItem[];
  resources: EstimateResources;
  pricingModel: PricingModel;
  taxRate: number;
  depositType: "percentage" | "fixed" | null;
  depositValue: number;
  depositPaid: number;
  appliedFees?: AppliedFee[];
}

export function calculateTotals(input: CalcInput): TotalResult {
  let subtotal = 0;
  let taxableAmount = 0;

  for (const item of input.lineItems) {
    const itemTotal = item.quantity * item.unitPrice;
    if (item.category === "discount") {
      subtotal -= Math.abs(itemTotal);
    } else {
      subtotal += itemTotal;
    }
    if (item.isTaxable !== false && item.category !== "discount") {
      taxableAmount += itemTotal;
    }
  }

  const taxAmount = taxableAmount * (input.taxRate / 100);
  const preTax = subtotal + taxAmount;

  // Calculate applied fees (after subtotal + tax)
  let feesTotal = 0;
  for (const fee of input.appliedFees ?? []) {
    if (!fee.applied) continue;
    feesTotal += fee.type === "percentage" ? subtotal * (fee.rate / 100) : fee.rate;
  }

  const total = preTax + feesTotal;

  let depositAmount = 0;
  if (input.depositType === "percentage") {
    depositAmount = total * (input.depositValue / 100);
  } else if (input.depositType === "fixed") {
    depositAmount = input.depositValue;
  }

  return {
    subtotal,
    taxableAmount,
    taxAmount,
    feesTotal,
    total,
    depositAmount,
    balanceDue: total - input.depositPaid,
  };
}
