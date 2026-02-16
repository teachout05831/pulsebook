"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TrustBadgeListEditor } from "./TrustBadgeListEditor";
import type { TrustBadge } from "./TrustBadgeListEditor";
import type { PageSection } from "../../types";

interface Props {
  section: PageSection;
  onUpdateContent: (key: string, value: unknown) => void;
}

function Tog({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs">{label}</Label>
      <Switch checked={on} onCheckedChange={set} />
    </div>
  );
}

export function TrustBadgesFields({ section, onUpdateContent: uc }: Props) {
  return (
    <>
      <Tog label="Show Google Rating" on={section.content.showGoogleRating !== false} set={(v) => uc("showGoogleRating", v)} />
      <Tog label="Show Certifications" on={section.content.showCertifications !== false} set={(v) => uc("showCertifications", v)} />
      <Tog label="Show Insurance" on={section.content.showInsurance !== false} set={(v) => uc("showInsurance", v)} />
      <TrustBadgeListEditor badges={(section.content.badges as TrustBadge[]) || []} onChange={(v) => uc("badges", v)} />
    </>
  );
}
