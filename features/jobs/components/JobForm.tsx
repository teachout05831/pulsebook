"use client";

import { ArrowLeft, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomFieldsForm } from "@/features/custom-fields";
import { TagSelector } from "@/features/tags";
import { RecurrenceForm } from "@/features/recurring-jobs";
import { StopsEditor } from "@/features/job-stops";
import { useJobForm } from "../hooks/useJobForm";

function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function JobForm() {
  const h = useJobForm();

  if (h.isLoadingEstimate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={h.handleCancel}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          <div><h1 className="text-3xl font-bold">New Job</h1><p className="text-muted-foreground">Loading estimate data...</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={h.handleCancel}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">New Job</h1>
            {h.estimate && <Badge variant="secondary" className="bg-blue-100 text-blue-800"><FileText className="mr-1 h-3 w-3" />From {h.estimate.estimateNumber}</Badge>}
          </div>
          <p className="text-muted-foreground">{h.estimate ? `Creating job from approved estimate for ${h.estimate.customerName}` : "Schedule a new service job"}</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={h.handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Customer *" error={h.errors.customerId}>
                <Select value={h.formData.customerId || undefined} onValueChange={h.handleCustomerChange} disabled={h.isLoadingCustomers}>
                  <SelectTrigger><SelectValue placeholder={h.isLoadingCustomers ? "Loading..." : "Select a customer"} /></SelectTrigger>
                  <SelectContent>{h.customers.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Title *" error={h.errors.title}><Input name="title" value={h.formData.title} onChange={h.handleChange} placeholder="e.g., Pool Cleaning, Lawn Mowing" autoFocus={!h.preselectedCustomerId} /></FormField>
              <FormField label="Scheduled Date *" error={h.errors.scheduledDate}><Input name="scheduledDate" type="date" value={h.formData.scheduledDate} onChange={h.handleChange} /></FormField>
              <FormField label="Scheduled Time"><Input name="scheduledTime" type="time" value={h.formData.scheduledTime} onChange={h.handleChange} /></FormField>
              <FormField label="Arrival Window">
                <Select value={h.formData.arrivalWindow || "__none__"} onValueChange={(v) => h.handleChange({ target: { name: "arrivalWindow", value: v === "__none__" ? "" : v } } as React.ChangeEvent<HTMLInputElement>)}>
                  <SelectTrigger><SelectValue placeholder="No arrival window" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">None</SelectItem>
                    {h.arrivalWindows.map((w) => (<SelectItem key={w.id} value={w.id}>{w.label} ({w.startTime} - {w.endTime})</SelectItem>))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Estimated Duration (minutes)"><Input name="estimatedDuration" type="number" value={h.formData.estimatedDuration} onChange={h.handleChange} placeholder="60" /></FormField>
              <FormField label="Assigned To">
                {h.assignmentMode === "both" && (
                  <div className="flex gap-2 mb-2">
                    <Button type="button" size="sm" variant={h.assignType === "individual" ? "default" : "outline"} onClick={() => h.setAssignType("individual")}>Individual</Button>
                    <Button type="button" size="sm" variant={h.assignType === "crew" ? "default" : "outline"} onClick={() => h.setAssignType("crew")}>Crew</Button>
                  </div>
                )}
                {(h.assignmentMode === "individual" || (h.assignmentMode === "both" && h.assignType === "individual")) && (
                  <Select value={h.formData.assignedTo || undefined} onValueChange={h.setAssignedTo}>
                    <SelectTrigger><SelectValue placeholder="Select a team member" /></SelectTrigger>
                    <SelectContent>{h.teamMembers.map((tm) => (<SelectItem key={tm.id} value={tm.id}>{tm.name}</SelectItem>))}</SelectContent>
                  </Select>
                )}
                {(h.assignmentMode === "crew" || (h.assignmentMode === "both" && h.assignType === "crew")) && (
                  <Select value={h.formData.assignedCrewId || undefined} onValueChange={h.setAssignedCrewId}>
                    <SelectTrigger><SelectValue placeholder="Select a crew" /></SelectTrigger>
                    <SelectContent>{h.crews.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}{c.vehicleName ? ` — ${c.vehicleName}` : ""}</SelectItem>))}</SelectContent>
                  </Select>
                )}
              </FormField>
            </div>
            <FormField label="Service Address"><Input name="address" value={h.formData.address} onChange={h.handleChange} placeholder="Service address (auto-filled from customer)" /></FormField>
            {h.multiStopRoutesEnabled && <StopsEditor stops={h.jobStops.stops} onAddStop={h.jobStops.addStop} onRemoveStop={h.jobStops.removeStop} onUpdateStop={h.jobStops.updateStop} />}
            <FormField label="Description"><Textarea name="description" value={h.formData.description} onChange={h.handleChange} placeholder="Job description..." rows={3} /></FormField>
            <FormField label="Notes"><Textarea name="notes" value={h.formData.notes} onChange={h.handleChange} placeholder="Internal notes..." rows={3} /></FormField>
            <FormField label="Tags"><TagSelector entityType="job" selectedTags={h.tags} onChange={h.setTags} /></FormField>
            {h.recurringJobsEnabled && <RecurrenceForm isRecurring={h.recurrence.isRecurring} onIsRecurringChange={h.recurrence.setIsRecurring} config={h.recurrence.config} onFrequencyChange={h.recurrence.updateFrequency} onToggleDay={h.recurrence.toggleDay} onFieldChange={h.recurrence.updateField} />}
            <CustomFieldsForm entityType="job" values={h.customFields} onChange={h.setCustomFields} />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={h.handleCancel}>Cancel</Button>
              <Button type="submit" disabled={h.isCreating}>{h.isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Job</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
