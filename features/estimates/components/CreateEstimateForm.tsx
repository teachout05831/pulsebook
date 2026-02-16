"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEstimate } from "../hooks/useCreateEstimate";

const PRICING_MODELS = [
  { value: "flat", label: "Flat Rate", desc: "Single price for the whole job" },
  { value: "hourly", label: "Hourly", desc: "Based on team size, hours, and rate" },
  { value: "per_service", label: "Per Service", desc: "Individual services priced separately" },
];

export function CreateEstimateForm() {
  const {
    customers, isLoadingCustomers, customerId, setCustomerId,
    pricingModel, setPricingModel, isCreating, handleCreate, handleCancel,
  } = useCreateEstimate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Estimate</h1>
          <p className="text-muted-foreground">Select a customer and pricing model to get started</p>
        </div>
      </div>
      <div className="max-w-lg mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle>Estimate Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Customer *</Label>
              <Select value={customerId} onValueChange={setCustomerId} disabled={isLoadingCustomers}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCustomers ? "Loading..." : "Select a customer"} />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pricing Model</Label>
              <div className="grid gap-2">
                {PRICING_MODELS.map((model) => (
                  <button key={model.value} type="button" onClick={() => setPricingModel(model.value)}
                    className={`text-left rounded-lg border-2 p-3 transition-colors ${pricingModel === model.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="font-medium text-sm">{model.label}</div>
                    <div className="text-xs text-muted-foreground">{model.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>Cancel</Button>
          <Button className="flex-1" onClick={handleCreate} disabled={!customerId || isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Estimate
          </Button>
        </div>
      </div>
    </div>
  );
}
