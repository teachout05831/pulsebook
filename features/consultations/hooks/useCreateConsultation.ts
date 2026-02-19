"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface CustomerOption { id: string; name: string }

interface UseCreateConsultationOptions {
  open: boolean;
  presetCustomerId?: string;
  presetCustomerName?: string;
}

export function useCreateConsultation({ open, presetCustomerId, presetCustomerName }: UseCreateConsultationOptions) {
  const needsPicker = !presetCustomerId;

  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(presetCustomerId || "");
  const [selectedCustomerName, setSelectedCustomerName] = useState(presetCustomerName || "");
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("discovery");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  // Load customers when modal opens (only if no preset customer)
  useEffect(() => {
    if (!open || !needsPicker) return;
    setIsLoadingCustomers(true);
    fetch("/api/customers?_page=1&_limit=200")
      .then((r) => r.json())
      .then((res) => setCustomers(res.data || []))
      .catch(() => {})
      .finally(() => setIsLoadingCustomers(false));
  }, [open, needsPicker]);

  // Set default title from preset customer
  useEffect(() => {
    if (open && presetCustomerName) setTitle(`Video Consultation with ${presetCustomerName}`);
  }, [open, presetCustomerName]);

  const [customerSearch, setCustomerSearch] = useState("");
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, customerSearch]);

  const handleCustomerChange = useCallback((id: string) => {
    setSelectedCustomerId(id);
    const cust = customers.find((c) => c.id === id);
    if (cust) { setSelectedCustomerName(cust.name); setTitle(`Video Consultation with ${cust.name}`); }
  }, [customers]);

  const handleCreate = useCallback(async () => {
    const cId = presetCustomerId || selectedCustomerId;
    setIsCreating(true);
    try {
      const body: Record<string, unknown> = { customerId: cId || undefined, title, purpose };
      if (scheduledAt) body.scheduledAt = new Date(scheduledAt).toISOString();
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setCreatedLink(`${window.location.origin}/c/${data.data.publicToken}`);
        setConsultationId(data.data.id);
      }
    } catch {
      // Error handled by UI state
    } finally {
      setIsCreating(false);
    }
  }, [presetCustomerId, selectedCustomerId, title, purpose, scheduledAt]);

  const reset = useCallback(() => {
    setCreatedLink(null);
    setConsultationId(null);
    setTitle("");
    setPurpose("discovery");
    setScheduledAt("");
    if (needsPicker) { setSelectedCustomerId(""); setSelectedCustomerName(""); setCustomerSearch(""); }
  }, [needsPicker]);

  return {
    needsPicker, customers, filteredCustomers, isLoadingCustomers,
    selectedCustomerId, selectedCustomerName, handleCustomerChange,
    customerSearch, setCustomerSearch,
    title, setTitle, purpose, setPurpose,
    scheduledAt, setScheduledAt,
    isCreating, createdLink, consultationId,
    handleCreate, reset,
  };
}
