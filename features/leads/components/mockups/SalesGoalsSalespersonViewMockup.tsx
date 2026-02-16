"use client";

/**
 * MOCKUP: Sales Goals - Individual Salesperson View
 *
 * What an individual salesperson sees:
 * - Their personal goals and progress
 * - Daily/weekly breakdown
 * - What they need to do to hit target
 * - Their rank among peers (optional)
 *
 * This is a UI mockup for review before implementation.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  Award,
  Flame,
  Clock,
  Phone,
  FileText,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock salesperson data
const SALESPERSON = {
  name: "Daniela Martinez",
  avatar: "DM",
  rank: 2,
  totalSalespeople: 8,
  streak: 5, // days hitting target
};

const GOALS = {
  period: "February 2026",
  daysElapsed: 2,
  daysRemaining: 26,

  revenue: {
    monthlyTarget: 83333,
    achieved: 8500,
    dailyTarget: 2976,
    todayAchieved: 2100,
  },

  bookingRate: { target: 35, actual: 42 },
  sentEstimateRate: { target: 80, actual: 78 },
  closedRate: { target: 25, actual: 28 },

  todayStats: {
    callsMade: 12,
    estimatesSent: 3,
    bookings: 1,
  },
};

// What they need to do to catch up
const CATCH_UP_PLAN = {
  revenueNeeded: 74833,
  daysLeft: 26,
  perDayNeeded: 2878,
  currentPace: 4250, // per day based on 2 days
  onTrack: true,
};

// Recent wins
const RECENT_WINS = [
  { customer: "Johnson Family", amount: 4200, date: "Today" },
  { customer: "Smith Relocation", amount: 3100, date: "Yesterday" },
  { customer: "Garcia Move", amount: 1200, date: "Yesterday" },
];

function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  color = "stroke-blue-500",
  label,
  sublabel,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-slate-200"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-500", color)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold">{label}</span>
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  );
}

export function SalesGoalsSalespersonViewMockup() {
  const revenueProgress = (GOALS.revenue.achieved / GOALS.revenue.monthlyTarget) * 100;
  const timeProgress = (GOALS.daysElapsed / 28) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header with personal greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            {SALESPERSON.avatar}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Hey {SALESPERSON.name.split(" ")[0]}!</h2>
            <p className="text-muted-foreground">
              {GOALS.period} &bull; {GOALS.daysRemaining} days to hit your goals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Streak badge */}
          {SALESPERSON.streak > 0 && (
            <Badge className="gap-1 bg-orange-100 text-orange-700 border-orange-200">
              <Flame className="h-3 w-3" />
              {SALESPERSON.streak} day streak
            </Badge>
          )}

          {/* Rank badge */}
          <Badge variant="outline" className="gap-1">
            <Award className="h-3 w-3" />
            #{SALESPERSON.rank} of {SALESPERSON.totalSalespeople}
          </Badge>
        </div>
      </div>

      {/* Main Progress Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Progress - Large card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular progress */}
              <CircularProgress
                value={GOALS.revenue.achieved}
                max={GOALS.revenue.monthlyTarget}
                size={160}
                strokeWidth={14}
                color={revenueProgress >= timeProgress ? "stroke-green-500" : "stroke-amber-500"}
                label={`${Math.round(revenueProgress)}%`}
                sublabel="of goal"
              />

              {/* Stats */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm text-muted-foreground">Achieved</div>
                    <div className="text-3xl font-bold text-green-600">
                      ${GOALS.revenue.achieved.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Target</div>
                    <div className="text-xl font-semibold">
                      ${GOALS.revenue.monthlyTarget.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        revenueProgress >= timeProgress ? "bg-green-500" : "bg-amber-500"
                      )}
                      style={{ width: `${Math.min(revenueProgress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Day {GOALS.daysElapsed} of 28</span>
                    <span>
                      ${(GOALS.revenue.monthlyTarget - GOALS.revenue.achieved).toLocaleString()} to go
                    </span>
                  </div>
                </div>

                {/* Status message */}
                <div
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg",
                    CATCH_UP_PLAN.onTrack ? "bg-green-50" : "bg-amber-50"
                  )}
                >
                  {CATCH_UP_PLAN.onTrack ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <span className="font-medium text-green-800">On track!</span>
                        <span className="text-green-700 text-sm ml-2">
                          You're averaging ${CATCH_UP_PLAN.currentPace.toLocaleString()}/day
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-5 w-5 text-amber-600" />
                      <div>
                        <span className="font-medium text-amber-800">Slightly behind</span>
                        <span className="text-amber-700 text-sm ml-2">
                          Need ${CATCH_UP_PLAN.perDayNeeded.toLocaleString()}/day to catch up
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Today's revenue */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Revenue Today</span>
                <Badge
                  variant="outline"
                  className={cn(
                    GOALS.revenue.todayAchieved >= GOALS.revenue.dailyTarget
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {Math.round((GOALS.revenue.todayAchieved / GOALS.revenue.dailyTarget) * 100)}%
                </Badge>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold">
                  ${GOALS.revenue.todayAchieved.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  / ${GOALS.revenue.dailyTarget.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Activity stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Phone className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                <div className="text-xl font-bold">{GOALS.todayStats.callsMade}</div>
                <div className="text-xs text-muted-foreground">Calls</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <FileText className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                <div className="text-xl font-bold">{GOALS.todayStats.estimatesSent}</div>
                <div className="text-xs text-muted-foreground">Estimates</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Target className="h-4 w-4 mx-auto text-green-600 mb-1" />
                <div className="text-xl font-bold">{GOALS.todayStats.bookings}</div>
                <div className="text-xs text-muted-foreground">Bookings</div>
              </div>
            </div>

            {/* Recent wins */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-2">Recent Wins</h4>
              <div className="space-y-2">
                {RECENT_WINS.map((win) => (
                  <div key={win.customer} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{win.customer}</span>
                    <Badge variant="outline" className="text-green-600">
                      +${win.amount.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Booking Rate</span>
              <Badge
                variant="outline"
                className={cn(
                  GOALS.bookingRate.actual >= GOALS.bookingRate.target
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                )}
              >
                {GOALS.bookingRate.actual >= GOALS.bookingRate.target ? "+" : ""}
                {GOALS.bookingRate.actual - GOALS.bookingRate.target}%
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "text-3xl font-bold",
                  GOALS.bookingRate.actual >= GOALS.bookingRate.target
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {GOALS.bookingRate.actual}%
              </span>
              <span className="text-muted-foreground">/ {GOALS.bookingRate.target}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className={cn(
                  "h-full rounded-full",
                  GOALS.bookingRate.actual >= GOALS.bookingRate.target
                    ? "bg-green-500"
                    : "bg-red-500"
                )}
                style={{
                  width: `${Math.min((GOALS.bookingRate.actual / GOALS.bookingRate.target) * 100, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Sent Estimate Rate</span>
              <Badge
                variant="outline"
                className={cn(
                  GOALS.sentEstimateRate.actual >= GOALS.sentEstimateRate.target
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                )}
              >
                {GOALS.sentEstimateRate.actual - GOALS.sentEstimateRate.target}%
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "text-3xl font-bold",
                  GOALS.sentEstimateRate.actual >= GOALS.sentEstimateRate.target
                    ? "text-green-600"
                    : "text-amber-600"
                )}
              >
                {GOALS.sentEstimateRate.actual}%
              </span>
              <span className="text-muted-foreground">/ {GOALS.sentEstimateRate.target}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className={cn(
                  "h-full rounded-full",
                  GOALS.sentEstimateRate.actual >= GOALS.sentEstimateRate.target
                    ? "bg-green-500"
                    : "bg-amber-500"
                )}
                style={{
                  width: `${Math.min((GOALS.sentEstimateRate.actual / GOALS.sentEstimateRate.target) * 100, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Closed Rate</span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700"
              >
                +{GOALS.closedRate.actual - GOALS.closedRate.target}%
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">
                {GOALS.closedRate.actual}%
              </span>
              <span className="text-muted-foreground">/ {GOALS.closedRate.target}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${Math.min((GOALS.closedRate.actual / GOALS.closedRate.target) * 100, 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              You have <strong>8 follow-ups</strong> due today
            </span>
            <Button className="gap-2">
              View My Leads
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
