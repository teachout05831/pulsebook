"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EstimatesList } from "./EstimatesList";
import { AIConsultationsTab } from "@/features/document-layer/components/AIConsultationsTab";

export function EstimatesListWithTabs() {
  return (
    <Tabs defaultValue="estimates">
      <TabsList className="mb-4">
        <TabsTrigger value="estimates">Estimates</TabsTrigger>
        <TabsTrigger value="ai-consultations">AI Consultations</TabsTrigger>
      </TabsList>
      <TabsContent value="estimates">
        <EstimatesList />
      </TabsContent>
      <TabsContent value="ai-consultations">
        <AIConsultationsTab />
      </TabsContent>
    </Tabs>
  );
}
