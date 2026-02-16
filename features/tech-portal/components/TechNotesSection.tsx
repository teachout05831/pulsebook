"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardList, Save } from "lucide-react";
import { toast } from "sonner";
import { useTechCrewFeedback } from "../hooks/useTechCrewFeedback";

interface Props {
  jobId: string;
  crewNotes?: string | null;
  customerNotes?: string | null;
  crewFeedback: string | null;
}

export function TechNotesSection({ jobId, crewNotes, customerNotes, crewFeedback }: Props) {
  const { feedback, setFeedback, saveFeedback, isSaving } = useTechCrewFeedback(jobId, crewFeedback);

  const handleSave = async () => {
    const ok = await saveFeedback();
    if (ok) toast.success("Feedback saved");
    else toast.error("Failed to save feedback");
  };

  return (
    <div className="space-y-3">
      {crewNotes !== undefined && crewNotes && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-medium text-blue-700">Crew Notes</p>
            </div>
            <p className="text-sm">{crewNotes}</p>
          </CardContent>
        </Card>
      )}

      {customerNotes !== undefined && customerNotes && (
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Customer Notes</p>
            <p className="text-sm">{customerNotes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-4 pb-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Crew Feedback</p>
          <Textarea
            placeholder="Add notes about this job..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            maxLength={2000}
            className="text-sm"
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="mr-1 h-3 w-3" />
              {isSaving ? "Saving..." : "Save Feedback"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
