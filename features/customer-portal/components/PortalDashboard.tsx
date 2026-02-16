"use client";

import { FileText, Briefcase, Receipt, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerDashboard } from "../hooks/useCustomerDashboard";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

const statCards = [
  {
    key: "pendingEstimates" as const,
    label: "Pending Estimates",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "activeJobs" as const,
    label: "Active Jobs",
    icon: Briefcase,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "unpaidInvoices" as const,
    label: "Unpaid Invoices",
    icon: Receipt,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    key: "lifetimeTotal" as const,
    label: "Lifetime Total",
    icon: DollarSign,
    color: "text-purple-600",
    bg: "bg-purple-50",
    isCurrency: true,
  },
];

export function PortalDashboard() {
  const { stats, isLoading } = useCustomerDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          <Card key={c.key}>
            <CardContent className="pt-6">
              <div className="h-8 w-20 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s an overview of your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color, bg, isCurrency }) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <div className={`rounded-md p-2 ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats
                  ? isCurrency
                    ? formatCurrency(stats[key])
                    : stats[key]
                  : "—"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
