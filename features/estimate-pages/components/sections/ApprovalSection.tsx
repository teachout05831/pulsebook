"use client";

import type { SectionProps } from "./sectionProps";
import { useTierSelection } from "../TierSelectionContext";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function ApprovalSection({ section, brandKit, estimate, isPreview, incentiveData }: SectionProps) {
  const primaryColor = brandKit?.primaryColor || "#2563eb";
  const secondaryColor = brandKit?.secondaryColor || "#1e40af";
  const { selectedPackage, hasPackages } = useTierSelection();
  const showDepositInfo = Boolean(section.content.showDepositInfo);
  const depositAmount = section.content.depositAmount as number | undefined;
  const baseTotal = selectedPackage ? selectedPackage.price : (estimate?.total ?? 0);
  const displayTotal = !selectedPackage && incentiveData?.activeTier && incentiveData.savingsAmount > 0 ? incentiveData.discountedTotal : baseTotal;
  const originalTotal = selectedPackage ? selectedPackage.price : (estimate?.total ?? 0);
  const hasDiscount = !selectedPackage && incentiveData?.activeTier && incentiveData.savingsAmount > 0;
  const balanceDue = depositAmount ? displayTotal - depositAmount : displayTotal;
  const needsSelection = hasPackages && !selectedPackage;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20 px-4 ep-animate">
      <div className="max-w-lg mx-auto">
        <div className="ep-card-prominent p-8 sm:p-10 text-center space-y-6">
          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--heading-font, inherit)" }}
          >
            {(section.content.title as string) || "Ready to move forward?"}
          </h2>

          {!!section.content.subtitle && (
            <p className="text-gray-600 text-base leading-relaxed">
              {section.content.subtitle as string}
            </p>
          )}

          {/* Selected package indicator */}
          {selectedPackage && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm font-medium text-green-800">
              Selected: {selectedPackage.name} &mdash; {formatCurrency(selectedPackage.price)}
            </div>
          )}
          {needsSelection && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
              Select a service package above to continue
            </div>
          )}

          {/* Investment summary bar */}
          {estimate && (
            <div className="bg-gray-50 border-y border-gray-200 rounded-lg py-4 px-3 -mx-2">
              {showDepositInfo && depositAmount ? (
                <div className="grid grid-cols-3 divide-x divide-gray-200">
                  <div className="px-2">
                    <p className="text-xs text-gray-500 mb-1">Your Investment</p>
                    {hasDiscount && <p className="text-xs text-gray-400 line-through">{formatCurrency(originalTotal)}</p>}
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(displayTotal)}</p>
                  </div>
                  <div className="px-2">
                    <p className="text-xs text-gray-500 mb-1">Deposit Required</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(depositAmount)}
                    </p>
                  </div>
                  <div className="px-2">
                    <p className="text-xs text-gray-500 mb-1">Balance Due</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(balanceDue)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Investment</p>
                  {hasDiscount && <p className="text-xs text-gray-400 line-through">{formatCurrency(originalTotal)}</p>}
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(displayTotal)}</p>
                </div>
              )}
            </div>
          )}

          {showDepositInfo && estimate && depositAmount && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
              A deposit of {formatCurrency(depositAmount)} is required to confirm.
            </p>
          )}

          {/* Approve */}
          <button
            disabled={isPreview || needsSelection}
            className="w-full py-4 rounded-lg text-white font-semibold text-lg transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-sm">
              &#10003;
            </span>
            Approve Estimate
          </button>

          {/* Request Changes */}
          <button
            disabled={isPreview}
            className="w-full py-3.5 rounded-lg font-medium border-2 transition-all hover:shadow-md hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            Request Changes
          </button>

          {/* Decline */}
          <button
            disabled={isPreview}
            className="text-sm text-gray-400 hover:text-gray-600 underline transition-colors disabled:cursor-not-allowed"
          >
            Decline Estimate
          </button>

          {/* Trust signal */}
          <p className="text-xs text-gray-400 pt-2 flex items-center justify-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-70"
            >
              <path d="M8 1a4 4 0 0 0-4 4v2H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4zm-2 4a2 2 0 1 1 4 0v2H6V5z" />
            </svg>
            Your information is secure
          </p>
        </div>
      </div>
    </div>
  );
}
