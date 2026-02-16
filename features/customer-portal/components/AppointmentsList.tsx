"use client";

import { Video, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerAppointments } from "../hooks/useCustomerAppointments";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AppointmentsList() {
  const { appointments, isLoading, error } = useCustomerAppointments();

  if (isLoading) {
    return <div className="animate-pulse h-40 rounded bg-muted" />;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (appointments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No upcoming appointments.
      </p>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="space-y-3 md:hidden">
        {appointments.map((apt) => (
          <div
            key={`${apt.type}-${apt.id}`}
            className="rounded-lg border bg-white p-3"
          >
            <div className="flex items-center gap-2">
              {apt.type === "consultation" ? (
                <Video className="h-4 w-4 shrink-0 text-blue-600" />
              ) : (
                <MapPin className="h-4 w-4 shrink-0 text-green-600" />
              )}
              <p className="font-medium text-sm truncate">{apt.title}</p>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="secondary" className="text-xs">
                {apt.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(apt.date)}
              </span>
            </div>
            {apt.type === "consultation" && apt.publicToken && (
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <a
                  href={`/c/${apt.publicToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Call
                </a>
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt) => (
              <TableRow key={`${apt.type}-${apt.id}`}>
                <TableCell>
                  {apt.type === "consultation" ? (
                    <Video className="h-4 w-4 text-blue-600" />
                  ) : (
                    <MapPin className="h-4 w-4 text-green-600" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{apt.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(apt.date)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{apt.status}</Badge>
                </TableCell>
                <TableCell>
                  {apt.type === "consultation" && apt.publicToken && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`/c/${apt.publicToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Call
                      </a>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
