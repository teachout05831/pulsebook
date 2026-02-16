"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { CreateLeadInput } from "@/types/customer";
import type { DropdownOption } from "@/types/company";
import { defaultCustomDropdowns } from "@/types/company";

interface AddLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (customerId: string) => void;
  sourceOptions?: DropdownOption[];
  serviceTypeOptions?: DropdownOption[];
}

export function AddLeadModal({ open, onOpenChange, onSuccess, sourceOptions, serviceTypeOptions }: AddLeadModalProps) {
  const sources = sourceOptions || defaultCustomDropdowns.sources;
  const serviceTypes = serviceTypeOptions || defaultCustomDropdowns.serviceTypes;
  const [formData, setFormData] = useState<CreateLeadInput>({
    name: "", phone: "", email: "", address: "", source: "",
    serviceType: "", serviceDate: "", estimatedValue: undefined, notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "lead", leadStatus: "new" }),
      });
      if (!res.ok) throw new Error("Failed to create lead");
      const { data } = await res.json();
      setFormData({
        name: "", phone: "", email: "", address: "", source: "",
        serviceType: "", serviceDate: "", estimatedValue: undefined, notes: "",
      });
      onOpenChange(false);
      if (onSuccess && data?.id) onSuccess(data.id as string);
    } catch {
      // Error handled silently; toast can be added if needed
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof CreateLeadInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Enter customer name" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(555) 555-5555" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="email@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Lead Source</Label>
              <select id="source" value={formData.source} onChange={(e) => updateField("source", e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm bg-white">
                <option value="">Select source...</option>
                {sources.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Needed</Label>
              <select id="serviceType" value={formData.serviceType} onChange={(e) => updateField("serviceType", e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm bg-white">
                <option value="">Select service...</option>
                {serviceTypes.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceDate">Service Date</Label>
              <Input id="serviceDate" type="date" value={formData.serviceDate} onChange={(e) => updateField("serviceDate", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
              <Input id="estimatedValue" type="number" min="0" step="100" value={formData.estimatedValue || ""} onChange={(e) => updateField("estimatedValue", parseFloat(e.target.value) || 0)} placeholder="0.00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={formData.address} onChange={(e) => updateField("address", e.target.value)} placeholder="123 Main St, City, State 12345" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={formData.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Any additional notes about this lead..." rows={3} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
