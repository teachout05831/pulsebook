"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

interface ListPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startItem: number;
  endItem: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: string) => void;
}

export function ListPagination({
  currentPage, totalPages, pageSize,
  startItem, endItem, total,
  onPageChange, onPageSizeChange,
}: ListPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Showing {startItem}-{endItem} of {total}</span>
        <span className="mx-2">|</span><span>Rows per page:</span>
        <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
          <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
