"use client";

/**
 * MOCKUP: Enhanced Follow-ups View
 *
 * Features based on reference screenshots:
 * - Left sidebar with time-based filters (Open, Due Today, Due This Week, Overdue, Completed, All)
 * - Top header with tabs and search
 * - Table view with follow-up tasks
 *
 * This is a UI mockup for review before implementation.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sidebar filter options for follow-ups
const FOLLOWUP_FILTERS = [
  { id: "open", label: "Open", color: "text-blue-600 font-semibold" },
  { id: "due-today", label: "Due Today", color: "text-amber-600" },
  { id: "due-this-week", label: "Due This Week", color: "text-slate-600" },
  { id: "overdue", label: "Overdue", color: "text-red-600" },
  { id: "completed", label: "Completed", color: "text-green-600" },
  { id: "all", label: "All", color: "text-slate-600" },
] as const;

// Mock data for demonstration
const MOCK_FOLLOWUPS = [
  {
    id: "67290",
    oppStatus: "Booked",
    leadStatus: "",
    name: "Andrew Campo",
    title: "Call Andrew Campo",
    date: "3/25/26 9:00AM",
    assignedTo: "Daniela",
    type: "call" as const,
  },
];

type FollowupFilter = typeof FOLLOWUP_FILTERS[number]["id"];

export function FollowUpsMockup() {
  const [sidebarFilter, setSidebarFilter] = useState<FollowupFilter>("open");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "booked":
        return "bg-green-600 text-white";
      case "lead in progress":
        return "bg-orange-500 text-white";
      case "proposal sent":
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-200 text-slate-700";
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar Filters */}
      <div className="w-44 border-r bg-white shrink-0">
        <div className="py-2">
          {FOLLOWUP_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSidebarFilter(filter.id)}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors",
                sidebarFilter === filter.id
                  ? "bg-blue-50 border-l-2 border-blue-600 text-blue-600 font-medium"
                  : filter.color
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 bg-slate-50">
        {/* Top Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Assigned To Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700">
              Daniela
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Search - positioned to the right */}
          <div className="ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="w-10 p-3">
                    <input type="checkbox" className="h-4 w-4 rounded" />
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      # <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      Opp Status <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      Lead Status <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      Name <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      Title <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase bg-blue-50">
                    <button className="flex items-center gap-1 text-blue-600">
                      Date <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    Assigned
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_FOLLOWUPS.map((followup) => (
                  <tr key={followup.id} className="border-b hover:bg-slate-50 cursor-pointer">
                    <td className="p-3">
                      <input type="checkbox" className="h-4 w-4 rounded" />
                    </td>
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                        {followup.id}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="p-3">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded text-xs font-medium",
                        getStatusBadgeColor(followup.oppStatus)
                      )}>
                        {followup.oppStatus}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-500">
                      {followup.leadStatus || "--"}
                    </td>
                    <td className="p-3 font-medium">{followup.name}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {followup.type === "call" && (
                          <Phone className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm">{followup.title}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm bg-blue-50">{followup.date}</td>
                    <td className="p-3 text-sm">{followup.assignedTo}</td>
                  </tr>
                ))}

                {MOCK_FOLLOWUPS.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No follow-ups in this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-slate-500">
              Showing {MOCK_FOLLOWUPS.length} follow-ups
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="default" size="sm" className="min-w-8">
                1
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
