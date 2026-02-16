"use client";

import { useSchedulingPages } from "../hooks/useSchedulingPages";
import { CreateSchedulingPageDialog } from "./CreateSchedulingPageDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Globe, Trash2, ExternalLink, Copy, CalendarDays, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SchedulingPageDashboard() {
  const { pages, isLoading, error, refresh, remove, publish } = useSchedulingPages();
  const router = useRouter();

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const result = await remove(id);
    if (result.success) toast.success("Page deleted");
    else toast.error(result.error);
  };

  const handlePublish = async (id: string) => {
    const result = await publish(id);
    if (result.success) toast.success("Page published");
    else toast.error(result.error);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-72 mt-2" /></div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-lg p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4"><Skeleton className="h-5 flex-1" /><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-12" /></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-destructive font-medium">Failed to load scheduling pages</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={refresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Online Booking</h1>
          <p className="text-muted-foreground mt-1">Create and manage scheduling pages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/scheduling/bookings")}><CalendarDays className="h-4 w-4 mr-2" />View Bookings</Button>
          <CreateSchedulingPageDialog>
            <Button><Plus className="h-4 w-4 mr-2" />New Page</Button>
          </CreateSchedulingPageDialog>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-16 border rounded-lg border-dashed">
          <p className="text-muted-foreground mb-4">No scheduling pages yet</p>
          <CreateSchedulingPageDialog>
            <Button variant="outline"><Plus className="h-4 w-4 mr-2" />Create Your First Page</Button>
          </CreateSchedulingPageDialog>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Views</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{page.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">/s/{page.publicToken}</td>
                  <td className="px-4 py-3">
                    <Badge variant={page.status === "published" ? "default" : "secondary"}>
                      {page.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{page.totalViews}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/scheduling/${page.id}/builder`)}>
                          <Pencil className="h-4 w-4 mr-2" />Edit in Builder
                        </DropdownMenuItem>
                        {page.status === "published" && (
                          <DropdownMenuItem onClick={() => window.open(`/s/${page.publicToken}`, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />View Public Page
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleCopyLink(page.publicToken)}>
                          <Copy className="h-4 w-4 mr-2" />Copy Link
                        </DropdownMenuItem>
                        {page.status === "draft" && (
                          <DropdownMenuItem onClick={() => handlePublish(page.id)}>
                            <Globe className="h-4 w-4 mr-2" />Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(page.id, page.name)}>
                          <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
