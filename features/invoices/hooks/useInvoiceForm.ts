"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { Customer, Job, InvoiceLineItem } from "@/types";

export interface LineItemInput {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceFormData {
  customerId: string;
  jobId: string;
  issueDate: string;
  dueDate: string;
  address: string;
  notes: string;
  terms: string;
  taxRate: number;
}

interface FormErrors {
  customerId?: string;
  lineItems?: string;
}

export function useInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId");
  const preselectedJobId = searchParams.get("jobId");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [preselectedJob, setPreselectedJob] = useState<Job | null>(null);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<InvoiceFormData>({
    customerId: preselectedCustomerId || "",
    jobId: preselectedJobId || "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    address: "", notes: "",
    terms: "Payment due within 30 days of invoice date.",
    taxRate: 8,
  });

  const [lineItems, setLineItems] = useState<LineItemInput[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [custRes, jobsRes] = await Promise.all([
          fetch("/api/customers?_page=1&_limit=100"),
          fetch("/api/jobs?_page=1&_limit=100"),
        ]);
        if (custRes.ok) {
          const { data } = await custRes.json();
          setCustomers(data ?? []);
        }
        if (jobsRes.ok) {
          const { data } = await jobsRes.json();
          setJobs(data ?? []);
        }
      } catch { /* ignore */ }
      finally { setIsLoadingCustomers(false); }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!preselectedJobId) return;
    async function loadJob() {
      try {
        const res = await fetch(`/api/jobs/${preselectedJobId}`);
        if (res.ok) {
          const { data } = await res.json();
          setPreselectedJob(data);
        }
      } catch { /* ignore */ }
    }
    loadJob();
  }, [preselectedJobId]);

  useEffect(() => {
    if (preselectedJob && !initialized) {
      setFormData((prev) => ({ ...prev, customerId: preselectedJob.customerId, address: preselectedJob.address || prev.address, notes: preselectedJob.notes || "" }));
      if (preselectedJob.title) {
        setLineItems([{ id: "1", description: preselectedJob.title + (preselectedJob.description ? ` - ${preselectedJob.description}` : ""), quantity: 1, unitPrice: 0 }]);
      }
      setInitialized(true);
    }
  }, [preselectedJob, initialized]);

  useEffect(() => {
    if (formData.customerId && customers.length > 0 && !preselectedJob) {
      const selected = customers.find((c) => c.id === formData.customerId);
      if (selected?.address && !formData.address) {
        setFormData((prev) => ({ ...prev, address: selected.address || "" }));
      }
    }
  }, [formData.customerId, customers, formData.address, preselectedJob]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCustomerChange = useCallback((value: string) => {
    const selected = customers.find((c) => c.id === value);
    setFormData((prev) => ({ ...prev, customerId: value, address: selected?.address || prev.address }));
    setErrors((prev) => ({ ...prev, customerId: undefined }));
  }, [customers]);

  const handleJobChange = useCallback((value: string) => {
    const selectedJob = jobs.find((j) => j.id === value);
    if (selectedJob) {
      setFormData((prev) => ({ ...prev, jobId: value, customerId: selectedJob.customerId, address: selectedJob.address || prev.address }));
    } else {
      setFormData((prev) => ({ ...prev, jobId: value }));
    }
  }, [jobs]);

  const addLineItem = useCallback(() => {
    setLineItems((prev) => [...prev, { id: String(Date.now()), description: "", quantity: 1, unitPrice: 0 }]);
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setLineItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  }, []);

  const updateLineItem = useCallback((id: string, field: keyof LineItemInput, value: string | number) => {
    setLineItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    setErrors((prev) => ({ ...prev, lineItems: undefined }));
  }, []);

  const setTaxRate = useCallback((rate: number) => {
    setFormData((prev) => ({ ...prev, taxRate: rate }));
  }, []);

  const calculateLineTotal = (item: LineItemInput): number => item.quantity * item.unitPrice;
  const subtotal = lineItems.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const taxAmount = subtotal * (formData.taxRate / 100);
  const total = subtotal + taxAmount;

  const filteredJobs = formData.customerId ? jobs.filter((j) => j.customerId === formData.customerId) : jobs;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.customerId) newErrors.customerId = "Customer is required";
    const valid = lineItems.filter((i) => i.description.trim() && i.quantity > 0 && i.unitPrice > 0);
    if (valid.length === 0) newErrors.lineItems = "At least one line item with description, quantity, and price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const selectedCustomer = customers.find((c) => c.id === formData.customerId);
    const preparedLineItems: InvoiceLineItem[] = lineItems
      .filter((i) => i.description.trim() && i.quantity > 0 && i.unitPrice > 0)
      .map((item, index) => ({
        id: String(index + 1), description: item.description, quantity: item.quantity,
        unitPrice: item.unitPrice, total: calculateLineTotal(item),
      }));
    setIsCreating(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: formData.customerId, customerName: selectedCustomer?.name || "",
          jobId: formData.jobId || null, status: "draft", issueDate: formData.issueDate,
          dueDate: formData.dueDate, lineItems: preparedLineItems, taxRate: formData.taxRate,
          notes: formData.notes || null, terms: formData.terms || null, address: formData.address || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create invoice");
      }
      toast.success("Invoice created successfully");
      router.push("/invoices");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create invoice");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => router.push("/invoices");

  return {
    formData, lineItems, errors, customers, isLoadingCustomers, isCreating,
    filteredJobs, subtotal, taxAmount, total, calculateLineTotal,
    handleChange, handleCustomerChange, handleJobChange,
    addLineItem, removeLineItem, updateLineItem, setTaxRate,
    handleSubmit, handleCancel,
  };
}
