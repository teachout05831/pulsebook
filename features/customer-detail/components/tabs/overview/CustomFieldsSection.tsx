"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomFieldDefinitions } from "@/features/custom-fields/hooks/useCustomFieldDefinitions";

interface CustomFieldsSectionProps {
  customFields?: Record<string, unknown>;
}

export function CustomFieldsSection({ customFields }: CustomFieldsSectionProps) {
  const { sections } = useCustomFieldDefinitions("customer");
  const hasValues = customFields && Object.keys(customFields).length > 0;

  if (!hasValues || sections.length === 0) return null;

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const fieldsWithValues = section.fields.filter(
          (f) => customFields[f.fieldKey] !== undefined && customFields[f.fieldKey] !== ""
        );
        if (fieldsWithValues.length === 0) return null;
        return (
          <Card key={section.name}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{section.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {fieldsWithValues.map((field) => (
                  <div key={field.fieldKey}>
                    <div className="text-sm text-muted-foreground">{field.label}</div>
                    <div className="text-sm font-medium mt-0.5">
                      {field.fieldType === "checkbox"
                        ? customFields[field.fieldKey] ? "Yes" : "No"
                        : String(customFields[field.fieldKey])}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
