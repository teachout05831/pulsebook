"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

export interface PackageItem {
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  tierLabel?: string;
  savingsNote?: string;
  priceNote?: string;
}

interface TierSelectionContextType {
  selectedTierIndex: number | null;
  selectedPackage: PackageItem | null;
  hasPackages: boolean;
  setHasPackages: (v: boolean) => void;
  selectTier: (index: number, pkg: PackageItem) => void;
}

const TierSelectionContext = createContext<TierSelectionContextType>({
  selectedTierIndex: null,
  selectedPackage: null,
  hasPackages: false,
  setHasPackages: () => {},
  selectTier: () => {},
});

export function TierSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedTierIndex, setSelectedTierIndex] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [hasPackages, setHasPackages] = useState(false);

  const selectTier = useCallback((index: number, pkg: PackageItem) => {
    setSelectedTierIndex(index);
    setSelectedPackage(pkg);
  }, []);

  return (
    <TierSelectionContext.Provider value={{ selectedTierIndex, selectedPackage, hasPackages, setHasPackages, selectTier }}>
      {children}
    </TierSelectionContext.Provider>
  );
}

export function useTierSelection() {
  return useContext(TierSelectionContext);
}
