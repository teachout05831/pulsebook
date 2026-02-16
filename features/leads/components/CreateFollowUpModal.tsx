"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createFollowUp } from "@/features/follow-ups/actions/createFollowUp";
import type { FollowUpType } from "@/features/follow-ups/types";

interface CreateFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  onSuccess?: () => void;
}

const FOLLOW_UP_TYPES: { value: FollowUpType; label: string; icon: typeof Phone }[] = [
  { value: "call", label: "Call", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "meeting", label: "Meeting", icon: MapPin },
];

// Get current local datetime as "YYYY-MM-DDThh:mm" for the min attribute
function getMinDatetime(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

// Default to tomorrow at 9:00 AM local time
function getDefaultDatetime(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const y = tomorrow.getFullYear();
  const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const d = String(tomorrow.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T09:00`;
}

export function CreateFollowUpModal({
  open,
  onOpenChange,
  leadId,
  leadName,
  onSuccess,
}: CreateFollowUpModalProps) {
  const [type, setType] = useState<FollowUpType>("call");
  const [dueDateTime, setDueDateTime] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default datetime when modal opens (useEffect works for controlled Dialog)
  useEffect(() => {
    if (open) {
      setDueDateTime(getDefaultDatetime());
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDateTime) {
      setError("Please select a follow-up date and time");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Convert local datetime to UTC ISO string for storage
    const localDate = new Date(dueDateTime);
    const isoString = localDate.toISOString();

    const result = await createFollowUp({
      customerId: leadId,
      type,
      dueDate: isoString,
      details: details || undefined,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Reset and close
    setType("call");
    setDueDateTime("");
    setDetails("");
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Follow-up</DialogTitle>
          <p className="text-sm text-muted-foreground">
            For <span className="font-medium text-foreground">{leadName}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Follow-up Type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              {FOLLOW_UP_TYPES.map((ft) => (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => setType(ft.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors flex-1",
                    type === ft.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <ft.icon className="h-4 w-4" />
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="space-y-2">
            <Label htmlFor="dueDateTime">Follow-up Date & Time</Label>
            <Input
              id="dueDateTime"
              type="datetime-local"
              value={dueDateTime}
              onChange={(e) => setDueDateTime(e.target.value)}
              min={getMinDatetime()}
              required
            />
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Notes (optional)</Label>
            <Textarea
              id="details"
              placeholder="Add any notes about this follow-up..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Follow-up"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
