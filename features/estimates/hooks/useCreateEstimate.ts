"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface CustomerOption {
  id: string;
  name: string;
}

export function useCreateEstimate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId") || "";

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [customerId, setCustomerId] = useState(preselectedCustomerId);
  const [pricingModel, setPricingModel] = useState("flat");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch("/api/customers?_limit=200&_page=1")
      .then((r) => { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then((j) => {
        const list = (j.data || []).map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }));
        setCustomers(list);
      })
      .catch(() => toast.error("Failed to load customers"))
      .finally(() => setIsLoadingCustomers(false));
  }, []);

  const handleCreate = useCallback(async () => {
    if (!customerId) { toast.error("Please select a customer"); return; }
    setIsCreating(true);
    try {
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, pricingModel, status: "draft" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create");
      toast.success("Estimate created");
      router.push(`/estimates/${json.data.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create");
      setIsCreating(false);
    }
  }, [customerId, pricingModel, router]);

  const handleCancel = () => router.push("/estimates");

  return {
    customers, isLoadingCustomers, customerId, setCustomerId,
    pricingModel, setPricingModel, isCreating, handleCreate, handleCancel,
  };
}
