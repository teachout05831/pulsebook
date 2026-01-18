"use client";

import { useState, useEffect } from "react";
import { useOne, useUpdate, useDelete } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Customer } from "@/types";

// Form field component for consistent styling
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

// Loading skeleton for the form
function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  // Fetch customer data
  const { query } = useOne<Customer>({
    resource: "customers",
    id: customerId,
  });

  const { data: customerData, isLoading, isError } = query;
  const customer = customerData?.data;

  // Update mutation
  const { mutate: updateCustomer, mutation } = useUpdate<Customer>();
  const isUpdating = mutation.isPending;

  // Delete mutation
  const { mutate: deleteCustomer, mutation: deleteMutation } = useDelete<Customer>();
  const isDeleting = deleteMutation.isPending;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);

  // Populate form when customer data loads
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        notes: customer.notes || "",
      });
    }
  }, [customer]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateCustomer(
      {
        resource: "customers",
        id: customerId,
        values: formData,
      },
      {
        onSuccess: () => {
          toast.success("Customer updated successfully");
          setIsDirty(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update customer");
        },
      }
    );
  };

  // Handle back button
  const handleBack = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
        router.push("/customers");
      }
    } else {
      router.push("/customers");
    }
  };

  // Handle delete
  const handleDelete = () => {
    deleteCustomer(
      {
        resource: "customers",
        id: customerId,
      },
      {
        onSuccess: () => {
          toast.success("Customer deleted successfully");
          router.push("/customers");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete customer");
        },
      }
    );
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              Failed to load customer. The customer may not exist.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isLoading ? "Loading..." : customer?.name || "Customer"}
            </h1>
            <p className="text-muted-foreground">Edit customer details</p>
          </div>
        </div>
        {!isLoading && customer && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {customer.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField label="Name *" error={errors.name}>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Customer name"
                  />
                </FormField>

                <FormField label="Email" error={errors.email}>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </FormField>

                <FormField label="Phone">
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </FormField>

                <FormField label="Address">
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State"
                  />
                </FormField>
              </div>

              <FormField label="Notes">
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes about this customer..."
                  rows={4}
                />
              </FormField>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating || !isDirty}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
