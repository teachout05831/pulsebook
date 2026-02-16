"use client";

import type { SectionProps } from "./sectionProps";
import { PricingTotalBlock } from "./IncentivePricingOverlay";
import { PackagesVariant } from "./PackagesVariant";
import type { PackageItem } from "../TierSelectionContext";

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const thCls = "py-3 px-4 font-bold text-gray-500 text-[0.7rem] uppercase tracking-wider";

function PricingPlaceholder() {
  const sample = [
    { desc: "Service item description", qty: 1, rate: 250.00, total: 250.00 },
    { desc: "Materials and supplies", qty: 1, rate: 150.00, total: 150.00 },
    { desc: "Labor", qty: 4, rate: 75.00, total: 300.00 },
  ];
  return (
    <div className="opacity-40">
      <div className="space-y-1">
        {sample.map((item) => (
          <div key={item.desc} className={`flex justify-between items-center py-3 px-4 rounded-lg`}>
            <span className="text-gray-500">{item.desc}</span>
            <span className="font-medium text-gray-500">{fmt(item.total)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center py-3 px-4 mt-2 border-t-2 border-gray-200">
        <span className="font-bold text-gray-500">Total</span>
        <span className="text-xl font-bold text-gray-500">{fmt(700)}</span>
      </div>
      <p className="text-xs text-gray-400 text-center mt-4 italic">Line items from the linked estimate will appear here</p>
    </div>
  );
}

function SimpleVariant({ estimate }: { estimate: SectionProps["estimate"] }) {
  if (!estimate || estimate.lineItems.length === 0) return <PricingPlaceholder />;
  return (<div className="space-y-1">
    {estimate.lineItems.map((item, i) => (
      <div key={`${item.description}-${i}`} className={`flex justify-between items-center py-3 px-4 rounded-lg ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}>
        <span className="text-gray-700">{item.description}</span>
        <span className="font-semibold text-gray-900">{fmt(item.total)}</span>
      </div>))}
  </div>);
}

function DetailedVariant({ estimate }: { estimate: SectionProps["estimate"] }) {
  if (!estimate || estimate.lineItems.length === 0) return <PricingPlaceholder />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200 text-left">
            <th className={thCls}>Description</th>
            <th className={`${thCls} text-center w-20`}>Qty</th>
            <th className={`${thCls} text-right w-28`}>Rate</th>
            <th className={`${thCls} text-right w-28`}>Total</th>
          </tr>
        </thead>
        <tbody>
          {estimate.lineItems.map((item, i) => (
            <tr key={`${item.description}-${i}`} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
              <td className="py-3 px-4 text-gray-800">{item.description}</td>
              <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
              <td className="py-3 px-4 text-right text-gray-600">{fmt(item.unitPrice)}</td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">{fmt(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PricingSection({ section, brandKit, estimate, incentiveData }: SectionProps) {
  const variant = (section.settings.variant as string) || "detailed";
  const primaryColor = brandKit?.primaryColor || "#2563eb";
  const title = (section.content.title as string) || "Pricing";
  const packages = section.content.packages as PackageItem[] | undefined;
  return (
    <div className="ep-animate px-4 bg-gray-50/50" style={{ "--primary-color": primaryColor, paddingTop: "var(--section-spacing, 3rem)", paddingBottom: "var(--section-spacing, 3rem)" } as React.CSSProperties}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <span className="ep-section-label" style={{ color: primaryColor }}>Pricing</span>
          <h2 className="text-xl sm:text-2xl" style={{ color: primaryColor }}>{title}</h2>
        </div>
        <div className={variant === "packages" ? "" : "ep-card-elevated p-8"}>
          {variant === "simple" && (<>
            <SimpleVariant estimate={estimate} />
            {estimate && <PricingTotalBlock estimate={estimate} pricingModel={estimate.pricingModel} resources={estimate.resources} lineItems={estimate.lineItems} activeTier={incentiveData?.activeTier} discountedTotal={incentiveData?.discountedTotal} savingsAmount={incentiveData?.savingsAmount} />}
          </>)}
          {variant === "detailed" && (<>
            <DetailedVariant estimate={estimate} />
            {estimate && <PricingTotalBlock estimate={estimate} pricingModel={estimate.pricingModel} resources={estimate.resources} lineItems={estimate.lineItems} activeTier={incentiveData?.activeTier} discountedTotal={incentiveData?.discountedTotal} savingsAmount={incentiveData?.savingsAmount} />}
          </>)}
          {variant === "packages" && packages && packages.length > 0 ? (
            <PackagesVariant packages={packages} />
          ) : variant === "packages" ? (<>
            <div className="ep-card-elevated p-8">
              <DetailedVariant estimate={estimate} />
              {estimate && <PricingTotalBlock estimate={estimate} pricingModel={estimate.pricingModel} resources={estimate.resources} lineItems={estimate.lineItems} activeTier={incentiveData?.activeTier} discountedTotal={incentiveData?.discountedTotal} savingsAmount={incentiveData?.savingsAmount} />}
            </div>
          </>) : null}
        </div>
      </div>
    </div>
  );
}
