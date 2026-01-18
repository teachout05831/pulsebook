"use client";

import { useState, useEffect, useMemo } from "react";
import { DollarSign, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Job, Invoice, Customer } from "@/types";

type DateRange = "this_week" | "this_month" | "last_month" | "this_quarter" | "this_year" | "custom";

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
    default: {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    }
  }

  return { start, end };
}

// Status colors for the pie chart
const STATUS_COLORS: Record<string, string> = {
  scheduled: "hsl(217, 91%, 60%)",    // Blue
  in_progress: "hsl(45, 93%, 47%)",   // Yellow/Amber
  completed: "hsl(142, 71%, 45%)",    // Green
  cancelled: "hsl(0, 84%, 60%)",      // Red
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function ReportsPage() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>("this_month");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsRes, invoicesRes, customersRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/invoices"),
          fetch("/api/customers"),
        ]);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData.data || []);
        }

        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json();
          setInvoices(invoicesData.data || []);
        }

        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics based on date range
  const metrics = useMemo(() => {
    const { start, end } = getDateRange(dateRange);

    // Filter jobs by date range
    const filteredJobs = jobs.filter((job) => {
      const jobDate = new Date(job.scheduledDate);
      return jobDate >= start && jobDate <= end;
    });

    // Filter invoices by date range
    const filteredInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issueDate);
      return invoiceDate >= start && invoiceDate <= end;
    });

    // Calculate revenue (paid invoices in range)
    const revenue = filteredInvoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total, 0);

    // Calculate jobs completed in range
    const jobsCompleted = filteredJobs.filter(
      (job) => job.status === "completed"
    ).length;

    // Calculate outstanding invoices (all unpaid/partial)
    const outstandingInvoices = invoices.filter(
      (inv) => inv.status === "sent" || inv.status === "partial" || inv.status === "overdue"
    );
    const outstandingAmount = outstandingInvoices.reduce(
      (sum, inv) => sum + (inv.total - inv.amountPaid),
      0
    );

    // Overdue invoices count
    const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;

    return {
      revenue,
      jobsCompleted,
      outstandingAmount,
      outstandingCount: outstandingInvoices.length,
      overdueCount,
    };
  }, [jobs, invoices, dateRange]);

  // Generate revenue chart data based on date range
  const revenueChartData = useMemo(() => {
    const { start, end } = getDateRange(dateRange);

    // Filter paid invoices by date range
    const paidInvoices = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.issueDate);
      return invoice.status === "paid" && invoiceDate >= start && invoiceDate <= end;
    });

    // Group by time period based on date range
    const groupedData: Record<string, number> = {};

    // Determine grouping granularity based on date range
    const isYearlyRange = dateRange === "this_year";
    const isQuarterlyRange = dateRange === "this_quarter";

    paidInvoices.forEach((invoice) => {
      const date = new Date(invoice.issueDate);
      let key: string;

      if (isYearlyRange) {
        // Group by month for yearly view
        key = date.toLocaleDateString("en-US", { month: "short" });
      } else if (isQuarterlyRange) {
        // Group by week for quarterly view
        const weekStart = new Date(date);
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        // Group by day for weekly/monthly view
        key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      groupedData[key] = (groupedData[key] || 0) + invoice.total;
    });

    // Convert to array and sort by date
    const chartData = Object.entries(groupedData).map(([name, revenue]) => ({
      name,
      revenue,
    }));

    // If no data, generate placeholder periods
    if (chartData.length === 0) {
      const current = new Date(start);
      const periods: { name: string; revenue: number }[] = [];

      while (current <= end) {
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

        // Limit to reasonable number of periods
        if (periods.length >= 12) break;
      }
      return periods;
    }

    return chartData;
  }, [invoices, dateRange]);

  // Generate jobs by status chart data
  const jobsStatusChartData = useMemo(() => {
    // Count jobs by status (all jobs, not filtered by date for overall view)
    const statusCounts: Record<string, number> = {
      scheduled: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };

    jobs.forEach((job) => {
      if (statusCounts[job.status] !== undefined) {
        statusCounts[job.status]++;
      }
    });

    // Convert to array format for Recharts
    return Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        value: count,
        status,
      }));
  }, [jobs]);

  // Handle pie slice click to navigate to filtered jobs list
  const handlePieClick = (data: { status: string }) => {
    router.push(`/jobs?status=${data.status}`);
  };

  // Calculate top customers by revenue
  const topCustomersData = useMemo(() => {
    // Create a map of customer stats
    const customerStats: Record<string, {
      id: string;
      name: string;
      totalJobs: number;
      totalRevenue: number;
    }> = {};

    // Initialize with all customers
    customers.forEach((customer) => {
      customerStats[customer.id] = {
        id: customer.id,
        name: customer.name,
        totalJobs: 0,
        totalRevenue: 0,
      };
    });

    // Count jobs per customer
    jobs.forEach((job) => {
      if (customerStats[job.customerId]) {
        customerStats[job.customerId].totalJobs++;
      }
    });

    // Sum revenue from paid invoices per customer
    invoices
      .filter((inv) => inv.status === "paid")
      .forEach((invoice) => {
        if (customerStats[invoice.customerId]) {
          customerStats[invoice.customerId].totalRevenue += invoice.total;
        }
      });

    // Convert to array, sort by revenue, take top 10
    return Object.values(customerStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);
  }, [customers, jobs, invoices]);

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
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(metrics.revenue)}</div>
                <p className="text-xs text-muted-foreground">
                  From paid invoices
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Jobs Completed Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{metrics.jobsCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  In selected period
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Outstanding Invoices Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(metrics.outstandingAmount)}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.outstandingCount} unpaid invoice{metrics.outstandingCount !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Overdue Invoices Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-destructive">{metrics.overdueCount}</div>
                <p className="text-xs text-muted-foreground">
                  Invoice{metrics.overdueCount !== 1 ? "s" : ""} past due
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart - RPT-002 */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>
              Revenue from paid invoices in selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    className="fill-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    className="fill-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Jobs by Status Chart - RPT-003 */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs by Status</CardTitle>
            <CardDescription>
              Distribution of all jobs by current status
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : jobsStatusChartData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No jobs to display</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobsStatusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(data) => handlePieClick(data)}
                    style={{ cursor: "pointer" }}
                  >
                    {jobsStatusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || "hsl(var(--muted))"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} job${value !== 1 ? "s" : ""}`,
                      name as string,
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => {
                      const item = jobsStatusChartData.find((d) => d.name === value);
                      return `${value} (${item?.value || 0})`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers - RPT-004 */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>
            Top 10 customers ranked by total revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : topCustomersData.length === 0 ? (
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
