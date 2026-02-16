"use client";

/**
 * MOCKUP: Sales Goals Setup - Configuration View
 *
 * Where managers set monthly/annual goals:
 * - Assign goals to all salespeople, individuals, or groups
 * - Set revenue targets, rate targets
 * - View historical data to inform goal setting
 * - Distribute goals monthly
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
  Users,
  User,
  Plus,
  Trash2,
  Copy,
  Save,
  History,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock salespeople data
const SALESPEOPLE = [
  { id: "1", name: "Daniela Martinez", avatar: "DM", lastYearAvg: 85000 },
  { id: "2", name: "John Smith", avatar: "JS", lastYearAvg: 72000 },
  { id: "3", name: "Sarah Johnson", avatar: "SJ", lastYearAvg: 95000 },
  { id: "4", name: "Mike Chen", avatar: "MC", lastYearAvg: 68000 },
];

// Months for the year view
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type GoalAssignment = "all" | "individual" | "team";

export function SalesGoalsSetupMockup() {
  const [assignmentType, setAssignmentType] = useState<GoalAssignment>("individual");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedPerson, setSelectedPerson] = useState<string | null>("1");

  // Mock goal values (would be form state in real implementation)
  const [goals, setGoals] = useState({
    annualRevenue: 1000000,
    bookingRate: 35,
    sentEstimateRate: 80,
    closedRate: 25,
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Setup Sales Goals</h2>
          <p className="text-muted-foreground">
            Configure revenue and rate targets for your sales team
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            View History
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Goals
          </Button>
        </div>
      </div>

      {/* Assignment Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Goal Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => setAssignmentType("all")}
              className={cn(
                "flex-1 p-4 rounded-lg border-2 transition-all text-left",
                assignmentType === "all"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <Users className="h-6 w-6 mb-2 text-blue-600" />
              <div className="font-semibold">All Salespeople</div>
              <div className="text-sm text-muted-foreground">
                Same goals for everyone
              </div>
            </button>

            <button
              onClick={() => setAssignmentType("individual")}
              className={cn(
                "flex-1 p-4 rounded-lg border-2 transition-all text-left",
                assignmentType === "individual"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <User className="h-6 w-6 mb-2 text-blue-600" />
              <div className="font-semibold">Individual</div>
              <div className="text-sm text-muted-foreground">
                Custom goals per person
              </div>
            </button>

            <button
              onClick={() => setAssignmentType("team")}
              className={cn(
                "flex-1 p-4 rounded-lg border-2 transition-all text-left",
                assignmentType === "team"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <Target className="h-6 w-6 mb-2 text-blue-600" />
              <div className="font-semibold">By Team/Branch</div>
              <div className="text-sm text-muted-foreground">
                Goals by team or branch
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Salesperson Selector (for individual mode) */}
        {assignmentType === "individual" && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Select Salesperson</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SALESPEOPLE.map((person) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedPerson(person.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
                    selectedPerson === person.id
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "border border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-sm">
                    {person.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{person.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Last year avg: ${person.lastYearAvg.toLocaleString()}/mo
                    </div>
                  </div>
                  {selectedPerson === person.id && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Goal Configuration Form */}
        <Card className={cn(assignmentType === "individual" ? "lg:col-span-2" : "lg:col-span-3")}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {selectedYear} Goals
              {assignmentType === "individual" && selectedPerson && (
                <span className="text-muted-foreground font-normal">
                  {" "}
                  - {SALESPEOPLE.find((p) => p.id === selectedPerson)?.name}
                </span>
              )}
            </CardTitle>
            <Button variant="outline" className="gap-2" size="sm">
              <Calendar className="h-4 w-4" />
              {selectedYear}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Annual Targets */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Annual Revenue Target</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={goals.annualRevenue.toLocaleString()}
                    className="pl-9"
                    onChange={() => {}}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  ~${Math.round(goals.annualRevenue / 12).toLocaleString()}/month
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Booking Rate Target</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={goals.bookingRate}
                    className="pr-8"
                    onChange={() => {}}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Booked / Total Leads
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sent Estimate Rate</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={goals.sentEstimateRate}
                    className="pr-8"
                    onChange={() => {}}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Estimates / Total Leads
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Closed Rate Target</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={goals.closedRate}
                    className="pr-8"
                    onChange={() => {}}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Closed / Estimates Sent
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Monthly Revenue Breakdown</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Copy className="h-3 w-3" />
                    Distribute Evenly
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {MONTHS.map((month, i) => {
                  const monthlyTarget = Math.round(goals.annualRevenue / 12);
                  // Add some variance for realism
                  const adjusted = monthlyTarget + (i % 3 === 0 ? 5000 : i % 2 === 0 ? -3000 : 0);

                  return (
                    <div key={month} className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        {month}
                      </label>
                      <Input
                        type="text"
                        value={`$${adjusted.toLocaleString()}`}
                        className="text-sm h-9"
                        onChange={() => {}}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="text-sm text-amber-800">
                  Monthly totals: ${goals.annualRevenue.toLocaleString()} - Matches annual target
                </span>
              </div>
            </div>

            {/* Historical Reference */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Historical Reference</h4>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Last Year Total</div>
                  <div className="text-2xl font-bold">$892,000</div>
                  <div className="text-xs text-green-600">+12% proposed increase</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Avg Monthly</div>
                  <div className="text-2xl font-bold">$74,333</div>
                  <div className="text-xs text-muted-foreground">Based on 2025 data</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Best Month</div>
                  <div className="text-2xl font-bold">$112,000</div>
                  <div className="text-xs text-muted-foreground">June 2025</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
        <div className="text-sm text-muted-foreground">
          Goals will be distributed daily. Feb 2026 = $83,333 / 28 days = $2,976.19 per day
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save & Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
