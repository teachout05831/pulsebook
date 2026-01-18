"use client";

import { useState, useEffect } from "react";
import { useCreate, useList } from "@refinedev/core";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Estimate, Customer, EstimateLineItem } from "@/types";

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

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

interface LineItemInput {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface FormData {
  customerId: string;
  issueDate: string;
  expiryDate: string;
  address: string;
  notes: string;
  terms: string;
  taxRate: number;
}

interface FormErrors {
  customerId?: string;
  lineItems?: string;
}

export default function NewEstimatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId");

  // Fetch customers for dropdown
  const { query: customersQuery, result: customersResult } = useList<Customer>({
    resource: "customers",
    pagination: {
      currentPage: 1,
      pageSize: 100,
    },
  });

  const customers = customersResult.data ?? [];
  const isLoadingCustomers = customersQuery.isLoading;

  // Create mutation
  const { mutate: createEstimate, mutation } = useCreate<Estimate>();
  const isCreating = mutation.isPending;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    customerId: preselectedCustomerId || "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
    address: "",
    notes: "",
    terms: "Payment due within 30 days of service completion.",
    taxRate: 8,
  });

  // Line items state
  const [lineItems, setLineItems] = useState<LineItemInput[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);

  const [errors, setErrors] = useState<FormErrors>({});

  // Update address when customer changes
  useEffect(() => {
    if (formData.customerId && customers.length > 0) {
      const selectedCustomer = customers.find((c) => c.id === formData.customerId);
      if (selectedCustomer?.address && !formData.address) {
        setFormData((prev) => ({ ...prev, address: selectedCustomer.address || "" }));
      }
    }
  }, [formData.customerId, customers, formData.address]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (value: string) => {
    const selectedCustomer = customers.find((c) => c.id === value);
    setFormData((prev) => ({
      ...prev,
      customerId: value,
      address: selectedCustomer?.address || prev.address,
    }));
    if (errors.customerId) {
      setErrors((prev) => ({ ...prev, customerId: undefined }));
    }
  };

  // Line item handlers
  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: String(Date.now()), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItemInput, value: string | number) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    if (errors.lineItems) {
      setErrors((prev) => ({ ...prev, lineItems: undefined }));
    }
  };

  // Calculate totals
  const calculateLineTotal = (item: LineItemInput): number => {
    return item.quantity * item.unitPrice;
  };

  const subtotal = lineItems.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const taxAmount = subtotal * (formData.taxRate / 100);
  const total = subtotal + taxAmount;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = "Customer is required";
    }

    const validLineItems = lineItems.filter(
      (item) => item.description.trim() && item.quantity > 0 && item.unitPrice > 0
    );
    if (validLineItems.length === 0) {
      newErrors.lineItems = "At least one line item with description, quantity, and price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedCustomer = customers.find((c) => c.id === formData.customerId);

    // Prepare line items with totals
    const preparedLineItems: EstimateLineItem[] = lineItems
      .filter((item) => item.description.trim() && item.quantity > 0 && item.unitPrice > 0)
      .map((item, index) => ({
        id: String(index + 1),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: calculateLineTotal(item),
      }));

    createEstimate(
      {
        resource: "estimates",
        values: {
          customerId: formData.customerId,
          customerName: selectedCustomer?.name || "",
          status: "draft",
          issueDate: formData.issueDate,
          expiryDate: formData.expiryDate || null,
          lineItems: preparedLineItems,
          taxRate: formData.taxRate,
          notes: formData.notes || null,
          terms: formData.terms || null,
          address: formData.address || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Estimate created successfully");
          router.push("/estimates");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create estimate");
        },
      }
    );
  };

  const handleCancel = () => {
    router.push("/estimates");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Estimate</h1>
          <p className="text-muted-foreground">Create a new estimate for a customer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Line Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Line Items</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                {errors.lineItems && (
                  <p className="text-sm text-destructive">{errors.lineItems}</p>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead className="w-[15%]">Qty</TableHead>
                      <TableHead className="w-[20%]">Unit Price</TableHead>
                      <TableHead className="w-[15%] text-right">Total</TableHead>
                      <TableHead className="w-[10%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                            placeholder="Service description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value, 10) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(calculateLineTotal(item))}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLineItem(item.id)}
                            disabled={lineItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Totals */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground items-center">
                    <span className="flex items-center gap-2">
                      Tax (
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.taxRate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                        className="w-16 h-6 text-center"
                      />
                      %)
                    </span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes & Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Notes & Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Notes">
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes for this estimate..."
                    rows={3}
                  />
                </FormField>
                <FormField label="Terms & Conditions">
                  <Textarea
                    name="terms"
                    value={formData.terms}
                    onChange={handleChange}
                    placeholder="Payment terms, conditions, etc..."
                    rows={3}
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer & Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <FormField label="Issue Date">
                  <Input
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Expiry Date">
                  <Input
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </FormField>

                <FormField label="Service Address">
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Service address"
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Estimate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
