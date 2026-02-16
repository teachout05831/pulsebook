'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ServiceType, ServiceTypeFormData } from '../types';

const emptyForm: ServiceTypeFormData = { name: '', description: '', defaultPrice: '' };

export function useServiceTypes(initialTypes: ServiceType[]) {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(initialTypes);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<ServiceType | null>(null);
  const [deletingType, setDeletingType] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState<ServiceTypeFormData>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const refreshTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/service-types');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setServiceTypes(json.data || []);
    } catch {
      toast.error('Failed to load service types');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAdd = useCallback(() => {
    setEditingType(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  }, []);

  const openEdit = useCallback((type: ServiceType) => {
    setEditingType(type);
    setFormData({ name: type.name, description: type.description, defaultPrice: type.defaultPrice.toString() });
    setIsDialogOpen(true);
  }, []);

  const openDelete = useCallback((type: ServiceType) => {
    setDeletingType(type);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!formData.name || formData.name.length < 2) return toast.error('Name must be at least 2 characters');
    if (!formData.defaultPrice || parseFloat(formData.defaultPrice) < 0) return toast.error('Please enter a valid price');

    setIsSaving(true);
    try {
      const url = editingType ? `/api/service-types/${editingType.id}` : '/api/service-types';
      const res = await fetch(url, {
        method: editingType ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      toast.success(editingType ? 'Service type updated' : 'Service type created');
      setIsDialogOpen(false);
      await refreshTypes();
    } catch {
      toast.error('Failed to save service type');
    } finally {
      setIsSaving(false);
    }
  }, [formData, editingType, refreshTypes]);

  const handleDelete = useCallback(async () => {
    if (!deletingType) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/service-types/${deletingType.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();

      toast.success('Service type deleted');
      setIsDeleteDialogOpen(false);
      setDeletingType(null);
      await refreshTypes();
    } catch {
      toast.error('Failed to delete service type');
    } finally {
      setIsSaving(false);
    }
  }, [deletingType, refreshTypes]);

  return {
    serviceTypes, isLoading, isDialogOpen, isDeleteDialogOpen, editingType, formData, isSaving,
    setFormData, setIsDialogOpen, setIsDeleteDialogOpen,
    openAdd, openEdit, openDelete, handleSave, handleDelete, refreshTypes,
  };
}
