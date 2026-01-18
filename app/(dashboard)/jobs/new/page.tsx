"use client";

import { useState, useEffect } from "react";
import { useCreate, useList, useOne } from "@refinedev/core";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Job, Customer, Estimate } from "@/types";

function FormField({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface FormData {
  customerId: string;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: string;
  address: string;
  assignedTo: string;
  notes: string;
}

interface FormErrors {
  customerId?: string;
  title?: string;
  scheduledDate?: string;
}

export default function NewJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId");
  const fromEstimateId = searchParams.get("fromEstimate");
  const preselectedDate = searchParams.get("date");

  // Fetch customers for dropdown
  const { query: customersQuery, result: customersResult } = useList<Customer>({
    resource: "customers",
    pagination: {
      currentPage: 1,
      pageSize: 100, // Get all customers for dropdown
    },
  });

  const customers = customersResult.data ?? [];
  const isLoadingCustomers = customersQuery.isLoading;

  // Fetch estimate if converting from estimate
  const { query: estimateQuery } = useOne<Estimate>({
    resource: "estimates",
    id: fromEstimateId || "",
    queryOptions: {
      enabled: !!fromEstimateId,
    },
  });

  const estimate = estimateQuery.data?.data;
  const isLoadingEstimate = estimateQuery.isLoading && !!fromEstimateId;

  // Create mutation
  const { mutate: createJob, mutation } = useCreate<Job>();
  const isCreating = mutation.isPending;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    customerId: preselectedCustomerId || "",
    title: "",
    description: "",
    scheduledDate: preselectedDate || new Date().toISOString().split("T")[0], // Default to today or preselected
    scheduledTime: "",
    estimatedDuration: "",
    address: "",
    assignedTo: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [estimateApplied, setEstimateApplied] = useState(false);

  // Pre-fill from estimate when loaded
  useEffect(() => {
    if (estimate && !estimateApplied) {
      const lineItemsSummary = estimate.lineItems
        .map((item) => `- ${item.description} (${item.quantity}x @ $${item.unitPrice})`)
        .join("\n");

      setFormData((prev) => ({
        ...prev,
        customerId: estimate.customerId,
        title: `Job from ${estimate.estimateNumber}`,
        description: `Services from estimate ${estimate.estimateNumber}:\n${lineItemsSummary}\n\nTotal: $${estimate.total.toFixed(2)}`,
        address: estimate.address || prev.address,
        notes: estimate.notes || "",
      }));
      setEstimateApplied(true);
    }
  }, [estimate, estimateApplied]);

  // Update address when customer changes
  useEffect(() => {
    if (formData.customerId && customers.length > 0 && !estimate) {
      const selectedCustomer = customers.find(c => c.id === formData.customerId);
      if (selectedCustomer?.address && !formData.address) {
        setFormData(prev => ({ ...prev, address: selectedCustomer.address || "" }));
      }
    }
  }, [formData.customerId, customers, formData.address, estimate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCustomerChange = (value: string) => {
    const selectedCustomer = customers.find(c => c.id === value);
    setFormData((prev) => ({
      ...prev,
      customerId: value,
      address: selectedCustomer?.address || prev.address,
    }));
    if (errors.customerId) {
      setErrors((prev) => ({ ...prev, customerId: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Scheduled date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedCustomer = customers.find(c => c.id === formData.customerId);

    createJob(
      {
        resource: "jobs",
        values: {
          customerId: formData.customerId,
          customerName: selectedCustomer?.name || "",
          title: formData.title,
          description: formData.description || null,
          status: "scheduled",
          scheduledDate: formData.scheduledDate,
          scheduledTime: formData.scheduledTime || null,
          estimatedDuration: formData.estimatedDuration
            ? parseInt(formData.estimatedDuration, 10)
            : null,
          address: formData.address || null,
          assignedTo: formData.assignedTo || null,
          notes: formData.notes || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Job created successfully");
          router.push("/jobs");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create job");
        },
      }
    );
  };

  const handleCancel = () => {
    router.push("/jobs");
  };

  if (isLoadingEstimate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Job</h1>
            <p className="text-muted-foreground">Loading estimate data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">New Job</h1>
            {estimate && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <FileText className="mr-1 h-3 w-3" />
                From {estimate.estimateNumber}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {estimate
              ? `Creating job from approved estimate for ${estimate.customerName}`
              : "Schedule a new service job"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Customer *" error={errors.customerId}>
                <Select
                  value={formData.customerId}
                  onValueChange={handleCustomerChange}
                  disabled={isLoadingCustomers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCustomers ? "Loading..." : "Select a customer"} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Title *" error={errors.title}>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Pool Cleaning, Lawn Mowing"
                  autoFocus={!preselectedCustomerId}
                />
              </FormField>

              <FormField label="Scheduled Date *" error={errors.scheduledDate}>
                <Input
                  name="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Scheduled Time">
                <Input
                  name="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Estimated Duration (minutes)">
                <Input
                  name="estimatedDuration"
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  placeholder="60"
                />
              </FormField>

              <FormField label="Assigned To">
                <Input
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="Technician name"
                />
              </FormField>
            </div>

            <FormField label="Service Address">
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Service address (auto-filled from customer)"
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Job description..."
                rows={3}
              />
            </FormField>

            <FormField label="Notes">
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Internal notes..."
                rows={3}
              />
            </FormField>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
