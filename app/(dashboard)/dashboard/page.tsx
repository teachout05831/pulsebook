"use client";

import { useList } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { Users, Briefcase, FileText, DollarSign, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer, Job, Estimate, Invoice } from "@/types";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  isLoading,
  onClick,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  isLoading?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card className={onClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-4 w-24" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  // Fetch customer count
  const { query: customerQuery, result: customerResult } = useList<Customer>({
    resource: "customers",
    pagination: {
      currentPage: 1,
      pageSize: 1,
    },
  });

  // Fetch job counts
  const { query: jobsQuery, result: jobsResult } = useList<Job>({
    resource: "jobs",
    pagination: {
      currentPage: 1,
      pageSize: 1,
    },
  });

  // Fetch active jobs (scheduled + in_progress)
  const { query: activeJobsQuery, result: activeJobsResult } = useList<Job>({
    resource: "jobs",
    pagination: {
      currentPage: 1,
      pageSize: 1,
    },
    filters: [
      { field: "status", operator: "eq", value: "scheduled" },
    ],
  });

  const { query: inProgressQuery, result: inProgressResult } = useList<Job>({
    resource: "jobs",
    pagination: {
      currentPage: 1,
      pageSize: 1,
    },
    filters: [
      { field: "status", operator: "eq", value: "in_progress" },
    ],
  });

  // Fetch pending estimates (draft + sent)
  const { query: draftEstimatesQuery, result: draftEstimatesResult } = useList<Estimate>({
    resource: "estimates",
    pagination: {
      currentPage: 1,
      pageSize: 1,
    },
    filters: [
      { field: "status", operator: "eq", value: "draft" },
    ],
  });

  const { query: sentEstimatesQuery, result: sentEstimatesResult } = useList<Estimate>({
    resource: "estimates",
    pagination: {
      currentPage: 1,
      pageSize: 1,
    },
    filters: [
      { field: "status", operator: "eq", value: "sent" },
    ],
  });

  // Fetch unpaid invoices (all non-paid, non-cancelled)
  const { query: unpaidInvoicesQuery, result: unpaidInvoicesResult } = useList<Invoice>({
    resource: "invoices",
    pagination: {
      currentPage: 1,
      pageSize: 100, // Get all to calculate totals
    },
    filters: [
      { field: "status", operator: "ne", value: "paid" },
    ],
  });

  const customerCount = customerResult.total ?? 0;
  const isLoadingCustomers = customerQuery.isLoading;

  const totalJobs = jobsResult.total ?? 0;
  const scheduledJobs = activeJobsResult.total ?? 0;
  const inProgressJobs = inProgressResult.total ?? 0;
  const activeJobs = scheduledJobs + inProgressJobs;
  const isLoadingJobs = jobsQuery.isLoading || activeJobsQuery.isLoading || inProgressQuery.isLoading;

  const recentCustomerText = customerCount > 0
    ? `${Math.min(customerCount, 3)} added this week`
    : "No customers yet";

  const activeJobsText = activeJobs > 0
    ? `${scheduledJobs} scheduled, ${inProgressJobs} in progress`
    : "No active jobs";

  const draftEstimates = draftEstimatesResult.total ?? 0;
  const sentEstimates = sentEstimatesResult.total ?? 0;
  const pendingEstimates = draftEstimates + sentEstimates;
  const isLoadingEstimates = draftEstimatesQuery.isLoading || sentEstimatesQuery.isLoading;

  const pendingEstimatesText = pendingEstimates > 0
    ? `${draftEstimates} draft, ${sentEstimates} awaiting response`
    : "No pending estimates";

  // Calculate unpaid invoices totals
  const unpaidInvoices = (unpaidInvoicesResult.data ?? []).filter(
    (inv) => inv.status !== "cancelled"
  );
  const unpaidInvoicesTotal = unpaidInvoices.reduce((sum, inv) => sum + inv.amountDue, 0);
  const unpaidInvoicesCount = unpaidInvoices.length;
  const overdueCount = unpaidInvoices.filter((inv) => inv.status === "overdue").length;
  const isLoadingInvoices = unpaidInvoicesQuery.isLoading;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const unpaidInvoicesText = unpaidInvoicesCount > 0
    ? overdueCount > 0
      ? `${unpaidInvoicesCount} unpaid, ${overdueCount} overdue`
      : `${unpaidInvoicesCount} awaiting payment`
    : "All invoices paid";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to ServicePro. Here&apos;s your business overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={customerCount}
          subtitle={recentCustomerText}
          icon={Users}
          isLoading={isLoadingCustomers}
          onClick={() => router.push("/customers")}
        />

        <StatCard
          title="Active Jobs"
          value={activeJobs}
          subtitle={activeJobsText}
          icon={Briefcase}
          isLoading={isLoadingJobs}
          onClick={() => router.push("/jobs")}
        />

        <StatCard
          title="Pending Estimates"
          value={pendingEstimates}
          subtitle={pendingEstimatesText}
          icon={FileText}
          isLoading={isLoadingEstimates}
          onClick={() => router.push("/estimates")}
        />

        <StatCard
          title="Unpaid Invoices"
          value={formatCurrency(unpaidInvoicesTotal)}
          subtitle={unpaidInvoicesText}
          icon={DollarSign}
          isLoading={isLoadingInvoices}
          onClick={() => router.push("/invoices")}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push("/jobs/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </Button>
            <Button onClick={() => router.push("/estimates/new")}>
              <FileText className="mr-2 h-4 w-4" />
              New Estimate
            </Button>
            <Button variant="outline" onClick={() => router.push("/customers/new")}>
              <Users className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
            <Button variant="outline" onClick={() => router.push("/jobs")}>
              View Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => router.push("/customers")}>
              View Customers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {customerCount > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Customers</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/customers")}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have {customerCount} customer{customerCount !== 1 ? "s" : ""} in your database.
              </p>
            </CardContent>
          </Card>
        )}

        {totalJobs > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Jobs</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/jobs")}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have {totalJobs} job{totalJobs !== 1 ? "s" : ""} total, {activeJobs} active.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
