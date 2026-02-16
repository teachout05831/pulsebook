"use client";

/**
 * MOCKUP: Sales Goals Dashboard - Main View
 *
 * Based on SmartMoving Sales Goals Dashboard:
 * - Monthly goal tracking with daily distribution
 * - 4 KPIs: Booked Revenue, Booking Rate, Sent Estimate Rate, Closed Rate
 * - Color-coded progress (green = exceeding, red = below target)
 * - Action items section
 * - Sales funnel visualization
 *
 * This is a UI mockup for review before implementation.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronDown,
  DollarSign,
  Target,
  TrendingUp,
  Users,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data - would come from database/API
const MOCK_GOALS = {
  period: "February 2026",
  daysRemaining: 26,
  bookedRevenue: { target: 100000, actual: 28500, daily: 3225.81 },
  bookingRate: { target: 35, actual: 42 },
  sentEstimateRate: { target: 80, actual: 75 },
  closedRate: { target: 25, actual: 22 },
};

const ACTION_ITEMS = [
  { label: "New Leads", count: 12, icon: Users, color: "bg-blue-500" },
  { label: "Follow-ups Due", count: 8, icon: Clock, color: "bg-amber-500" },
  { label: "Stale Opportunities", count: 3, icon: AlertCircle, color: "bg-red-500" },
  { label: "Estimates Accepted", count: 5, icon: CheckCircle2, color: "bg-green-500" },
];

const FUNNEL_STAGES = [
  { label: "Total Leads", count: 145, width: 100, color: "bg-slate-400" },
  { label: "Qualified", count: 98, width: 70, color: "bg-blue-500" },
  { label: "Estimate Sent", count: 72, width: 50, color: "bg-purple-500" },
  { label: "Booked", count: 38, width: 30, color: "bg-green-500" },
];

function KPICard({
  title,
  icon: Icon,
  target,
  actual,
  isPercent = false,
  isCurrency = false,
}: {
  title: string;
  icon: React.ElementType;
  target: number;
  actual: number;
  isPercent?: boolean;
  isCurrency?: boolean;
}) {
  const progress = (actual / target) * 100;
  const isOnTrack = actual >= target * 0.9; // Within 10% of target
  const isExceeding = actual >= target;

  const formatValue = (val: number) => {
    if (isCurrency) return `$${val.toLocaleString()}`;
    if (isPercent) return `${val}%`;
    return val.toString();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Icon className="h-5 w-5 text-slate-600" />
          </div>
          <Badge
            variant="outline"
            className={cn(
              isExceeding
                ? "bg-green-50 text-green-700 border-green-200"
                : isOnTrack
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-red-50 text-red-700 border-red-200"
            )}
          >
            {isExceeding ? "On Track" : isOnTrack ? "Close" : "Behind"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span
              className={cn(
                "text-2xl font-bold",
                isExceeding
                  ? "text-green-600"
                  : isOnTrack
                  ? "text-amber-600"
                  : "text-red-600"
              )}
            >
              {formatValue(actual)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {formatValue(target)}
            </span>
          </div>

          <div className="text-sm text-muted-foreground">{title}</div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isExceeding
                  ? "bg-green-500"
                  : isOnTrack
                  ? "bg-amber-500"
                  : "bg-red-500"
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground text-right">
            {Math.round(progress)}% of goal
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SalesGoalsDashboardMockup() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Sales Goals Dashboard</h2>
          <p className="text-muted-foreground">
            {MOCK_GOALS.period} &bull; {MOCK_GOALS.daysRemaining} days remaining
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {MOCK_GOALS.period}
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Export */}
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>

          {/* Setup Goals (Admin only) */}
          <Button className="gap-2">
            <Target className="h-4 w-4" />
            Setup Goals
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Booked Revenue"
          icon={DollarSign}
          target={MOCK_GOALS.bookedRevenue.target}
          actual={MOCK_GOALS.bookedRevenue.actual}
          isCurrency
        />
        <KPICard
          title="Booking Rate"
          icon={Target}
          target={MOCK_GOALS.bookingRate.target}
          actual={MOCK_GOALS.bookingRate.actual}
          isPercent
        />
        <KPICard
          title="Sent Estimate Rate"
          icon={FileText}
          target={MOCK_GOALS.sentEstimateRate.target}
          actual={MOCK_GOALS.sentEstimateRate.actual}
          isPercent
        />
        <KPICard
          title="Closed Rate"
          icon={TrendingUp}
          target={MOCK_GOALS.closedRate.target}
          actual={MOCK_GOALS.closedRate.actual}
          isPercent
        />
      </div>

      {/* Action Items & Funnel Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {ACTION_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-slate-50 transition-colors text-left"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      item.color
                    )}
                  >
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{item.count}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {FUNNEL_STAGES.map((stage, index) => (
              <div key={stage.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{stage.label}</span>
                  <span className="font-semibold">{stage.count}</span>
                </div>
                <div
                  className="h-8 rounded flex items-center justify-center mx-auto transition-all"
                  style={{ width: `${stage.width}%` }}
                >
                  <div
                    className={cn(
                      "h-full w-full rounded flex items-center justify-center text-white font-medium text-sm",
                      stage.color
                    )}
                  >
                    {stage.count}
                  </div>
                </div>
              </div>
            ))}

            {/* Conversion rate */}
            <div className="pt-4 border-t mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Overall Conversion
                </span>
                <span className="text-lg font-bold text-green-600">
                  {Math.round((38 / 145) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Progress Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Daily Progress</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">
              Daily Target: ${MOCK_GOALS.bookedRevenue.daily.toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Revenue needed per day to hit monthly goal
          </div>

          {/* Simple daily bar visualization */}
          <div className="flex gap-1">
            {Array.from({ length: 28 }, (_, i) => {
              const isPast = i < 2;
              const isToday = i === 2;
              const hitTarget = isPast && Math.random() > 0.3;

              return (
                <div
                  key={`day-${i}`}
                  className={cn(
                    "flex-1 h-12 rounded transition-all cursor-pointer hover:opacity-80",
                    isPast
                      ? hitTarget
                        ? "bg-green-500"
                        : "bg-red-400"
                      : isToday
                      ? "bg-blue-500 ring-2 ring-blue-300"
                      : "bg-slate-200"
                  )}
                  title={`Day ${i + 1}`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-500" />
              <span>Hit Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-400" />
              <span>Missed Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-500" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-slate-200" />
              <span>Upcoming</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
