"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ListChecks, Loader2 } from "lucide-react";
import { useCustomDropdowns } from "../hooks/useCustomDropdowns";
import { DropdownListEditor } from "./DropdownListEditor";
import { DROPDOWN_CATEGORIES } from "../types";
import type { CustomDropdowns } from "@/types/company";
import type { DropdownCategory } from "../types";

interface Props {
  initialDropdowns: CustomDropdowns;
}

export function DropdownsSettingsPage({ initialDropdowns }: Props) {
  const { dropdowns, isSaving, error, updateCategory } = useCustomDropdowns(initialDropdowns);
  const [activeTab, setActiveTab] = useState<DropdownCategory>("serviceTypes");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dropdown Options</h1>
          <p className="text-sm text-slate-500">
            Customize the dropdown options used across estimates, jobs, and leads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="h-4 w-4" />
            Manage Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DropdownCategory)}>
            <TabsList className="mb-4">
              {DROPDOWN_CATEGORIES.map((cat) => (
                <TabsTrigger key={cat.key} value={cat.key} className="gap-1.5">
                  {cat.label}
                  <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 text-[10px]">
                    {dropdowns[cat.key].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            {DROPDOWN_CATEGORIES.map((cat) => (
              <TabsContent key={cat.key} value={cat.key}>
                <DropdownListEditor
                  options={dropdowns[cat.key]}
                  onChange={(opts) => updateCategory(cat.key, opts)}
                  description={cat.description}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
