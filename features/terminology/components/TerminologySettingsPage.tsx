"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Check, RotateCcw } from "lucide-react";
import { useTerminologySettings } from "../hooks/useTerminologySettings";
import { TERMINOLOGY_ENTITIES, defaultTerminologySettings } from "../types";
import type { TerminologySettings, EntityLabel } from "../types";

interface Props {
  initialTerminology: TerminologySettings;
}

export function TerminologySettingsPage({ initialTerminology }: Props) {
  const { terminology, setTerminology, isSaving, error, saved, save } =
    useTerminologySettings(initialTerminology);

  const updateEntity = (key: keyof TerminologySettings, field: keyof EntityLabel, value: string) => {
    setTerminology((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const applySuggestion = (key: keyof TerminologySettings, singular: string) => {
    setTerminology((prev) => ({ ...prev, [key]: { singular, plural: singular + "s" } }));
  };

  const resetAll = () => setTerminology(defaultTerminologySettings);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Terminology</h1>
          <p className="text-sm text-slate-500">
            Rename entities to match your business language. Changes appear in navigation and page titles.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {error && <span className="text-sm text-red-600">{error}</span>}
          {saved && !isSaving && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Check className="h-3.5 w-3.5" />Saved
            </span>
          )}
          <Button variant="outline" size="sm" onClick={resetAll} disabled={isSaving}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />Reset
          </Button>
          <Button size="sm" onClick={() => save(terminology)} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Entity Labels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {TERMINOLOGY_ENTITIES.map((entity) => (
            <div key={entity.key} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
              <Label className="text-sm font-medium text-slate-700">{entity.defaultSingular}</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-500">Singular</Label>
                  <Input
                    value={terminology[entity.key].singular}
                    onChange={(e) => updateEntity(entity.key, "singular", e.target.value)}
                    placeholder={entity.defaultSingular}
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500">Plural</Label>
                  <Input
                    value={terminology[entity.key].plural}
                    onChange={(e) => updateEntity(entity.key, "plural", e.target.value)}
                    placeholder={entity.defaultPlural}
                  />
                </div>
              </div>
              {entity.suggestions.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs text-slate-400">Try:</span>
                  {entity.suggestions.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="cursor-pointer hover:bg-slate-100 text-xs"
                      onClick={() => applySuggestion(entity.key, s)}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
