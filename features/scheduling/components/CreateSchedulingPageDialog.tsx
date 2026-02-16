"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSchedulingPages } from "../hooks/useSchedulingPages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Props {
  children: React.ReactNode;
}

export function CreateSchedulingPageDialog({ children }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { create } = useSchedulingPages();
  const router = useRouter();

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(toSlug(val));
  };

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    if (!slug.trim()) { toast.error("Slug is required"); return; }

    setIsSubmitting(true);
    const result = await create({ name: name.trim(), slug: slug.trim() });
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Scheduling page created");
    setOpen(false);
    setName("");
    setSlug("");

    if (result.data?.id) {
      router.push(`/scheduling/${result.data.id}/builder`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Scheduling Page</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="page-name">Page Name</Label>
            <Input
              id="page-name"
              placeholder="e.g., Main Booking Page"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="page-slug">URL Slug</Label>
            <Input
              id="page-slug"
              placeholder="e.g., book-now"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Public URL will be: /s/[auto-generated-token]
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
