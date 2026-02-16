'use client';

import { Plus, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useServiceTypes } from '../hooks/useServiceTypes';
import { ServiceTypesTable } from './ServiceTypesTable';
import { ServiceTypeDialog } from './ServiceTypeDialog';
import { ServiceTypeDeleteDialog } from './ServiceTypeDeleteDialog';
import type { ServiceType } from '../types';

interface Props {
  initialServiceTypes: ServiceType[];
}

export function ServiceTypesManager({ initialServiceTypes }: Props) {
  const {
    serviceTypes,
    isLoading,
    isDialogOpen,
    isDeleteDialogOpen,
    editingType,
    formData,
    isSaving,
    setFormData,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    openAdd,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
  } = useServiceTypes(initialServiceTypes);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {serviceTypes.length === 0 ? (
        <div className="text-center py-8">
          <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No service types configured yet.</p>
          <Button variant="outline" className="mt-4" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Service Type
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Configure the types of services you offer. These can be selected when creating estimates and invoices.
            </p>
            <Button onClick={openAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service Type
            </Button>
          </div>
          <ServiceTypesTable serviceTypes={serviceTypes} onEdit={openEdit} onDelete={openDelete} />
        </>
      )}

      <ServiceTypeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingType={editingType}
        formData={formData}
        setFormData={setFormData}
        isSaving={isSaving}
        onSave={handleSave}
      />

      <ServiceTypeDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        serviceType={editingType}
        isDeleting={isSaving}
        onConfirm={handleDelete}
      />
    </div>
  );
}
