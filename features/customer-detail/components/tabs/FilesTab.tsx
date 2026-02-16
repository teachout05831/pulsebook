"use client";

import { useState } from "react";
import { Upload, Camera, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomerFiles, formatFileSize } from "@/features/customer-files";
import { UploadFileModal } from "@/features/customer-files/components/UploadFileModal";
import type { CustomerFile, FileCategory } from "@/features/customer-files";
import { PhotoCard, FileListCard, ImagePreviewModal } from "./files";

interface FilesTabProps {
  customerId: string;
}

type FilterType = "all" | "photos" | "documents" | "contracts";

function FileSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {title} ({count})
      </h3>
      {children}
    </div>
  );
}

export function FilesTab({ customerId }: FilesTabProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<FileCategory>("document");
  const [previewFile, setPreviewFile] = useState<CustomerFile | null>(null);

  const {
    files, photos, documents, contracts, totalSize,
    isLoading, handleUpload, handleDelete, handleDownload,
  } = useCustomerFiles(customerId);

  const openUpload = (category: FileCategory) => {
    setUploadCategory(category);
    setUploadOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Files & Photos</h2>
          <p className="text-sm text-muted-foreground">{files.length} files - {formatFileSize(totalSize)} total</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => openUpload("photo")}>
            <Camera className="mr-2 h-4 w-4" />Add Photo
          </Button>
          <Button className="flex-1 sm:flex-initial" onClick={() => openUpload("document")}>
            <Upload className="mr-2 h-4 w-4" />Upload Files
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(["all", "photos", "documents", "contracts"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className="shrink-0" onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} (
            {f === "all" ? files.length : f === "photos" ? photos.length : f === "documents" ? documents.length : contracts.length}
            )
          </Button>
        ))}
      </div>

      {files.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No files uploaded yet</p>
            <p className="text-sm">Upload photos, documents, or contracts for this customer</p>
          </CardContent>
        </Card>
      )}

      {photos.length > 0 && (filter === "all" || filter === "photos") && (
        <FileSection title="Photos" count={photos.length}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((file) => (
              <PhotoCard key={file.id} file={file} onDownload={handleDownload} onDelete={handleDelete} onPreview={() => setPreviewFile(file)} />
            ))}
          </div>
        </FileSection>
      )}

      {documents.length > 0 && (filter === "all" || filter === "documents") && (
        <FileSection title="Documents" count={documents.length}>
          <FileListCard files={documents} onDownload={handleDownload} onDelete={handleDelete} />
        </FileSection>
      )}

      {contracts.length > 0 && (filter === "all" || filter === "contracts") && (
        <FileSection title="Contracts" count={contracts.length}>
          <FileListCard files={contracts} onDownload={handleDownload} onDelete={handleDelete} showSigned />
        </FileSection>
      )}

      <UploadFileModal open={uploadOpen} onOpenChange={setUploadOpen} onUpload={handleUpload} defaultCategory={uploadCategory} />
      {previewFile && <ImagePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
    </div>
  );
}
