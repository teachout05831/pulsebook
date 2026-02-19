"use client";

import { useState } from "react";
import { Video, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useConsultationsList } from "../hooks/useConsultationsList";
import { CreateConsultationModal } from "./CreateConsultationModal";
import { ConsultationRow } from "./ConsultationRow";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { value: "all", label: "All" }, { value: "pending", label: "Upcoming" },
  { value: "active", label: "Active" }, { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function ConsultationsList() {
  const list = useConsultationsList();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5" /> Consultations
          </CardTitle>
          <Button size="sm" onClick={() => setShowCreate(true)}>+ New Consultation</Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-0 border-b mb-4">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => list.handleStatusChange(tab.value)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                  list.statusFilter === tab.value
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {list.isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : list.consultations.length === 0 ? (
            <div className="text-center py-20">
              <Video className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-medium text-muted-foreground">No consultations yet</h3>
              <p className="text-sm text-muted-foreground/60 mt-1">Create a video consultation from a customer page to get started.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-6"></TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pipeline</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.consultations.map((c) => (
                    <ConsultationRow
                      key={c.id}
                      c={c}
                      onCancel={list.handleCancel}
                      onReschedule={list.handleReschedule}
                      onDelete={list.handleDelete}
                      onEditDate={(id, date) => list.patchConsultation(id, { scheduledAt: date })}
                    />
                  ))}
                </TableBody>
              </Table>
              {list.totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                  <span>Page {list.currentPage} of {list.totalPages} ({list.total} total)</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={list.currentPage <= 1} onClick={() => list.goToPage(list.currentPage - 1)}>Prev</Button>
                    <Button variant="outline" size="sm" disabled={list.currentPage >= list.totalPages} onClick={() => list.goToPage(list.currentPage + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <CreateConsultationModal open={showCreate} onClose={() => { setShowCreate(false); list.refresh(); }} />
    </div>
  );
}
