"use client";

import { useEffect } from "react";
import { useTierSelection } from "../TierSelectionContext";
import type { PackageItem } from "../TierSelectionContext";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

interface Props {
  packages: PackageItem[];
}

export function PackagesVariant({ packages }: Props) {
  const { selectedTierIndex, selectTier, setHasPackages } = useTierSelection();

  useEffect(() => {
    setHasPackages(true);
  }, [setHasPackages]);

  // Auto-select recommended on mount
  useEffect(() => {
    if (selectedTierIndex !== null) return;
    const recIdx = packages.findIndex((p) => p.recommended);
    const idx = recIdx >= 0 ? recIdx : Math.floor(packages.length / 2);
    if (packages[idx]) selectTier(idx, packages[idx]);
  }, [packages, selectedTierIndex, selectTier]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {packages.map((pkg, i) => {
          const active = i === selectedTierIndex;
          return (
            <div
              key={pkg.tierLabel || `tier-${i}`}
              className="relative rounded-2xl text-left transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
              style={{
                border: active
                  ? "3px solid #22c55e"
                  : pkg.recommended
                    ? "2px solid var(--primary-color, #e8913a)"
                    : "2px solid #e2e8f0",
                boxShadow: active
                  ? "0 10px 40px rgba(0,0,0,0.1), 0 0 0 3px rgba(34,197,94,0.15)"
                  : "0 4px 14px rgba(0,0,0,0.08)",
                transform: active ? "translateY(-4px)" : undefined,
              }}
              onClick={() => selectTier(i, pkg)}
            >
              {pkg.recommended && (
                <div
                  className="text-center py-2 text-xs font-bold text-white uppercase tracking-widest"
                  style={{ background: "linear-gradient(135deg, var(--primary-color, #e8913a), var(--accent-color, #f0a050))" }}
                >
                  Most Popular
                </div>
              )}

              <div className="px-7 pt-8 pb-5 text-center border-b border-gray-100">
                {pkg.tierLabel && (
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{pkg.tierLabel}</p>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-5" style={{ fontFamily: "var(--heading-font, inherit)" }}>
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-center gap-0.5 mb-2">
                  <span className="text-xl font-bold text-gray-900 self-start mt-1">$</span>
                  <span className="text-5xl font-extrabold text-gray-900 leading-none tracking-tight" style={{ fontFamily: "var(--heading-font, inherit)" }}>
                    {Math.floor(pkg.price).toLocaleString()}
                  </span>
                </div>
                {pkg.priceNote && <p className="text-sm text-gray-400">{pkg.priceNote}</p>}
                {pkg.savingsNote && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-green-700 bg-green-50">
                    {pkg.savingsNote}
                  </span>
                )}
              </div>

              <div className="px-7 py-5 flex-1">
                <ul className="space-y-3">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-xs"
                        style={{ background: "#f0fdf4", color: "#16a34a" }}
                      >
                        {"\u2713"}
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-7 pb-7">
                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                  style={
                    active
                      ? { background: "#22c55e", color: "#fff", border: "2px solid #22c55e" }
                      : pkg.recommended
                        ? { background: "var(--primary-color, #2563eb)", color: "#fff", border: "2px solid var(--primary-color, #2563eb)" }
                        : { background: "transparent", color: "var(--primary-color, #2563eb)", border: "2px solid var(--primary-color, #2563eb)" }
                  }
                  onClick={(e) => { e.stopPropagation(); selectTier(i, pkg); }}
                >
                  {active ? (
                    <><span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">&#10003;</span> Selected</>
                  ) : (
                    "Select This Option"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTierIndex !== null && packages[selectedTierIndex] && (
        <div
          className="flex justify-between items-center px-5 py-4 rounded-xl border-l-4"
          style={{ backgroundColor: "var(--primary-color, #2563eb)0a", borderLeftColor: "var(--primary-color, #2563eb)" }}
        >
          <span className="text-lg font-bold text-gray-900">Total &mdash; {packages[selectedTierIndex].name}</span>
          <span className="text-3xl font-bold" style={{ color: "var(--primary-color, #2563eb)" }}>
            {fmt(packages[selectedTierIndex].price)}
          </span>
        </div>
      )}
    </div>
  );
}
