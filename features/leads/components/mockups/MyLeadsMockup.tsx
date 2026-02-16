"use client";

/**
 * MOCKUP: Enhanced My Leads View
 *
 * Features based on reference screenshots:
 * - Left sidebar with pipeline stage filters
 * - Top dropdown filters (Assigned, Status, Source, Branch)
 * - Search bar
 * - Enhanced table with more columns
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
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sidebar filter options (pipeline stages)
const SIDEBAR_FILTERS = [
  { id: "active", label: "Active", color: "text-blue-600 font-semibold" },
  { id: "inventory-submitted", label: "Inventory Submitted", color: "text-slate-600" },
  { id: "accepted", label: "Accepted", color: "text-slate-600" },
  { id: "booked", label: "Booked", color: "text-slate-600" },
  { id: "messages", label: "Messages", color: "text-slate-600" },
  { id: "closed", label: "Closed", color: "text-slate-600" },
  { id: "move-date-tbd", label: "Move Date TBD", color: "text-slate-600" },
  { id: "unassigned", label: "Unassigned", color: "text-slate-600" },
] as const;

// Mock data for demonstration
const MOCK_LEADS = [
  { id: "67681", name: "Albert Valenzuela", status: "Lead In Progress", serviceDate: "2/5/2026", estRevenue: "$0.00", address: "avondale 85323" },
  { id: "67679", name: "Anudeep Sanepalli", status: "Lead In Progress", serviceDate: "2/7/2026", estRevenue: "$0.00", address: "chandler 85225" },
  { id: "67677", name: "Diana Newell", status: "Lead In Progress", serviceDate: "2/3/2026", estRevenue: "$0.00", address: "scottsdale 85250" },
  { id: "67673", name: "Keymonta Washington", status: "Lead In Progress", serviceDate: "2/3/2026", estRevenue: "$0.00", address: "tempe 85283" },
  { id: "67671", name: "Michelle Dils", status: "Lead In Progress", serviceDate: "2/5/2026", estRevenue: "$0.00", address: "phoenix 85022" },
  { id: "67667", name: "Carol Bie", status: "Lead In Progress", serviceDate: "2/14/2026", estRevenue: "$0.00", address: "phoenix 85021" },
  { id: "67665", name: "Justin Johnson", status: "Lead In Progress", serviceDate: "2/5/2026", estRevenue: "$0.00", address: "tempe 85281" },
  { id: "67663", name: "Dale Liekweg", status: "Lead In Progress", serviceDate: "2/4/2026", estRevenue: "$0.00", address: "sun city 85373" },
];

type SidebarFilter = typeof SIDEBAR_FILTERS[number]["id"];

export function MyLeadsMockup() {
  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilter>("active");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-full">
      {/* Left Sidebar Filters */}
      <div className="w-48 border-r bg-white shrink-0">
        <div className="py-2">
          {SIDEBAR_FILTERS.map((filter) => (
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

          {/* Filter Dropdowns */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800">
            Any Opp Status
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800">
            Any Lead Status
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800">
            Any Source
            <ChevronDown className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-800">
            Any Branch
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Search */}
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
                      Type <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      Move Size <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      Service Date <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      Est. Revenue <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    <button className="flex items-center gap-1">
                      Est. Profit <ChevronDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-3 text-xs font-semibold text-slate-500 uppercase">
                    Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADS.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-slate-50 cursor-pointer">
                    <td className="p-3">
                      <input type="checkbox" className="h-4 w-4 rounded" />
                    </td>
                    <td className="p-3">
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                        {lead.id}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-orange-500 text-white">
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-500">--</td>
                    <td className="p-3 font-medium">{lead.name}</td>
                    <td className="p-3 text-sm text-slate-500">--</td>
                    <td className="p-3 text-sm text-slate-500">--</td>
                    <td className="p-3 text-sm">{lead.serviceDate}</td>
                    <td className="p-3 text-sm">{lead.estRevenue}</td>
                    <td className="p-3 text-sm text-slate-500">--</td>
                    <td className="p-3 text-sm text-slate-600">
                      {lead.address} <span className="text-slate-400">→</span> {lead.address.split(" ")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <span className="text-sm text-slate-500">
              Showing {MOCK_LEADS.length} leads
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
