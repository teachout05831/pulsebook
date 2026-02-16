"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props {
  jobId: string;
}

export function LinkedJobCard({ jobId }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">Linked Job</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            A job has been created from this estimate.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/jobs/${jobId}`}>
              View Job <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
