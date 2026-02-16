"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerAccount } from "../hooks/useCustomerAccount";
import type { UpdateAccountInput } from "../types";

export function AccountSettings() {
  const { account, isLoading, error, isSaving, updateAccount } =
    useCustomerAccount();
  const [form, setForm] = useState<UpdateAccountInput>({});
  const [initialized, setInitialized] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (isLoading) {
    return <div className="animate-pulse h-60 rounded bg-muted" />;
  }

  if (error || !account) {
    return <p className="text-sm text-red-500">{error || "Failed to load"}</p>;
  }

  if (!initialized) {
    setForm({
      name: account.name,
      phone: account.phone || "",
      address: account.address || "",
      city: account.city || "",
      state: account.state || "",
      zipCode: account.zipCode || "",
    });
    setInitialized(true);
  }

  const handleChange = (field: keyof UpdateAccountInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);
    const result = await updateAccount(form);
    if (result.error) {
      setSaveError(result.error);
    } else {
      setSaveSuccess(true);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Account Settings</h1>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={account.email} disabled />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={form.state || ""}
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={form.zipCode || ""}
                onChange={(e) => handleChange("zipCode", e.target.value)}
              />
            </div>
          </div>
          {saveError && <p className="text-sm text-red-500">{saveError}</p>}
          {saveSuccess && (
            <p className="text-sm text-green-600">Saved successfully</p>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
