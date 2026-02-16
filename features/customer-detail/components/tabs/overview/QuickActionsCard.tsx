"use client";

import { Phone, MessageSquare, Mail, FileText, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsCardProps {
  customerPhone?: string | null;
  customerEmail?: string | null;
}

export function QuickActionsCard({ customerPhone, customerEmail }: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {customerPhone && (
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href={`tel:${customerPhone}`}>
              <Phone className="mr-2 h-4 w-4" />Call Customer
            </a>
          </Button>
        )}
        {customerPhone && (
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href={`sms:${customerPhone}`}>
              <MessageSquare className="mr-2 h-4 w-4" />Send Text
            </a>
          </Button>
        )}
        {customerEmail && (
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href={`mailto:${customerEmail}`}>
              <Mail className="mr-2 h-4 w-4" />Send Email
            </a>
          </Button>
        )}
        <Button variant="outline" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />Add Note
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <DollarSign className="mr-2 h-4 w-4" />Create Estimate
        </Button>
      </CardContent>
    </Card>
  );
}
