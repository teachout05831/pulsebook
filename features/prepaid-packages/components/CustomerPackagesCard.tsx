"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ticket, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { useCustomerPackages } from "../hooks/useCustomerPackages";
import { PurchasePackageModal } from "./PurchasePackageModal";
import { PACKAGE_STATUS_COLORS } from "../types";
import type { CustomerPackageStatus } from "../types";

interface Props {
  customerId: string;
  customerName: string;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export function CustomerPackagesCard({ customerId, customerName }: Props) {
  const { packages, activePackage, isLoading, isPurchasing, purchasePackage } = useCustomerPackages({ customerId });
  const [showPurchase, setShowPurchase] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const pastPackages = packages.filter((p) => p.status !== "active");

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Ticket className="h-4 w-4" />Prepaid Packages
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowPurchase(true)}>Buy Package</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-2">Loading...</p>
          ) : activePackage ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{activePackage.packageName}</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {activePackage.visitsUsed} of {activePackage.visitsTotal} visits used &middot; {fmt(activePackage.amountPaid)}
              </div>
              <Progress value={(activePackage.visitsUsed / activePackage.visitsTotal) * 100} className="h-2" />
              {activePackage.autoRenew && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <RefreshCw className="h-3 w-3" />Auto-renew enabled
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
              <Ticket className="h-4 w-4" />
              <span>No active package</span>
            </div>
          )}

          {pastPackages.length > 0 && (
            <div className="mt-3 border-t pt-2">
              <button type="button" onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                {showHistory ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {pastPackages.length} past package{pastPackages.length > 1 ? "s" : ""}
              </button>
              {showHistory && (
                <div className="mt-2 space-y-2">
                  {pastPackages.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{p.packageName} ({p.visitsUsed}/{p.visitsTotal})</span>
                      <Badge variant="outline" className={PACKAGE_STATUS_COLORS[p.status as CustomerPackageStatus]}>{p.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <PurchasePackageModal
        open={showPurchase}
        onClose={() => setShowPurchase(false)}
        customerId={customerId}
        customerName={customerName}
        onPurchase={purchasePackage}
        isPurchasing={isPurchasing}
      />
    </>
  );
}
