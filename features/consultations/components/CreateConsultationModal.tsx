"use client";

import { useState } from "react";
import { Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConsultationLinkDisplay } from "./ConsultationLinkDisplay";

interface CreateConsultationModalProps {
  open: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
}

export function CreateConsultationModal({
  open,
  onClose,
  customerId,
  customerName,
}: CreateConsultationModalProps) {
  const [title, setTitle] = useState(`Video Consultation with ${customerName}`);
  const [purpose, setPurpose] = useState("discovery");
  const [isCreating, setIsCreating] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);

  async function handleCreate() {
    setIsCreating(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, title, purpose }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const link = `${window.location.origin}/c/${data.data.publicToken}`;
        setCreatedLink(link);
        setConsultationId(data.data.id);
      }
    } catch {
      // Error handled by UI state
    } finally {
      setIsCreating(false);
    }
  }

  function handleClose() {
    setCreatedLink(null);
    setConsultationId(null);
    setTitle(`Video Consultation with ${customerName}`);
    setPurpose("discovery");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {createdLink ? "Consultation Ready" : "Start Video Consultation"}
          </DialogTitle>
        </DialogHeader>

        {createdLink ? (
          <ConsultationLinkDisplay
            link={createdLink}
            consultationId={consultationId!}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video Consultation"
              />
            </div>
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery Call</SelectItem>
                  <SelectItem value="estimate_review">Estimate Review</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Consultation"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
