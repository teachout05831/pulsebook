"use client";

/**
 * MOCKUP: Sales Goals Leaderboard - Team Comparison
 *
 * Team comparison and rankings:
 * - Leaderboard by revenue, booking rate, etc.
 * - Visual comparison bars
 * - Trend indicators
 * - Team vs individual performance
 *
 * This is a UI mockup for review before implementation.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Calendar,
  Users,
  DollarSign,
  Target,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SortMetric = "revenue" | "bookingRate" | "closedRate" | "leads";

// Mock leaderboard data
const LEADERBOARD = [
  {
    id: "3",
    name: "Sarah Johnson",
    avatar: "SJ",
    revenue: 32500,
    revenueGoal: 83333,
    bookingRate: 48,
    closedRate: 32,
    leads: 42,
    trend: "up" as const,
    streak: 8,
  },
  {
    id: "1",
    name: "Daniela Martinez",
    avatar: "DM",
    revenue: 28500,
    revenueGoal: 83333,
    bookingRate: 42,
    closedRate: 28,
    leads: 38,
    trend: "up" as const,
    streak: 5,
  },
  {
    id: "2",
    name: "John Smith",
    avatar: "JS",
    revenue: 24000,
    revenueGoal: 75000,
    bookingRate: 38,
    closedRate: 25,
    leads: 35,
    trend: "same" as const,
    streak: 0,
  },
  {
    id: "4",
    name: "Mike Chen",
    avatar: "MC",
    revenue: 18500,
    revenueGoal: 70000,
    bookingRate: 35,
    closedRate: 22,
    leads: 28,
    trend: "down" as const,
    streak: 0,
  },
  {
    id: "5",
    name: "Emily Davis",
    avatar: "ED",
    revenue: 15200,
    revenueGoal: 65000,
    bookingRate: 32,
    closedRate: 20,
    leads: 25,
    trend: "up" as const,
    streak: 2,
  },
  {
    id: "6",
    name: "Alex Thompson",
    avatar: "AT",
    revenue: 12800,
    revenueGoal: 65000,
    bookingRate: 28,
    closedRate: 18,
    leads: 22,
    trend: "down" as const,
    streak: 0,
  },
];

// Team totals
const TEAM_TOTALS = {
  totalRevenue: LEADERBOARD.reduce((sum, p) => sum + p.revenue, 0),
  totalGoal: LEADERBOARD.reduce((sum, p) => sum + p.revenueGoal, 0),
  avgBookingRate: Math.round(
    LEADERBOARD.reduce((sum, p) => sum + p.bookingRate, 0) / LEADERBOARD.length
  ),
  avgClosedRate: Math.round(
    LEADERBOARD.reduce((sum, p) => sum + p.closedRate, 0) / LEADERBOARD.length
  ),
  totalLeads: LEADERBOARD.reduce((sum, p) => sum + p.leads, 0),
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
        <Crown className="h-4 w-4 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center">
        <Medal className="h-4 w-4 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
        <Medal className="h-4 w-4 text-white" />
      </div>
    );
  }
  return (
    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
      {rank}
    </div>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "same" }) {
  if (trend === "up") {
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  }
  if (trend === "down") {
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  }
  return <Minus className="h-4 w-4 text-slate-400" />;
}

export function SalesGoalsLeaderboardMockup() {
  const [sortBy, setSortBy] = useState<SortMetric>("revenue");
  const [period, setPeriod] = useState("month");

  // Sort leaderboard by selected metric
  const sortedLeaderboard = [...LEADERBOARD].sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return b.revenue - a.revenue;
      case "bookingRate":
        return b.bookingRate - a.bookingRate;
      case "closedRate":
        return b.closedRate - a.closedRate;
      case "leads":
        return b.leads - a.leads;
      default:
        return 0;
    }
  });

  const maxRevenue = Math.max(...LEADERBOARD.map((p) => p.revenue));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Sales Leaderboard
          </h2>
          <p className="text-muted-foreground">
            February 2026 &bull; Updated live
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            This Month
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Team Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  ${TEAM_TOTALS.totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Team Revenue</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {Math.round((TEAM_TOTALS.totalRevenue / TEAM_TOTALS.totalGoal) * 100)}%
              of ${TEAM_TOTALS.totalGoal.toLocaleString()} goal
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {TEAM_TOTALS.avgBookingRate}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Booking Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {TEAM_TOTALS.avgClosedRate}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Closed Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{TEAM_TOTALS.totalLeads}</div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rankings</CardTitle>
          <div className="flex gap-2">
            {(["revenue", "bookingRate", "closedRate", "leads"] as SortMetric[]).map(
              (metric) => (
                <Button
                  key={metric}
                  variant={sortBy === metric ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(metric)}
                >
                  {metric === "revenue"
                    ? "Revenue"
                    : metric === "bookingRate"
                    ? "Booking %"
                    : metric === "closedRate"
                    ? "Closed %"
                    : "Leads"}
                </Button>
              )
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedLeaderboard.map((person, index) => {
              const rank = index + 1;
              const progressPercent = (person.revenue / person.revenueGoal) * 100;
              const barWidth = (person.revenue / maxRevenue) * 100;

              return (
                <div
                  key={person.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg transition-all",
                    rank <= 3 ? "bg-gradient-to-r from-yellow-50/50 to-transparent" : "bg-slate-50",
                    rank === 1 && "ring-2 ring-yellow-300"
                  )}
                >
                  {/* Rank */}
                  <RankBadge rank={rank} />

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-semibold text-sm">
                      {person.avatar}
                    </div>
                    <div>
                      <div className="font-medium">{person.name}</div>
                      {person.streak > 0 && (
                        <div className="text-xs text-orange-600">
                          🔥 {person.streak} day streak
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Revenue Bar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">
                        ${person.revenue.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(progressPercent)}% of goal
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          rank === 1
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                            : rank === 2
                            ? "bg-gradient-to-r from-slate-400 to-slate-500"
                            : rank === 3
                            ? "bg-gradient-to-r from-amber-500 to-amber-600"
                            : "bg-blue-500"
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{person.bookingRate}%</div>
                      <div className="text-xs text-muted-foreground">Booking</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{person.closedRate}%</div>
                      <div className="text-xs text-muted-foreground">Closed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{person.leads}</div>
                      <div className="text-xs text-muted-foreground">Leads</div>
                    </div>
                  </div>

                  {/* Trend */}
                  <TrendIcon trend={person.trend} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers Highlight */}
      <div className="grid lg:grid-cols-3 gap-4">
        {sortedLeaderboard.slice(0, 3).map((person, index) => (
          <Card
            key={person.id}
            className={cn(
              "relative overflow-hidden",
              index === 0 && "ring-2 ring-yellow-400"
            )}
          >
            {index === 0 && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl">
                TOP PERFORMER
              </div>
            )}
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center font-bold text-lg text-white",
                    index === 0
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                      : index === 1
                      ? "bg-gradient-to-br from-slate-300 to-slate-500"
                      : "bg-gradient-to-br from-amber-600 to-amber-800"
                  )}
                >
                  {person.avatar}
                </div>
                <div>
                  <div className="font-semibold">{person.name}</div>
                  <div className="text-2xl font-bold">
                    ${person.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded">
                  <div className="font-semibold">{person.bookingRate}%</div>
                  <div className="text-xs text-muted-foreground">Booking</div>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <div className="font-semibold">{person.closedRate}%</div>
                  <div className="text-xs text-muted-foreground">Closed</div>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <div className="font-semibold">{person.leads}</div>
                  <div className="text-xs text-muted-foreground">Leads</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
