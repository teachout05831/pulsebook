"use client";

import { useState, useMemo } from "react";
import { DollarSign, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RevenueChart = dynamic(() => import("./ReportCharts").then((m) => ({ default: m.RevenueChart })), {
  ssr: false,
  loading: () => <Card><CardContent className="h-[340px] flex items-center justify-center"><Skeleton className="h-[300px] w-full" /></CardContent></Card>,
});
const JobsStatusChart = dynamic(() => import("./ReportCharts").then((m) => ({ default: m.JobsStatusChart })), {
  ssr: false,
  loading: () => <Card><CardContent className="h-[340px] flex items-center justify-center"><Skeleton className="h-[300px] w-full" /></CardContent></Card>,
});
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Job, Invoice, Customer } from "@/types";

type DateRange = "this_week" | "this_month" | "last_month" | "this_quarter" | "this_year";

interface DateRangeOption {
  value: DateRange;
  label: string;
}

const dateRangeOptions: DateRangeOption[] = [
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_quarter", label: "This Quarter" },
  { value: "this_year", label: "This Year" },
];

function getDateRange(range: DateRange): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (range) {
    case "this_week": {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(diff + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "this_month": {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "last_month": {
      start.setMonth(start.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "this_quarter": {
      const quarter = Math.floor(now.getMonth() / 3);
      start.setMonth(quarter * 3, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth((quarter + 1) * 3, 0);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case "this_year": {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    }
  }

  return { start, end };
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface ReportsClientProps {
  jobs: Job[];
  invoices: Invoice[];
  customers: Customer[];
}

export function ReportsClient({ jobs, invoices, customers }: ReportsClientProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>("this_month");

  // Calculate metrics based on date range
  const metrics = useMemo(() => {
    const { start, end } = getDateRange(dateRange);

    const filteredJobs = jobs.filter((job) => {
      const jobDate = new Date(job.scheduledDate);
      return jobDate >= start && jobDate <= end;
    });

    const filteredInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issueDate);
      return invoiceDate >= start && invoiceDate <= end;
    });

    const revenue = filteredInvoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0);

    const jobsCompleted = filteredJobs.filter(
      (job) => job.status === "completed"
    ).length;

    const outstandingInvoices = invoices.filter(
      (inv) => inv.status === "sent" || inv.status === "partial" || inv.status === "overdue"
    );
    const outstandingAmount = outstandingInvoices.reduce(
      (sum, inv) => sum + (inv.total - inv.amountPaid),
      0
    );

    const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;

    return {
      revenue,
      jobsCompleted,
      outstandingAmount,
      outstandingCount: outstandingInvoices.length,
      overdueCount,
    };
  }, [jobs, invoices, dateRange]);

  // Generate revenue chart data
  const revenueChartData = useMemo(() => {
    const { start, end } = getDateRange(dateRange);

    const paidInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issueDate);
      return invoice.status === "paid" && invoiceDate >= start && invoiceDate <= end;
    });

    const groupedData: Record<string, number> = {};
    const isYearlyRange = dateRange === "this_year";
    const isQuarterlyRange = dateRange === "this_quarter";

    paidInvoices.forEach((invoice) => {
      const date = new Date(invoice.issueDate);
      let key: string;

      if (isYearlyRange) {
        key = date.toLocaleDateString("en-US", { month: "short" });
      } else if (isQuarterlyRange) {
        const weekStart = new Date(date);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      groupedData[key] = (groupedData[key] || 0) + invoice.total;
    });

    const chartData = Object.entries(groupedData).map(([name, revenue]) => ({
      name,
      revenue,
    }));

    if (chartData.length === 0) {
      const current = new Date(start);
      const periods: { name: string; revenue: number }[] = [];

      while (current <= end && periods.length < 12) {
        let label: string;
        if (isYearlyRange) {
          label = current.toLocaleDateString("en-US", { month: "short" });
          current.setMonth(current.getMonth() + 1);
        } else if (isQuarterlyRange) {
          label = current.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          current.setDate(current.getDate() + 7);
        } else {
          label = current.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          current.setDate(current.getDate() + 1);
        }
        periods.push({ name: label, revenue: 0 });
      }
      return periods;
    }

    return chartData;
  }, [invoices, dateRange]);

  // Generate jobs by status chart data
  const jobsStatusChartData = useMemo(() => {
    const { start, end } = getDateRange(dateRange);
    const statusCounts: Record<string, number> = {
      scheduled: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };

    // Filter jobs by scheduled date within selected period
    jobs.forEach((job) => {
      const jobDate = new Date(job.scheduledDate);
      if (jobDate >= start && jobDate <= end && statusCounts[job.status] !== undefined) {
        statusCounts[job.status]++;
      }
    });

    return Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        value: count,
        status,
      }));
  }, [jobs, dateRange]);

  const handlePieClick = (data: { status: string }) => {
    router.push(`/jobs?status=${data.status}`);
  };

  // Calculate top customers by revenue for selected period
  const topCustomersData = useMemo(() => {
    const { start, end } = getDateRange(dateRange);
    const customerStats: Record<string, {
      id: string;
      name: string;
      totalJobs: number;
      totalRevenue: number;
    }> = {};

    customers.forEach((customer) => {
      customerStats[customer.id] = {
        id: customer.id,
        name: customer.name,
        totalJobs: 0,
        totalRevenue: 0,
      };
    });

    // Count jobs scheduled in selected period
    jobs.forEach((job) => {
      const jobDate = new Date(job.scheduledDate);
      if (jobDate >= start && jobDate <= end && customerStats[job.customerId]) {
        customerStats[job.customerId].totalJobs++;
      }
    });

    // Sum revenue from paid invoices in selected period
    invoices
      .filter((inv) => {
        const invoiceDate = new Date(inv.issueDate);
        return inv.status === "paid" && invoiceDate >= start && invoiceDate <= end;
      })
      .forEach((invoice) => {
        if (customerStats[invoice.customerId]) {
          customerStats[invoice.customerId].totalRevenue += invoice.total;
        }
      });

    return Object.values(customerStats)
      .filter((c) => c.totalRevenue > 0 || c.totalJobs > 0) // Only show customers with activity in period
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);
  }, [customers, jobs, invoices, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDateRange = (range: DateRange) => {
    const { start, end } = getDateRange(range);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

    if (range === "this_year") {
      return `${start.getFullYear()}`;
    }

    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}, ${end.getFullYear()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Overview of your business performance.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range Display */}
      <p className="text-sm text-muted-foreground">
        Showing data for: <span className="font-medium">{formatDateRange(dateRange)}</span>
      </p>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
            <p className="text-xs text-muted-foreground">From paid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.jobsCompleted}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.outstandingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.outstandingCount} unpaid invoice{metrics.outstandingCount !== 1 ? "s" : ""} (all time)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              Invoice{metrics.overdueCount !== 1 ? "s" : ""} past due (all time)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart
          data={revenueChartData}
          isLoading={false}
          formatCurrency={formatCurrency}
        />
        <JobsStatusChart
          data={jobsStatusChartData}
          isLoading={false}
          onPieClick={handlePieClick}
        />
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Top 10 customers by revenue in selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {topCustomersData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No customer data available
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Total Jobs</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomersData.map((customer, index) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-center">{customer.totalJobs}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(customer.totalRevenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
