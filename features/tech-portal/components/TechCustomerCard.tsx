"use client";

import { MapPin, Phone, Mail, FileText, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechCustomerInfo } from "../types";

interface Props {
  customer: TechCustomerInfo;
  address: string | null;
}

export function TechCustomerCard({ customer, address }: Props) {
  const mapsUrl = address
    ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-medium">{customer.name}</p>
        {address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{address}</p>
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                  <Navigation className="h-3 w-3" />
                  Navigate
                </a>
              )}
            </div>
          </div>
        )}
        {customer.phone && (
          <a href={`tel:${customer.phone}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <Phone className="h-4 w-4" />{customer.phone}
          </a>
        )}
        {customer.email && (
          <a href={`mailto:${customer.email}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <Mail className="h-4 w-4" />{customer.email}
          </a>
        )}
        {customer.notes && (
          <div className="flex items-start gap-2 pt-1">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{customer.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
