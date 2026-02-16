"use client";

import { useState, useCallback } from "react";
import type { SalesLeader, DetailPopupData } from "../types";

interface UseDetailPopupReturn {
  popupData: DetailPopupData | null;
  isOpen: boolean;
  openSalesLeader: (leader: SalesLeader) => void;
  closeDetail: () => void;
}

export function useDetailPopup(): UseDetailPopupReturn {
  const [popupData, setPopupData] = useState<DetailPopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSalesLeader = useCallback((leader: SalesLeader) => {
    setPopupData({ type: "sales_leader", item: leader });
    setIsOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsOpen(false);
    setPopupData(null);
  }, []);

  return { popupData, isOpen, openSalesLeader, closeDetail };
}
