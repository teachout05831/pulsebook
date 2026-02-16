"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getFieldLabel, isLongText } from "../../utils/blockHelpers";

interface BlockFieldListProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (varName: string, value: string) => void;
}

export function BlockFieldList({ variables, values, onChange }: BlockFieldListProps) {
  return (
    <div className="space-y-3">
      {variables.map((varName) => {
        const label = getFieldLabel(varName);
        const isLong = isLongText(varName);
        const value = values[varName] || "";

        return (
          <div key={varName} className="space-y-1.5">
            <Label htmlFor={varName} className="text-xs font-medium">
              {label}
            </Label>
            {isLong ? (
              <Textarea
                id={varName}
                value={value}
                onChange={(e) => onChange(varName, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}...`}
                className="text-xs min-h-[80px]"
                rows={3}
              />
            ) : (
              <Input
                id={varName}
                value={value}
                onChange={(e) => onChange(varName, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}...`}
                className="h-8 text-xs"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
