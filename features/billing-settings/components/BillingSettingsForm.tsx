'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { BillingSettings } from '../types';
import { paymentTermsOptions } from '../types';

interface Props {
  initialSettings: BillingSettings;
}

export function BillingSettingsForm({ initialSettings }: Props) {
  const [formData, setFormData] = useState<BillingSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof BillingSettings, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/billing-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      toast.success('Billing settings saved successfully');
    } catch {
      toast.error('Failed to save billing settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tax & Payment Terms */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={formData.defaultTaxRate}
            onChange={(e) => handleChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Default Payment Terms</Label>
          <Select value={formData.defaultPaymentTerms} onValueChange={(value) => handleChange('defaultPaymentTerms', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentTermsOptions.map((term) => (
                <SelectItem key={term} value={term}>
                  {term}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Number Prefixes */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
          <Input
            id="invoicePrefix"
            value={formData.invoicePrefix}
            onChange={(e) => handleChange('invoicePrefix', e.target.value)}
            placeholder="INV-"
          />
          <p className="text-xs text-muted-foreground">Example: {formData.invoicePrefix}001</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatePrefix">Estimate Number Prefix</Label>
          <Input
            id="estimatePrefix"
            value={formData.estimatePrefix}
            onChange={(e) => handleChange('estimatePrefix', e.target.value)}
            placeholder="EST-"
          />
          <p className="text-xs text-muted-foreground">Example: {formData.estimatePrefix}001</p>
        </div>
      </div>

      {/* Invoice & Estimate Text */}
      <div className="space-y-4">
        <h4 className="font-medium">Default Invoice Text</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invoiceNotes">Notes</Label>
            <Textarea id="invoiceNotes" value={formData.defaultInvoiceNotes}
              onChange={(e) => handleChange('defaultInvoiceNotes', e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceTerms">Terms</Label>
            <Textarea id="invoiceTerms" value={formData.defaultInvoiceTerms}
              onChange={(e) => handleChange('defaultInvoiceTerms', e.target.value)} rows={3} />
          </div>
        </div>

        <h4 className="font-medium">Default Estimate Text</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="estimateNotes">Notes</Label>
            <Textarea id="estimateNotes" value={formData.defaultEstimateNotes}
              onChange={(e) => handleChange('defaultEstimateNotes', e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimateTerms">Terms</Label>
            <Textarea id="estimateTerms" value={formData.defaultEstimateTerms}
              onChange={(e) => handleChange('defaultEstimateTerms', e.target.value)} rows={3} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Billing Settings'}
        </Button>
      </div>
    </div>
  );
}
