"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Wand2, Check } from "lucide-react";
import { industryPresets, type IndustryPreset } from "../constants/industryPresets";
import type { EstimateBuilderSettings } from "@/types/company";

interface Props {
  onApply: (settings: Partial<EstimateBuilderSettings>) => void;
}

export function IndustryPresetSelector({ onApply }: Props) {
  const [selected, setSelected] = useState<IndustryPreset | null>(null);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Wand2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">Industry Presets</CardTitle>
              <p className="text-sm text-muted-foreground">Quick-start with settings tailored to your industry</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {industryPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelected(preset)}
                className="rounded-lg border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
              >
                <p className="font-medium text-sm">{preset.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                <span className="mt-2 inline-block rounded bg-muted px-2 py-0.5 text-xs">
                  {preset.settings.defaultPricingModel}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply {selected?.name} Preset?</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite your current pricing model, resource fields, and pricing categories
              with settings optimized for {selected?.name?.toLowerCase()}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (selected) { onApply(selected.settings); setSelected(null); } }}>
              <Check className="mr-1.5 h-4 w-4" />Apply Preset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
