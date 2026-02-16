"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomFieldsForm } from "@/features/custom-fields";
import { TagSelector } from "@/features/tags";

function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
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

export function CreateCustomerForm() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "", email: "", phone: "", address: "", notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [customFields, setCustomFields] = useState<Record<string, unknown>>({});
  const [tags, setTags] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, customFields, tags }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create customer");
      }
      toast.success("Customer created successfully");
      router.push("/customers");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create customer");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => router.push("/customers");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Customer</h1>
          <p className="text-muted-foreground">Add a new customer to your database</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Name *" error={errors.name}>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Customer name" autoFocus />
              </FormField>
              <FormField label="Email" error={errors.email}>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
              </FormField>
              <FormField label="Phone">
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" />
              </FormField>
              <FormField label="Address">
                <Input name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City, State" />
              </FormField>
            </div>
            <FormField label="Notes">
              <Textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any additional notes about this customer..." rows={4} />
            </FormField>
            <FormField label="Tags">
              <TagSelector selectedTags={tags} onChange={setTags} />
            </FormField>
            <CustomFieldsForm entityType="customer" values={customFields} onChange={setCustomFields} />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
