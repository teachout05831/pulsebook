"use client";

import { createContext, useContext, useMemo } from "react";
import type { TerminologySettings } from "@/types/company";
import { defaultTerminologySettings } from "@/types/company";

const TerminologyContext = createContext<TerminologySettings>(defaultTerminologySettings);

interface Props {
  settings?: Partial<TerminologySettings>;
  children: React.ReactNode;
}

export function TerminologyProvider({ settings, children }: Props) {
  const merged = useMemo<TerminologySettings>(() => {
    if (!settings) return defaultTerminologySettings;
    return {
      estimate: { ...defaultTerminologySettings.estimate, ...settings.estimate },
      job: { ...defaultTerminologySettings.job, ...settings.job },
      customer: { ...defaultTerminologySettings.customer, ...settings.customer },
      invoice: { ...defaultTerminologySettings.invoice, ...settings.invoice },
      contract: { ...defaultTerminologySettings.contract, ...settings.contract },
      estimatePage: { ...defaultTerminologySettings.estimatePage, ...settings.estimatePage },
    };
  }, [settings]);

  return (
    <TerminologyContext.Provider value={merged}>
      {children}
    </TerminologyContext.Provider>
  );
}

export function useTerminology() {
  return useContext(TerminologyContext);
}
