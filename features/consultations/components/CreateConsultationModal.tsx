"use client";

import { useState } from "react";
import { Video, CheckCircle2, ChevronsUpDown, Search, Check, CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ConsultationLinkDisplay } from "./ConsultationLinkDisplay";
import { DateTimePicker } from "./DateTimePicker";
import { useCreateConsultation } from "../hooks/useCreateConsultation";

interface CreateConsultationModalProps {
  open: boolean;
  onClose: () => void;
  customerId?: string;
  customerName?: string;
}

export function CreateConsultationModal({ open, onClose, customerId, customerName }: CreateConsultationModalProps) {
  const h = useCreateConsultation({ open, presetCustomerId: customerId || undefined, presetCustomerName: customerName || undefined });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  function handleClose() { h.reset(); setPickerOpen(false); setDatePickerOpen(false); onClose(); }

  function handlePickCustomer(id: string) {
    h.handleCustomerChange(id);
    h.setCustomerSearch("");
    setPickerOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {h.createdLink ? "Consultation Ready" : "New Consultation"}
          </DialogTitle>
        </DialogHeader>

        {h.createdLink ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <p className="text-sm text-green-600 dark:text-green-400">Room created. Share this link with your customer.</p>
            </div>
            <ConsultationLinkDisplay link={h.createdLink} consultationId={h.consultationId!} />
          </div>
        ) : (
          <div className="space-y-4">
            {h.needsPicker && (
              <div>
                <Label className="mb-1.5 block">Customer</Label>
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={pickerOpen} className="w-full justify-between font-normal">
                      {h.selectedCustomerName || "Search customers..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="flex items-center border-b px-3 py-2">
                      <Search className="h-4 w-4 shrink-0 opacity-50 mr-2" />
                      <input
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        placeholder="Search customers..."
                        value={h.customerSearch}
                        onChange={(e) => h.setCustomerSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                      {h.isLoadingCustomers ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">Loading...</p>
                      ) : h.filteredCustomers.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">No customers found</p>
                      ) : (
                        h.filteredCustomers.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handlePickCustomer(c.id)}
                            className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                          >
                            <Check className={cn("mr-2 h-4 w-4", h.selectedCustomerId === c.id ? "opacity-100" : "opacity-0")} />
                            {c.name}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div>
              <Label htmlFor="title" className="mb-1.5 block">Title</Label>
              <Input id="title" value={h.title} onChange={(e) => h.setTitle(e.target.value)} placeholder="Video Consultation" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="purpose" className="mb-1.5 block">Purpose</Label>
                <Select value={h.purpose} onValueChange={h.setPurpose}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discovery">Discovery Call</SelectItem>
                    <SelectItem value="estimate_review">Estimate Review</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">Date & Time</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal text-sm">
                      <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
                      {h.scheduledAt
                        ? new Date(h.scheduledAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                        : "Pick date & time..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <DateTimePicker value={h.scheduledAt || undefined} onChange={(iso) => h.setScheduledAt(iso)} submitLabel="Set" onSubmit={() => setDatePickerOpen(false)} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={h.handleCreate} disabled={h.isCreating}>
                {h.isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
