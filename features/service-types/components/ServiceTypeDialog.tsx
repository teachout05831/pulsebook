'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ServiceType, ServiceTypeFormData } from '../types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingType: ServiceType | null;
  formData: ServiceTypeFormData;
  setFormData: React.Dispatch<React.SetStateAction<ServiceTypeFormData>>;
  isSaving: boolean;
  onSave: () => void;
}

export function ServiceTypeDialog({ open, onOpenChange, editingType, formData, setFormData, isSaving, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingType ? 'Edit Service Type' : 'Add Service Type'}</DialogTitle>
          <DialogDescription>
            {editingType ? 'Update service type details' : 'Add a new type of service you offer'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Standard Service"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultPrice">Default Price *</Label>
            <Input
              id="defaultPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.defaultPrice}
              onChange={(e) => setFormData((prev) => ({ ...prev, defaultPrice: e.target.value }))}
              placeholder="0.00"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : editingType ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
