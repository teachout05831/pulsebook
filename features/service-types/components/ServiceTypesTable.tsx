'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ServiceType } from '../types';

interface Props {
  serviceTypes: ServiceType[];
  onEdit: (type: ServiceType) => void;
  onDelete: (type: ServiceType) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

export function ServiceTypesTable({ serviceTypes, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Default Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {serviceTypes.map((serviceType) => (
          <TableRow key={serviceType.id}>
            <TableCell className="font-medium">{serviceType.name}</TableCell>
            <TableCell className="text-muted-foreground max-w-[300px] truncate">
              {serviceType.description || '-'}
            </TableCell>
            <TableCell className="text-right">{formatPrice(serviceType.defaultPrice)}</TableCell>
            <TableCell>
              <Badge variant={serviceType.isActive ? 'default' : 'secondary'}>
                {serviceType.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(serviceType)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(serviceType)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
