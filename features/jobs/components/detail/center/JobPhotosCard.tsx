"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Loader2 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const LazyPhotosSection = dynamic(
  () => import("../../JobPhotosSection").then((m) => ({ default: m.JobPhotosSection })),
  { ssr: false, loading: () => <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div> }
);

interface Props {
  jobId: string;
}

export function JobPhotosCard({ jobId }: Props) {
  const { ref, inView } = useInView("200px");

  return (
    <Card ref={ref}>
      <CardContent className="p-4">
        {inView ? (
          <LazyPhotosSection jobId={jobId} />
        ) : (
          <div className="flex items-center gap-2 py-4 text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            <span className="text-sm">Job Photos</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
