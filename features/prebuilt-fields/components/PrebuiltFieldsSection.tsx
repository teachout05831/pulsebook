"use client";

import { RepeatIcon, MapPin, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { usePrebuiltFields } from "../hooks/usePrebuiltFields";

interface ToggleCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

function ToggleCard({ icon, label, description, enabled, onToggle }: ToggleCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{label}</span>
            <Badge variant={enabled ? "default" : "secondary"}>
              {enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}

export function PrebuiltFieldsSection() {
  const { recurringJobsEnabled, multiStopRoutesEnabled, toggle, isLoading } =
    usePrebuiltFields();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium">Pre-Built Fields</h4>
        <p className="text-sm text-muted-foreground">
          Enable system fields with advanced functionality for jobs.
        </p>
      </div>

      <ToggleCard
        icon={<RepeatIcon className="h-5 w-5" />}
        label="Recurring Jobs"
        description="Schedule jobs that repeat on a pattern (daily, weekly, biweekly, monthly). Adds a recurrence section to job forms."
        enabled={recurringJobsEnabled}
        onToggle={(value) => toggle("recurringJobs", value)}
      />

      <ToggleCard
        icon={<MapPin className="h-5 w-5" />}
        label="Multi-Stop Routes"
        description="Add multiple ordered addresses to jobs (start, stops, end). Ideal for moving companies or route-based services."
        enabled={multiStopRoutesEnabled}
        onToggle={(value) => toggle("multiStopRoutes", value)}
      />
    </div>
  );
}
