'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MyLeadsMockup, FollowUpsMockup } from "@/features/leads/components/mockups"

type MockupView = "my-leads" | "follow-ups"

export function MockupsPage() {
  const [activeView, setActiveView] = useState<MockupView>("my-leads")

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-bold mb-4">UI Mockups for Review</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("my-leads")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeView === "my-leads"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            My Leads (Enhanced)
          </button>
          <button
            onClick={() => setActiveView("follow-ups")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeView === "follow-ups"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Follow-ups (New)
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeView === "my-leads" && <MyLeadsMockup />}
        {activeView === "follow-ups" && <FollowUpsMockup />}
      </div>
      <div className="border-t bg-amber-50 px-6 py-3 text-sm text-amber-800">
        <strong>Note:</strong> These are UI mockups with static data. Once approved, these patterns will be implemented with real data from the database.
      </div>
    </div>
  )
}
