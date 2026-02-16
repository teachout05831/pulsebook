"use client";

/**
 * MOCKUP: Sales Goals Trends - Analytics View
 *
 * Historical trends and analytics:
 * - Month-over-month comparison
 * - Lead volume trends (qualified vs unqualified)
 * - Revenue trend charts
 * - Goal attainment history
 *
 * This is a UI mockup for review before implementation.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronDown,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock trend data - 6 months
const MONTHLY_DATA = [
  { month: "Sep", revenue: 72000, goal: 80000, leads: 120, qualified: 85, booked: 32 },
  { month: "Oct", revenue: 85000, goal: 80000, leads: 135, qualified: 98, booked: 38 },
  { month: "Nov", revenue: 78000, goal: 85000, leads: 128, qualified: 92, booked: 35 },
  { month: "Dec", revenue: 92000, goal: 85000, leads: 142, qualified: 105, booked: 42 },
  { month: "Jan", revenue: 88000, goal: 90000, leads: 138, qualified: 100, booked: 40 },
  { month: "Feb", revenue: 28500, goal: 90000, leads: 48, qualified: 35, booked: 14, isCurrent: true },
];

// Year-over-year comparison
const YOY_COMPARISON = {
  thisYear: { revenue: 443500, leads: 711, bookingRate: 36 },
  lastYear: { revenue: 398000, leads: 652, bookingRate: 32 },
};

type ChartView = "revenue" | "leads" | "rates";

function SimpleBarChart({ data, maxValue, barColor }: { data: number[]; maxValue: number; barColor: string }) {
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((value, i) => {
        const height = (value / maxValue) * 100;
        return (
          <div key={`bar-${i}`} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={cn("w-full rounded-t transition-all", barColor)}
              style={{ height: `${height}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;

  return (
    <div className={cn("flex items-center gap-1 text-sm", isPositive ? "text-green-600" : "text-red-600")}>
      {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
      {Math.abs(change).toFixed(1)}%
    </div>
  );
}

export function SalesGoalsTrendsMockup() {
  const [chartView, setChartView] = useState<ChartView>("revenue");
  const [timeRange, setTimeRange] = useState("6months");

  const maxRevenue = Math.max(...MONTHLY_DATA.map((m) => m.revenue));
  const maxLeads = Math.max(...MONTHLY_DATA.map((m) => m.leads));

  // Calculate averages
  const avgRevenue = Math.round(
    MONTHLY_DATA.filter((m) => !m.isCurrent).reduce((sum, m) => sum + m.revenue, 0) / 5
  );
  const avgLeads = Math.round(
    MONTHLY_DATA.filter((m) => !m.isCurrent).reduce((sum, m) => sum + m.leads, 0) / 5
  );
  const goalAttainment = MONTHLY_DATA.filter((m) => !m.isCurrent && m.revenue >= m.goal).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Sales Trends & Analytics
          </h2>
          <p className="text-muted-foreground">
            Track performance trends and patterns over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last 6 Months
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Avg Monthly Revenue</div>
            <div className="text-2xl font-bold">${avgRevenue.toLocaleString()}</div>
            <TrendIndicator
              current={MONTHLY_DATA[4].revenue}
              previous={MONTHLY_DATA[3].revenue}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Avg Monthly Leads</div>
            <div className="text-2xl font-bold">{avgLeads}</div>
            <TrendIndicator
              current={MONTHLY_DATA[4].leads}
              previous={MONTHLY_DATA[3].leads}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Goals Hit</div>
            <div className="text-2xl font-bold">{goalAttainment}/5</div>
            <div className="text-sm text-green-600">
              {((goalAttainment / 5) * 100).toFixed(0)}% attainment rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">YoY Growth</div>
            <div className="text-2xl font-bold text-green-600">
              +{(
                ((YOY_COMPARISON.thisYear.revenue - YOY_COMPARISON.lastYear.revenue) /
                  YOY_COMPARISON.lastYear.revenue) *
                100
              ).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">vs same period last year</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Area */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Performance Trends</CardTitle>
          <div className="flex gap-2">
            {(["revenue", "leads", "rates"] as ChartView[]).map((view) => (
              <Button
                key={view}
                variant={chartView === view ? "default" : "outline"}
                size="sm"
                onClick={() => setChartView(view)}
              >
                {view === "revenue" ? "Revenue" : view === "leads" ? "Leads" : "Rates"}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart visualization (simplified bar chart) */}
          <div className="space-y-4">
            {chartView === "revenue" && (
              <>
                <div className="flex items-end gap-3 h-48">
                  {MONTHLY_DATA.map((month, i) => {
                    const revenueHeight = (month.revenue / maxRevenue) * 100;
                    const goalHeight = (month.goal / maxRevenue) * 100;
                    const hitGoal = month.revenue >= month.goal;

                    return (
                      <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-xs font-medium mb-1">
                          ${(month.revenue / 1000).toFixed(0)}k
                        </div>
                        <div className="relative w-full h-40">
                          {/* Goal line */}
                          <div
                            className="absolute w-full border-t-2 border-dashed border-slate-400 z-10"
                            style={{ bottom: `${goalHeight}%` }}
                          />
                          {/* Revenue bar */}
                          <div
                            className={cn(
                              "absolute bottom-0 w-full rounded-t transition-all",
                              month.isCurrent
                                ? "bg-blue-300"
                                : hitGoal
                                ? "bg-green-500"
                                : "bg-amber-500"
                            )}
                            style={{ height: `${revenueHeight}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{month.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-green-500" />
                    <span>Hit Goal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-amber-500" />
                    <span>Missed Goal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-300" />
                    <span>Current Month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-6 border-t-2 border-dashed border-slate-400" />
                    <span>Goal Line</span>
                  </div>
                </div>
              </>
            )}

            {chartView === "leads" && (
              <>
                <div className="flex items-end gap-3 h-48">
                  {MONTHLY_DATA.map((month) => {
                    const totalHeight = (month.leads / maxLeads) * 100;
                    const qualifiedHeight = (month.qualified / maxLeads) * 100;

                    return (
                      <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-xs font-medium mb-1">{month.leads}</div>
                        <div className="relative w-full h-40">
                          {/* Total leads bar (background) */}
                          <div
                            className="absolute bottom-0 w-full rounded-t bg-slate-200"
                            style={{ height: `${totalHeight}%` }}
                          />
                          {/* Qualified leads bar (foreground) */}
                          <div
                            className="absolute bottom-0 w-full rounded-t bg-blue-500"
                            style={{ height: `${qualifiedHeight}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{month.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-blue-500" />
                    <span>Qualified Leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-slate-200" />
                    <span>Unqualified</span>
                  </div>
                </div>
              </>
            )}

            {chartView === "rates" && (
              <>
                <div className="flex items-end gap-3 h-48">
                  {MONTHLY_DATA.map((month) => {
                    const bookingRate = Math.round((month.booked / month.qualified) * 100);

                    return (
                      <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-xs font-medium mb-1">{bookingRate}%</div>
                        <div className="relative w-full h-40">
                          <div
                            className={cn(
                              "absolute bottom-0 w-full rounded-t transition-all",
                              bookingRate >= 35
                                ? "bg-green-500"
                                : bookingRate >= 30
                                ? "bg-amber-500"
                                : "bg-red-500"
                            )}
                            style={{ height: `${bookingRate}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{month.month}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-green-500" />
                    <span>Above Target (35%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-amber-500" />
                    <span>Near Target (30-35%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-red-500" />
                    <span>Below Target (&lt;30%)</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Year over Year */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Year over Year Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Total Revenue (YTD)</div>
                  <div className="text-xl font-bold">
                    ${YOY_COMPARISON.thisYear.revenue.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Last Year</div>
                  <div className="text-lg">
                    ${YOY_COMPARISON.lastYear.revenue.toLocaleString()}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  +11.4%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Total Leads (YTD)</div>
                  <div className="text-xl font-bold">{YOY_COMPARISON.thisYear.leads}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Last Year</div>
                  <div className="text-lg">{YOY_COMPARISON.lastYear.leads}</div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  +9.0%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Avg Booking Rate</div>
                  <div className="text-xl font-bold">
                    {YOY_COMPARISON.thisYear.bookingRate}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Last Year</div>
                  <div className="text-lg">{YOY_COMPARISON.lastYear.bookingRate}%</div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  +4pts
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Month</th>
                  <th className="text-right py-2 font-medium">Revenue</th>
                  <th className="text-right py-2 font-medium">Goal</th>
                  <th className="text-right py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_DATA.map((month) => {
                  const hitGoal = month.revenue >= month.goal;
                  const percent = Math.round((month.revenue / month.goal) * 100);

                  return (
                    <tr key={month.month} className="border-b last:border-0">
                      <td className="py-2">
                        {month.month}
                        {month.isCurrent && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Current
                          </Badge>
                        )}
                      </td>
                      <td className="text-right py-2 font-medium">
                        ${month.revenue.toLocaleString()}
                      </td>
                      <td className="text-right py-2 text-muted-foreground">
                        ${month.goal.toLocaleString()}
                      </td>
                      <td className="text-right py-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            month.isCurrent
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : hitGoal
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                        >
                          {percent}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                <TrendingUp className="h-4 w-4" />
                Strong Performance
              </div>
              <p className="text-sm text-green-800">
                December was your best month with $92,000 in revenue - 8% above goal.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                <TrendingDown className="h-4 w-4" />
                Watch Area
              </div>
              <p className="text-sm text-amber-800">
                November saw a dip in lead quality - qualified rate dropped to 72%.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                <BarChart3 className="h-4 w-4" />
                Trending Up
              </div>
              <p className="text-sm text-blue-800">
                Booking rate has improved 4 percentage points year over year.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
