"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplatePicker } from "./TemplatePicker";

interface CreatePageWrapperProps {
  estimateId: string;
}

export function CreatePageWrapper({ estimateId }: CreatePageWrapperProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <TemplatePicker
      open={open}
      onClose={() => {
        setOpen(false);
        router.replace("/estimate-pages/templates");
      }}
      estimateId={estimateId}
      onCreated={(pageId) => {
        router.push(`/estimate-pages/${pageId}`);
      }}
    />
  );
}
