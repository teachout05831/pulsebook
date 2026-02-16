"use client";

import { CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PaymentMethodsSection() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Payment Methods on File</h3>
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-sm text-muted-foreground">Expires 08/2027</div>
              </div>
            </div>
            <Badge variant="outline">Default</Badge>
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" size="sm" className="mt-3">+ Add Payment Method</Button>
    </div>
  );
}
